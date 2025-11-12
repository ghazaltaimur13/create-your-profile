import type { PortfolioTemplateId } from '../types/portfolio'

export type PortfolioTemplateOption = {
  id: PortfolioTemplateId
  name: string
  description: string
  accent: string
}

export const DEFAULT_TEMPLATE_ID: PortfolioTemplateId = 'modern'

export const PORTFOLIO_TEMPLATE_OPTIONS: PortfolioTemplateOption[] = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean typography with generous spacing and clear sectioning.',
    accent: '#2563eb',
  },
  {
    id: 'spotlight',
    name: 'Spotlight',
    description: 'Bold left column spotlighting your profile with contrasting accents.',
    accent: '#0f172a',
  },
  {
    id: 'balanced',
    name: 'Balanced',
    description: 'Warm gradient hero with compact content blocks for quick scanning.',
    accent: '#7c3aed',
  },
]

