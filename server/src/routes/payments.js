import express, { Router } from 'express'
import Stripe from 'stripe'
import { requireAuth } from '../middleware/auth.js'
import { pool } from '../db.js'

const {
  STRIPE_SECRET_KEY,
  STRIPE_PRICE_ID,
  STRIPE_SUCCESS_URL = 'http://localhost:5173/?upgrade=success',
  STRIPE_CANCEL_URL = 'http://localhost:5173/?upgrade=cancelled',
  STRIPE_WEBHOOK_SECRET,
} = process.env

if (!STRIPE_SECRET_KEY) {
  console.warn('[Stripe] STRIPE_SECRET_KEY not configured. Payments routes will be disabled.')
}

const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null

const router = Router()

const ensureSuccessUrl = (rawUrl) => {
  const url = rawUrl || STRIPE_SUCCESS_URL
  return url?.includes('{CHECKOUT_SESSION_ID}') ? url : `${url}${url?.includes('?') ? '&' : '?'}session_id={CHECKOUT_SESSION_ID}`
}

router.post('/create-checkout-session', requireAuth, async (req, res) => {
  if (!stripe || !STRIPE_PRICE_ID) {
    return res.status(500).json({ error: 'Stripe is not configured' })
  }

  const { returnUrl } = req.body ?? {}

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price: STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      customer_email: req.user.email,
      metadata: {
        userId: String(req.user.id ?? ''),
      },
      success_url: ensureSuccessUrl(returnUrl),
      cancel_url: STRIPE_CANCEL_URL,
    })

    return res.json({ url: session.url })
  } catch (error) {
    console.error('Stripe error', error)
    return res.status(500).json({ error: 'Unable to create checkout session' })
  }
})

export const registerStripeWebhook = (app) => {
  if (!stripe || !STRIPE_WEBHOOK_SECRET) {
    app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), (req, res) => res.status(200).end())
    return
  }

  app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), (req, res) => {
    const sig = req.headers['stripe-signature']
    let event
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET)
    } catch (err) {
      console.error('Webhook signature verification failed', err.message)
      return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const userId = session.metadata?.userId
      if (userId) {
        pool
          .query(
            'UPDATE users SET plan = "pro", plan_activated_at = NOW(), plan_type = "lifetime" WHERE id = ?',
            [userId],
          )
          .catch((error) => console.error('Failed to update user plan', error))
      }
    }

    res.json({ received: true })
  })
}

router.post('/confirm-session', requireAuth, async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ error: 'Stripe is not configured' })
  }
  const { sessionId } = req.body ?? {}
  if (!sessionId) {
    return res.status(400).json({ error: 'sessionId is required' })
  }
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Payment not completed' })
    }
    const userId = session.metadata?.userId
    if (!userId || Number(userId) !== Number(req.user.id)) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    await pool.query('UPDATE users SET plan = "pro", plan_activated_at = NOW(), plan_type = "lifetime" WHERE id = ?', [
      req.user.id,
    ])
    const [rows] = await pool.query(
      'SELECT id, email, plan, plan_type, plan_activated_at FROM users WHERE id = ? LIMIT 1',
      [req.user.id],
    )
    const updatedUser = Array.isArray(rows) ? rows[0] : null
    return res.json({
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        plan: updatedUser.plan,
        planType: updatedUser.plan_type ?? 'lifetime',
        planActivatedAt: updatedUser.plan_activated_at,
      },
    })
  } catch (error) {
    console.error('Stripe confirm error', error)
    return res.status(500).json({ error: 'Unable to confirm payment' })
  }
})

export default router


