import type { User } from '../types/user'

export const FREE_LIMITS = {
  maxPortfolios: 2,
  allowedTemplateIds: ['modern'], // keep basic to 1 template for now
  allowedThemeIds: ['base'],
  watermark: true,
}

export const PRO_LIMITS = {
  maxPortfolios: Number.POSITIVE_INFINITY,
  allowedTemplateIds: 'all' as const,
  allowedThemeIds: 'all' as const,
  watermark: false,
  pdfQuality: 'high' as const,
}

export function isPro(user: User): boolean {
  return user.plan === 'pro'
}

export function canCreateResume(user: User, currentCount: number): boolean {
  if (isPro(user)) return true
  return currentCount < FREE_LIMITS.maxPortfolios
}

// Optional helpers you can use later as you gate features
export function shouldShowWatermark(user: User): boolean {
  return !isPro(user) && FREE_LIMITS.watermark
}

// Alias to match current usage in components
export function shouldShow(user: User): boolean {
  return shouldShowWatermark(user)
}


