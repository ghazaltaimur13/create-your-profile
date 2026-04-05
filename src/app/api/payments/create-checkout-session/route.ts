import { NextResponse } from 'next/server'

import { getAuthUser } from '@/lib/auth'
import { ensureSuccessUrl, getStripe } from '@/lib/stripe'

export const runtime = 'nodejs'

const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID
const STRIPE_CANCEL_URL = process.env.STRIPE_CANCEL_URL ?? 'http://localhost:3000/?upgrade=cancelled'
const STRIPE_SUCCESS_FALLBACK =
  process.env.STRIPE_SUCCESS_URL ?? 'http://localhost:3000/?upgrade=success&session_id={CHECKOUT_SESSION_ID}'

export async function POST(request: Request) {
  const user = getAuthUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const stripe = getStripe()
  if (!stripe || !STRIPE_PRICE_ID) {
    return NextResponse.json({ error: 'Stripe is not configured' }, { status: 500 })
  }

  let body: { returnUrl?: string }
  try {
    body = await request.json()
  } catch {
    body = {}
  }

  try {
    const successUrl = ensureSuccessUrl(body.returnUrl, STRIPE_SUCCESS_FALLBACK)
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price: STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      customer_email: user.email,
      metadata: {
        userId: String(user.id),
      },
      success_url: successUrl,
      cancel_url: STRIPE_CANCEL_URL,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe error', error)
    return NextResponse.json({ error: 'Unable to create checkout session' }, { status: 500 })
  }
}
