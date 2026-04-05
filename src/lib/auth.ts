import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret'

export type AuthUser = {
  id: number
  email: string
}

export function signToken(payload: { sub: number; email: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function getAuthUser(request: Request): AuthUser | null {
  const authHeader = request.headers.get('authorization') ?? ''
  if (!authHeader.startsWith('Bearer ')) return null
  const token = authHeader.slice(7)
  try {
    const payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & { email?: string }
    return {
      id: Number(payload.sub),
      email: String(payload.email ?? ''),
    }
  } catch {
    return null
  }
}
