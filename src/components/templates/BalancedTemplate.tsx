import { forwardRef } from 'react'

import type { TemplateProps } from './types'

export const BalancedTemplate = forwardRef<HTMLDivElement, TemplateProps>(({ data }, ref) => {
  const { personal, socials, skills, projects, experience, education } = data

  const filteredSocials = socials.filter((item) => item.label || item.url)
  const filteredSkills = skills.filter((item) => item.category || item.items)
  const filteredProjects = projects.filter((item) => item.name || item.description)
  const filteredExperience = experience.filter((item) => item.company || item.role)
  const filteredEducation = education.filter((item) => item.institution || item.degree)

  return (
    <div ref={ref} className="overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-slate-200">
      <header className="bg-gradient-to-br from-primary-600 via-primary-500 to-indigo-500 p-8 text-white">
        <p className="text-xs uppercase tracking-[0.4em] text-primary-200/90">Portfolio</p>
        <h1 className="mt-3 text-3xl font-semibold">{personal.name || 'Your Name'}</h1>
        <p className="mt-1 text-sm text-primary-100/90">{personal.title || 'Role / Headline'}</p>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-primary-100/80">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.website && <span className="truncate">{personal.website}</span>}
        </div>
        {filteredSocials.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-primary-100">
            {filteredSocials.map((item, index) => (
              <a
                key={`${item.label}-${item.url}-${index}`}
                href={item.url}
                className="rounded-full bg-white/15 px-3 py-1 hover:bg-white/25"
                target="_blank"
                rel="noreferrer"
              >
                {item.label || item.url}
              </a>
            ))}
          </div>
        )}
      </header>

      <div className="space-y-8 p-8">
        {personal.summary && (
          <section className="rounded-3xl border border-slate-200/70 bg-white/60 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-primary-700">Summary</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">{personal.summary}</p>
          </section>
        )}

        {filteredSkills.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-primary-700">Skills</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {filteredSkills.map((skill) => (
                <div key={skill.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {skill.category}
                  </p>
                  <p className="mt-2 text-sm text-slate-700">{skill.items}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {filteredExperience.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-primary-700">Experience</h2>
            <div className="mt-4 space-y-5">
              {filteredExperience.map((role, index) => (
                <article key={role.id} className="relative rounded-3xl border border-slate-200 bg-white/70 p-6">
                  <span className="absolute -left-3 top-6 inline-flex h-6 w-6 items-center justify-center rounded-full border border-primary-200 bg-white text-xs font-semibold text-primary-600">
                    {index + 1}
                  </span>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">{role.role}</h3>
                      <p className="text-sm text-slate-600">{role.company}</p>
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">
                      {[role.startDate, role.endDate].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                  {role.location && <p className="text-xs text-slate-500">{role.location}</p>}
                  <p className="mt-3 text-sm leading-relaxed text-slate-700">{role.description}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {filteredProjects.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-primary-700">Projects</h2>
            <div className="mt-4 space-y-4">
              {filteredProjects.map((project) => (
                <article key={project.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-base font-semibold text-slate-900">{project.name}</h3>
                    {project.link && (
                      <a
                        href={project.link}
                        className="text-xs font-semibold uppercase tracking-wide text-primary-600"
                        target="_blank"
                        rel="noreferrer"
                      >
                        View
                      </a>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-slate-700">{project.description}</p>
                  {project.technologies && (
                    <p className="mt-3 text-xs uppercase tracking-wide text-slate-500">{project.technologies}</p>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {filteredEducation.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-primary-700">Education</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {filteredEducation.map((item) => (
                <article key={item.id} className="rounded-3xl border border-slate-200 bg-white/70 p-5">
                  <h3 className="text-base font-semibold text-slate-900">{item.degree}</h3>
                  <p className="text-sm text-slate-600">{item.institution}</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-primary-600">
                    {[item.startDate, item.endDate].filter(Boolean).join(' · ')}
                  </p>
                  <p className="mt-3 text-sm text-slate-700">{item.description}</p>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
})

BalancedTemplate.displayName = 'BalancedTemplate'

