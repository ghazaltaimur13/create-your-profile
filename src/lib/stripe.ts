import Stripe from 'stripe'

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return null
  return new Stripe(key)
}

export function ensureSuccessUrl(rawUrl: string | undefined, fallback: string): string {
  const url = rawUrl || fallback
  if (url.includes('{CHECKOUT_SESSION_ID}')) return url
  return `${url}${url.includes('?') ? '&' : '?'}session_id={CHECKOUT_SESSION_ID}`
}
