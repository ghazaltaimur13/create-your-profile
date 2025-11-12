import { forwardRef, type ForwardRefExoticComponent, type RefAttributes } from 'react'

import type { PortfolioFormValues, PortfolioTemplateId } from '../types/portfolio'
import { BalancedTemplate } from './templates/BalancedTemplate'
import { ModernTemplate } from './templates/ModernTemplate'
import { SpotlightTemplate } from './templates/SpotlightTemplate'
import type { TemplateProps } from './templates/types'

type TemplateComponent = ForwardRefExoticComponent<TemplateProps & RefAttributes<HTMLDivElement>>

const TEMPLATE_COMPONENTS: Record<PortfolioTemplateId, TemplateComponent> = {
  modern: ModernTemplate,
  spotlight: SpotlightTemplate,
  balanced: BalancedTemplate,
}

type PortfolioPreviewProps = {
  data: PortfolioFormValues
  template: PortfolioTemplateId
}

export const PortfolioPreview = forwardRef<HTMLDivElement, PortfolioPreviewProps>(
  ({ data, template }, ref) => {
    const TemplateComponent = TEMPLATE_COMPONENTS[template] ?? ModernTemplate

    return <TemplateComponent ref={ref} data={data} />
  },
)

PortfolioPreview.displayName = 'PortfolioPreview'

