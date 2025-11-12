import { forwardRef } from 'react'

import type { TemplateProps } from './types'

export const ModernTemplate = forwardRef<HTMLDivElement, TemplateProps>(({ data }, ref) => {
  const { personal, socials, skills, projects, experience, education } = data

  const filteredSocials = socials.filter((item) => item.label || item.url)
  const filteredSkills = skills.filter((item) => item.category || item.items)
  const filteredProjects = projects.filter((item) => item.name || item.description)
  const filteredExperience = experience.filter((item) => item.company || item.role)
  const filteredEducation = education.filter((item) => item.institution || item.degree)

  return (
    <div ref={ref} className="rounded-3xl bg-white shadow-card ring-1 ring-slate-200">
      <div className="space-y-8 p-8">
        <header className="border-b border-slate-200 pb-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold text-slate-900">{personal.name || 'Your Name'}</h1>
            <p className="text-lg font-medium text-primary-600">{personal.title || 'Role / Headline'}</p>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && <span>{personal.phone}</span>}
            {personal.location && <span>{personal.location}</span>}
            {personal.website && <span className="truncate">{personal.website}</span>}
          </div>
          {filteredSocials.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-3 text-sm text-primary-600">
              {filteredSocials.map((item, index) => (
                <a
                  key={`${item.label}-${item.url}-${index}`}
                  href={item.url}
                  className="hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.label || item.url}
                </a>
              ))}
            </div>
          )}
        </header>

        {personal.summary && (
          <section>
            <h2 className="text-lg font-semibold uppercase tracking-wide text-slate-500">Summary</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">{personal.summary}</p>
          </section>
        )}

        {filteredSkills.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold uppercase tracking-wide text-slate-500">Skills</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {filteredSkills.map((skill) => (
                <div key={skill.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-700">{skill.category}</p>
                  <p className="mt-2 text-sm text-slate-600">{skill.items}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {filteredProjects.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold uppercase tracking-wide text-slate-500">Projects</h2>
            <div className="mt-3 space-y-4">
              {filteredProjects.map((project) => (
                <article key={project.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-base font-semibold text-slate-800">{project.name}</h3>
                    {project.link && (
                      <a
                        href={project.link}
                        className="text-sm font-medium text-primary-600 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        View project
                      </a>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{project.description}</p>
                  {project.technologies && (
                    <p className="mt-3 text-xs uppercase tracking-wide text-slate-500">{project.technologies}</p>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {filteredExperience.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold uppercase tracking-wide text-slate-500">Experience</h2>
            <div className="mt-3 space-y-5">
              {filteredExperience.map((role) => (
                <article key={role.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <h3 className="text-base font-semibold text-slate-800">{role.role}</h3>
                      <p className="text-sm text-slate-600">{role.company}</p>
                    </div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      {[role.startDate, role.endDate].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                  {role.location && <p className="text-xs text-slate-500">{role.location}</p>}
                  <p className="mt-3 text-sm text-slate-600">{role.description}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {filteredEducation.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold uppercase tracking-wide text-slate-500">Education</h2>
            <div className="mt-3 space-y-4">
              {filteredEducation.map((item) => (
                <article key={item.id} className="rounded-2xl border border-slate-200 p-4">
                  <h3 className="text-base font-semibold text-slate-800">{item.degree}</h3>
                  <p className="text-sm text-slate-600">{item.institution}</p>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    {[item.startDate, item.endDate].filter(Boolean).join(' · ')}
                  </p>
                  <p className="mt-3 text-sm text-slate-600">{item.description}</p>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
})

ModernTemplate.displayName = 'ModernTemplate'

