import type { RowDataPacket } from 'mysql2/promise'
import { NextResponse } from 'next/server'

import { getAuthUser } from '@/lib/auth'
import { pool } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const user = getAuthUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, email, plan, plan_type, plan_activated_at FROM users WHERE id = ? LIMIT 1',
      [user.id],
    )
    const row = Array.isArray(rows) && rows[0]
    if (!row) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    return NextResponse.json({
      user: {
        id: row.id,
        email: row.email,
        plan: row.plan,
        planType: row.plan_type ?? 'lifetime',
        planActivatedAt: row.plan_activated_at,
      },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
