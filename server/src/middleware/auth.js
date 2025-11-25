import jwt from 'jsonwebtoken'

const { JWT_SECRET = 'dev-secret' } = process.env

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = {
      id: payload.sub,
      email: payload.email,
    }
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}


