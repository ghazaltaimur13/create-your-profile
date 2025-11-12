import { forwardRef } from 'react'

import type { TemplateProps } from './types'

export const SpotlightTemplate = forwardRef<HTMLDivElement, TemplateProps>(({ data }, ref) => {
  const { personal, socials, skills, projects, experience, education } = data

  const filteredSocials = socials.filter((item) => item.label || item.url)
  const filteredSkills = skills.filter((item) => item.category || item.items)
  const filteredProjects = projects.filter((item) => item.name || item.description)
  const filteredExperience = experience.filter((item) => item.company || item.role)
  const filteredEducation = education.filter((item) => item.institution || item.degree)

  return (
    <div
      ref={ref}
      className="grid overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-slate-200 md:grid-cols-[260px_1fr]"
    >
      <aside className="flex flex-col gap-6 bg-slate-900 p-8 text-slate-100">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Profile</p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight text-white">
            {personal.name || 'Your Name'}
          </h1>
          <p className="mt-2 text-sm text-slate-300">{personal.title || 'Role / Headline'}</p>
        </div>

        <div className="space-y-2 text-xs">
          {personal.email && <p className="font-medium text-white">{personal.email}</p>}
          {personal.phone && <p className="text-slate-300">{personal.phone}</p>}
          {personal.location && <p className="text-slate-300">{personal.location}</p>}
          {personal.website && <p className="truncate text-slate-300">{personal.website}</p>}
        </div>

        {filteredSocials.length > 0 && (
          <div className="space-y-2 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Connect</p>
            <div className="flex flex-col gap-1">
              {filteredSocials.map((item, index) => (
                <a
                  key={`${item.label}-${item.url}-${index}`}
                  href={item.url}
                  className="text-slate-200 hover:text-primary-300"
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.label || item.url}
                </a>
              ))}
            </div>
          </div>
        )}

        {filteredSkills.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Skills</p>
            <div className="mt-3 space-y-3">
              {filteredSkills.map((skill) => (
                <div key={skill.id} className="rounded-2xl bg-slate-800/70 p-3">
                  <p className="text-xs font-semibold text-slate-200">{skill.category}</p>
                  <p className="mt-1 text-xs text-slate-400">{skill.items}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      <main className="space-y-8 p-8">
        {personal.summary && (
          <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Summary</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">{personal.summary}</p>
          </section>
        )}

        {filteredExperience.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Experience</h2>
            <div className="space-y-4">
              {filteredExperience.map((role) => (
                <article key={role.id} className="rounded-2xl border border-slate-200 p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">{role.role}</h3>
                      <p className="text-sm text-slate-600">{role.company}</p>
                    </div>
                    <p className="text-xs font-medium uppercase tracking-wide text-primary-600">
                      {[role.startDate, role.endDate].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                  {role.location && <p className="text-xs text-slate-500">{role.location}</p>}
                  <p className="mt-3 text-sm text-slate-700">{role.description}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {filteredProjects.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Projects</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {filteredProjects.map((project) => (
                <article key={project.id} className="rounded-2xl border border-slate-200 p-5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-semibold text-slate-900">{project.name}</h3>
                    {project.link && (
                      <a
                        href={project.link}
                        className="text-xs font-medium uppercase tracking-wide text-primary-600"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Visit
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
          <section className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Education</h2>
            <div className="space-y-3">
              {filteredEducation.map((item) => (
                <article key={item.id} className="rounded-2xl border border-slate-200 p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">{item.degree}</h3>
                      <p className="text-sm text-slate-600">{item.institution}</p>
                    </div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      {[item.startDate, item.endDate].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                  <p className="mt-2 text-sm text-slate-700">{item.description}</p>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
})

SpotlightTemplate.displayName = 'SpotlightTemplate'

