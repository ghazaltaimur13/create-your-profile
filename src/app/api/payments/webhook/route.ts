import { NextResponse } from 'next/server'

import { pool } from '@/lib/db'
import { getStripe } from '@/lib/stripe'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const stripe = getStripe()
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!stripe || !webhookSecret) {
    return new NextResponse(null, { status: 200 })
  }

  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 })
  }

  const rawBody = Buffer.from(await request.arrayBuffer())

  let event: import('stripe').Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Webhook signature verification failed', message)
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as import('stripe').Stripe.Checkout.Session
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

  return NextResponse.json({ received: true })
}
