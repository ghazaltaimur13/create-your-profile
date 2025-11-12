import type { PortfolioFormValues } from '../types/portfolio'

const createId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 10)

export const defaultPortfolio: PortfolioFormValues = {
  personal: {
    name: 'Jordan Smith',
    title: 'Full-Stack Developer',
    email: 'jordan@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    website: 'jordansmith.dev',
    summary:
      'Full-stack engineer focused on crafting accessible, human-centered web applications with React, TypeScript, and cloud-native tooling.',
  },
  socials: [
    { label: 'LinkedIn', url: 'https://linkedin.com/in/jordansmith' },
    { label: 'GitHub', url: 'https://github.com/jordansmith' },
  ],
  skills: [
    { id: createId(), category: 'Frontend', items: 'React, Next.js, TypeScript, Tailwind CSS' },
    { id: createId(), category: 'Backend', items: 'Node.js, GraphQL, PostgreSQL, Prisma' },
  ],
  projects: [
    {
      id: createId(),
      name: 'Realtime Collaboration Suite',
      description:
        'Led the development of a document collaboration platform with offline support and CRDT-based sync, serving 50k+ monthly users.',
      link: 'https://app.collabsuite.dev',
      technologies: 'React, Zustand, WebRTC, AWS',
    },
  ],
  experience: [
    {
      id: createId(),
      company: 'Nimbus Labs',
      role: 'Senior Software Engineer',
      location: 'Remote',
      startDate: '2022',
      endDate: 'Present',
      description:
        'Architected end-to-end feature flows and mentored a cross-functional team delivering accessible web experiences.',
    },
  ],
  education: [
    {
      id: createId(),
      institution: 'State University',
      degree: 'B.S. Computer Science',
      startDate: '2014',
      endDate: '2018',
      description: 'Graduated with honors; research assistant in human-computer interaction lab.',
    },
  ],
}

