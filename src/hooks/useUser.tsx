import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { User } from '../types/user'
import { createDefaultUser } from '../types/user'
import { API_BASE_URL } from '../config/api'

type AuthResponse = { token: string; user: User }

type UserContextValue = {
  user: User
  token: string | null
  isAuthenticated: boolean
  signupWithCredentials: (
    email: string,
    password: string,
  ) => Promise<{ ok: true; user: User } | { ok: false; message: string }>
  loginWithCredentials: (
    email: string,
    password: string,
  ) => Promise<{ ok: true; user: User } | { ok: false; message: string }>
  startUpgradeFlow: (options?: { returnUrl?: string }) => Promise<{ ok: true } | { ok: false; message: string }>
  confirmUpgrade: (sessionId: string) => Promise<{ ok: true } | { ok: false; message: string }>
  refreshUser: () => Promise<{ ok: true } | { ok: false; message: string }>
  logout: () => void
}

const UserContext = createContext<UserContextValue | undefined>(undefined)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(() => {
    try {
      const raw = window.localStorage.getItem('auth:user')
      if (raw) return JSON.parse(raw) as User
    } catch {}
    return createDefaultUser()
  })
  const [token, setToken] = useState<string | null>(() => {
    try {
      return window.localStorage.getItem('auth:token')
    } catch {
      return null
    }
  })
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => Boolean(token))

  useEffect(() => {
    try {
      window.localStorage.setItem('auth:user', JSON.stringify(user))
      if (token) {
        window.localStorage.setItem('auth:token', token)
      } else {
        window.localStorage.removeItem('auth:token')
      }
      window.localStorage.setItem('auth:isAuthenticated', isAuthenticated ? 'true' : 'false')
    } catch {}
  }, [user, token, isAuthenticated])

  const persistAuth = (nextToken: string, nextUser: User) => {
    setToken(nextToken)
    setUser(nextUser)
    setIsAuthenticated(true)
  }

  const post = async (path: string, body: Record<string, unknown>): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = (await response.json().catch(() => null)) as AuthResponse | { error: string } | null
    if (!response.ok) {
      throw new Error((data as { error?: string })?.error ?? 'Unexpected server error')
    }
    return data as AuthResponse
  }

  const authorizedRequest = async <T = unknown>(
    path: string,
    init: RequestInit = {},
  ): Promise<{ data: T | null; error: Error | null }> => {
    if (!token) {
      return { data: null, error: new Error('Not authenticated') }
    }
    try {
      const { headers, ...rest } = init
      const response = await fetch(`${API_BASE_URL}${path}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...(headers || {}),
        },
        ...rest,
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error((payload as { error?: string } | null)?.error ?? 'Request failed')
      }
      return { data: (payload as T) ?? null, error: null }
    } catch (error) {
      return { data: null, error: error instanceof Error ? error : new Error('Request failed') }
    }
  }

  const value = useMemo<UserContextValue>(
    () => ({
      user,
      token,
      isAuthenticated,
      signupWithCredentials: async (email: string, password: string) => {
        try {
          const data = await post('/api/auth/signup', { email, password })
          persistAuth(data.token, data.user)
          return { ok: true as const, user: data.user }
        } catch (error) {
          return {
            ok: false as const,
            message: error instanceof Error ? error.message : 'Unable to sign up',
          }
        }
      },
      loginWithCredentials: async (email: string, password: string) => {
        try {
          const data = await post('/api/auth/login', { email, password })
          persistAuth(data.token, data.user)
          return { ok: true as const, user: data.user }
        } catch (error) {
          return {
            ok: false as const,
            message: error instanceof Error ? error.message : 'Unable to log in',
          }
        }
      },
      startUpgradeFlow: async ({ returnUrl }: { returnUrl?: string } = {}) => {
        const defaultUrl =
          typeof window !== 'undefined'
            ? `${window.location.origin}?upgrade=success&session_id={CHECKOUT_SESSION_ID}`
            : 'http://localhost:5173/?upgrade=success&session_id={CHECKOUT_SESSION_ID}'
        const targetUrl = returnUrl ?? defaultUrl

        const { data, error } = await authorizedRequest<{ url: string }>('/api/payments/create-checkout-session', {
          method: 'POST',
          body: JSON.stringify({ returnUrl: targetUrl }),
        })

        if (error || !data?.url) {
          return { ok: false as const, message: error?.message ?? 'Unable to start upgrade' }
        }

        if (typeof window === 'undefined') {
          return { ok: false as const, message: 'Window is not available' }
        }

        window.location.href = data.url
        return { ok: true as const }
      },
      confirmUpgrade: async (sessionId: string) => {
        const { data, error } = await authorizedRequest<{ user: User }>('/api/payments/confirm-session', {
          method: 'POST',
          body: JSON.stringify({ sessionId }),
        })
        if (error || !data?.user) {
          return { ok: false as const, message: error?.message ?? 'Unable to confirm payment' }
        }
        setUser(data.user)
        return { ok: true as const }
      },
      refreshUser: async () => {
        const { data, error } = await authorizedRequest<{ user: User }>('/api/auth/me', {
          method: 'GET',
        })
        if (error || !data?.user) {
          return { ok: false as const, message: error?.message ?? 'Unable to fetch user' }
        }
        setUser(data.user)
        return { ok: true as const }
      },
      logout: () => {
        setIsAuthenticated(false)
        setToken(null)
        setUser(createDefaultUser())
      },
    }),
    [user, token, isAuthenticated],
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const ctx = useContext(UserContext)
  if (!ctx) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return ctx
}


