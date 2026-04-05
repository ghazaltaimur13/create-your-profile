import type { RowDataPacket } from 'mysql2/promise'
import { NextResponse } from 'next/server'

import { getAuthUser } from '@/lib/auth'
import { pool } from '@/lib/db'
import { getStripe } from '@/lib/stripe'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const user = getAuthUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const stripe = getStripe()
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe is not configured' }, { status: 500 })
  }

  let body: { sessionId?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { sessionId } = body
  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId is required' }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
    }
    const userId = session.metadata?.userId
    if (!userId || Number(userId) !== Number(user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await pool.query(
      'UPDATE users SET plan = "pro", plan_activated_at = NOW(), plan_type = "lifetime" WHERE id = ?',
      [user.id],
    )
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, email, plan, plan_type, plan_activated_at FROM users WHERE id = ? LIMIT 1',
      [user.id],
    )
    const updatedUser = Array.isArray(rows) ? rows[0] : null
    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
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
    return NextResponse.json({ error: 'Unable to confirm payment' }, { status: 500 })
  }
}
