export type Plan = 'free' | 'pro'

export type PlanType = 'lifetime' | 'one_time'

export type User = {
  id?: string | number
  email?: string
  plan: Plan
  planActivatedAt?: string | null
  planType?: PlanType
}

export const createDefaultUser = (): User => ({
  plan: 'free',
  planActivatedAt: null,
  planType: 'lifetime',
})


