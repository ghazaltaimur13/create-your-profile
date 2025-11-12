import { PORTFOLIO_STORAGE_KEY } from '../constants/storage'
import { DEFAULT_TEMPLATE_ID } from '../constants/templates'
import type {
  PortfolioDraft,
  PortfolioFormValues,
  PortfolioTemplateId,
} from '../types/portfolio'

type StoredDraftShape = {
  values?: unknown
  template?: PortfolioTemplateId
}

const isPortfolioFormValues = (value: unknown): value is PortfolioFormValues => {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  return (
    'personal' in candidate &&
    'skills' in candidate &&
    'projects' in candidate &&
    'experience' in candidate &&
    'education' in candidate &&
    Array.isArray((candidate as { socials?: unknown }).socials)
  )
}

export const readStoredDraft = (): PortfolioDraft | null => {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(PORTFOLIO_STORAGE_KEY)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as StoredDraftShape | PortfolioFormValues

    if (isPortfolioFormValues(parsed)) {
      return { values: parsed, template: DEFAULT_TEMPLATE_ID }
    }

    if (
      parsed &&
      typeof parsed === 'object' &&
      'values' in parsed &&
      parsed.values &&
      isPortfolioFormValues(parsed.values)
    ) {
      return {
        values: parsed.values,
        template: parsed.template ?? DEFAULT_TEMPLATE_ID,
      }
    }
  } catch (error) {
    console.warn('Unable to read stored portfolio draft', error)
  }

  return null
}

export const writeStoredDraft = (draft: PortfolioDraft) => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(draft))
  } catch (error) {
    console.warn('Unable to persist portfolio draft', error)
  }
}

export const clearStoredDraft = () => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(PORTFOLIO_STORAGE_KEY)
  } catch (error) {
    console.warn('Unable to clear stored portfolio draft', error)
  }
}

