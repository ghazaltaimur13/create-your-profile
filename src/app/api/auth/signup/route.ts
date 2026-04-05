import bcrypt from 'bcryptjs'
import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise'
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
    const [existing] = await pool.query<RowDataPacket[]>('SELECT id FROM users WHERE email = ?', [normalized])
    if (Array.isArray(existing) && existing.length > 0) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO users (email, password_hash, plan, plan_type) VALUES (?, ?, "free", "lifetime")',
      [normalized, passwordHash],
    )
    const userId = result.insertId
    const token = signToken({ sub: userId, email: normalized })

    return NextResponse.json(
      {
        token,
        user: {
          id: userId,
          email: normalized,
          plan: 'free',
          planType: 'lifetime',
          planActivatedAt: null,
        },
      },
      { status: 201 },
    )
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
