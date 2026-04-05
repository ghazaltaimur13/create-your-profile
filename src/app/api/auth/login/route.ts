import bcrypt from 'bcryptjs'
import type { RowDataPacket } from 'mysql2/promise'
import { NextResponse } from 'next/server'

import { signToken } from '@/lib/auth'
import { pool } from '@/lib/db'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  let body: { email?: string; password?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { email, password } = body
  if (!email || !password) {
    return NextResponse.json({ error: 'email and password are required' }, { status: 400 })
  }

  const normalized = String(email).toLowerCase()
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, email, password_hash, plan, plan_type, plan_activated_at FROM users WHERE email = ? LIMIT 1',
      [normalized],
    )
    const row = Array.isArray(rows) && rows[0]
    if (!row) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    const ok = await bcrypt.compare(password, row.password_hash as string)
    if (!ok) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = signToken({ sub: row.id as number, email: row.email as string })
    return NextResponse.json({
      token,
      user: {
        id: row.id,
        email: row.email,
        plan: row.plan,
        planType: row.plan_type ?? 'lifetime',
        planActivatedAt: row.plan_activated_at,
      },
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
