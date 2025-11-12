export type SocialLink = {
  label: string
  url: string
}

export type SkillGroup = {
  id: string
  category: string
  items: string
}

export type Project = {
  id: string
  name: string
  description: string
  link?: string
  technologies: string
}

export type Experience = {
  id: string
  company: string
  role: string
  location?: string
  startDate: string
  endDate: string
  description: string
}

export type Education = {
  id: string
  institution: string
  degree: string
  startDate: string
  endDate: string
  description: string
}

export type PortfolioFormValues = {
  personal: {
    name: string
    title: string
    email: string
    phone: string
    location: string
    website: string
    summary: string
  }
  socials: SocialLink[]
  skills: SkillGroup[]
  projects: Project[]
  experience: Experience[]
  education: Education[]
}

export type PortfolioTemplateId = 'modern' | 'spotlight' | 'balanced'

export type PortfolioDraft = {
  values: PortfolioFormValues
  template: PortfolioTemplateId
}

