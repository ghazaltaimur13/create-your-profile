import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
const { JWT_SECRET = 'dev-secret' } = process.env

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

router.post('/signup', async (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'email and password are required' })
  const normalized = String(email).toLowerCase()
  try {
    const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [normalized])
    if (Array.isArray(rows) && rows.length > 0) {
      return res.status(409).json({ error: 'Email already exists' })
    }
    const passwordHash = await bcrypt.hash(password, 10)
    const [result] = await pool.query(
      'INSERT INTO users (email, password_hash, plan, plan_type) VALUES (?, ?, "free", "lifetime")',
      [normalized, passwordHash],
    )
    const userId = result.insertId
    const token = signToken({ sub: userId, email: normalized })
    return res.status(201).json({
      token,
      user: { id: userId, email: normalized, plan: 'free', planType: 'lifetime', planActivatedAt: null },
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'email and password are required' })
  const normalized = String(email).toLowerCase()
  try {
    const [rows] = await pool.query(
      'SELECT id, email, password_hash, plan, plan_type, plan_activated_at FROM users WHERE email = ? LIMIT 1',
      [normalized],
    )
    const row = Array.isArray(rows) && rows[0]
    if (!row) return res.status(401).json({ error: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, row.password_hash)
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
    const token = signToken({ sub: row.id, email: row.email })
    return res.json({
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
    return res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/me', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, email, plan, plan_type, plan_activated_at FROM users WHERE id = ? LIMIT 1',
      [req.user.id],
    )
    const row = Array.isArray(rows) && rows[0]
    if (!row) return res.status(404).json({ error: 'User not found' })
    return res.json({
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
    return res.status(500).json({ error: 'Internal server error' })
  }
})

export default router


