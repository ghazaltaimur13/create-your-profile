import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import { Box, Button, Stack, Tab, Tabs, TextField, Typography } from '@mui/material'
import { type SyntheticEvent } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'

import type { PortfolioFormValues } from '../../types/portfolio'

type PortfolioFormProps = {
  activeTab: number
  onTabChange: (value: number) => void
}

const createId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 10)

const tabItems = [
  { label: 'Profile', value: 0 },
  { label: 'Skills', value: 1 },
  { label: 'Experience', value: 2 },
  { label: 'Projects', value: 3 },
  { label: 'Education', value: 4 },
]

export const PortfolioForm = ({ activeTab, onTabChange }: PortfolioFormProps) => {
  const { register, control } = useFormContext<PortfolioFormValues>()

  const socialsArray = useFieldArray({ control, name: 'socials' })
  const skillsArray = useFieldArray({ control, name: 'skills' })
  const experienceArray = useFieldArray({ control, name: 'experience' })
  const projectsArray = useFieldArray({ control, name: 'projects' })
  const educationArray = useFieldArray({ control, name: 'education' })

  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
    onTabChange(newValue)
  }

  return (
    <Stack spacing={3} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Portfolio form tabs"
        >
          {tabItems.map((tab) => (
            <Tab key={tab.value} label={tab.label} value={tab.value} sx={{ textTransform: 'none', fontWeight: 600 }} />
          ))}
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <Stack spacing={3}>
          <Typography variant="subtitle1" fontWeight={600} color="text.secondary">
            Personal details
          </Typography>
          <Stack spacing={2}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="Full name" fullWidth {...register('personal.name', { required: true })} />
              <TextField label="Headline / role" fullWidth {...register('personal.title')} />
            </Stack>
            <TextField label="Summary" multiline minRows={4} {...register('personal.summary')} />
          </Stack>

          <Typography variant="subtitle1" fontWeight={600} color="text.secondary">
            Contact
          </Typography>
          <Stack spacing={2}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="Email" fullWidth {...register('personal.email')} />
              <TextField label="Phone" fullWidth {...register('personal.phone')} />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="Location" fullWidth {...register('personal.location')} />
              <TextField label="Website" fullWidth {...register('personal.website')} />
            </Stack>
          </Stack>

          <Stack spacing={2}>
            <Typography variant="subtitle1" fontWeight={600} color="text.secondary">
              Social links
            </Typography>
            <Stack spacing={2}>
              {socialsArray.fields.map((field, index) => (
                <Stack key={field.id} direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start">
                  <TextField
                    label="Platform"
                    fullWidth
                    {...register(`socials.${index}.label` as const)}
                  />
                  <TextField
                    label="URL"
                    fullWidth
                    {...register(`socials.${index}.url` as const)}
                  />
                  <Button
                    color="error"
                    onClick={() => socialsArray.remove(index)}
                    startIcon={<DeleteRoundedIcon fontSize="small" />}
                  >
                    Remove
                  </Button>
                </Stack>
              ))}
              <Button
                variant="outlined"
                startIcon={<AddCircleRoundedIcon />}
                onClick={() => socialsArray.append({ label: '', url: '' })}
              >
                Add link
              </Button>
            </Stack>
          </Stack>
        </Stack>
      )}

      {activeTab === 1 && (
        <Stack spacing={2}>
          <Typography variant="subtitle1" fontWeight={600} color="text.secondary">
            Skill groups
          </Typography>
          <Stack spacing={2}>
            {skillsArray.fields.map((field, index) => (
              <Stack
                key={field.id}
                spacing={2}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
              >
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
                  <TextField
                    label="Category"
                    fullWidth
                    {...register(`skills.${index}.category` as const)}
                  />
                  <Button
                    color="error"
                    onClick={() => skillsArray.remove(index)}
                    startIcon={<DeleteRoundedIcon fontSize="small" />}
                  >
                    Remove
                  </Button>
                </Stack>
                <TextField
                  label="Skills"
                  placeholder="React, TypeScript, Accessibility, ..."
                  multiline
                  minRows={3}
                  {...register(`skills.${index}.items` as const)}
                />
              </Stack>
            ))}
            <Button
              variant="outlined"
              startIcon={<AddCircleRoundedIcon />}
              onClick={() => skillsArray.append({ id: createId(), category: '', items: '' })}
            >
              Add skill group
            </Button>
          </Stack>
        </Stack>
      )}

      {activeTab === 2 && (
        <Stack spacing={2}>
          <Typography variant="subtitle1" fontWeight={600} color="text.secondary">
            Professional experience
          </Typography>
          <Stack spacing={3}>
            {experienceArray.fields.map((field, index) => (
              <Stack key={field.id} spacing={2} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField
                    label="Role"
                    fullWidth
                    {...register(`experience.${index}.role` as const)}
                  />
                  <TextField
                    label="Company"
                    fullWidth
                    {...register(`experience.${index}.company` as const)}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField
                    label="Location"
                    fullWidth
                    {...register(`experience.${index}.location` as const)}
                  />
                  <TextField
                    label="Start"
                    fullWidth
                    placeholder="2023"
                    {...register(`experience.${index}.startDate` as const)}
                  />
                  <TextField
                    label="End"
                    fullWidth
                    placeholder="Present"
                    {...register(`experience.${index}.endDate` as const)}
                  />
                </Stack>
                <TextField
                  label="Impact / responsibilities"
                  multiline
                  minRows={4}
                  {...register(`experience.${index}.description` as const)}
                />
                <Button
                  color="error"
                  onClick={() => experienceArray.remove(index)}
                  startIcon={<DeleteRoundedIcon fontSize="small" />}
                >
                  Remove
                </Button>
              </Stack>
            ))}
            <Button
              variant="outlined"
              startIcon={<AddCircleRoundedIcon />}
              onClick={() =>
                experienceArray.append({
                  id: createId(),
                  company: '',
                  role: '',
                  location: '',
                  startDate: '',
                  endDate: '',
                  description: '',
                })
              }
            >
              Add experience
            </Button>
          </Stack>
        </Stack>
      )}

      {activeTab === 3 && (
        <Stack spacing={2}>
          <Typography variant="subtitle1" fontWeight={600} color="text.secondary">
            Projects
          </Typography>
          <Stack spacing={3}>
            {projectsArray.fields.map((field, index) => (
              <Stack key={field.id} spacing={2} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField
                    label="Project name"
                    fullWidth
                    {...register(`projects.${index}.name` as const)}
                  />
                  <TextField
                    label="Project link"
                    fullWidth
                    {...register(`projects.${index}.link` as const)}
                  />
                </Stack>
                <TextField
                  label="Summary"
                  multiline
                  minRows={4}
                  {...register(`projects.${index}.description` as const)}
                />
                <TextField
                  label="Technologies"
                  placeholder="React, Tailwind, Node.js"
                  {...register(`projects.${index}.technologies` as const)}
                />
                <Button
                  color="error"
                  onClick={() => projectsArray.remove(index)}
                  startIcon={<DeleteRoundedIcon fontSize="small" />}
                >
                  Remove
                </Button>
              </Stack>
            ))}
            <Button
              variant="outlined"
              startIcon={<AddCircleRoundedIcon />}
              onClick={() =>
                projectsArray.append({
                  id: createId(),
                  name: '',
                  description: '',
                  link: '',
                  technologies: '',
                })
              }
            >
              Add project
            </Button>
          </Stack>
        </Stack>
      )}

      {activeTab === 4 && (
        <Stack spacing={2}>
          <Typography variant="subtitle1" fontWeight={600} color="text.secondary">
            Education
          </Typography>
          <Stack spacing={3}>
            {educationArray.fields.map((field, index) => (
              <Stack key={field.id} spacing={2} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField
                    label="Institution"
                    fullWidth
                    {...register(`education.${index}.institution` as const)}
                  />
                  <TextField
                    label="Degree"
                    fullWidth
                    {...register(`education.${index}.degree` as const)}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField
                    label="Start"
                    fullWidth
                    placeholder="2016"
                    {...register(`education.${index}.startDate` as const)}
                  />
                  <TextField
                    label="End"
                    fullWidth
                    placeholder="2020"
                    {...register(`education.${index}.endDate` as const)}
                  />
                </Stack>
                <TextField
                  label="Highlights"
                  multiline
                  minRows={4}
                  {...register(`education.${index}.description` as const)}
                />
                <Button
                  color="error"
                  onClick={() => educationArray.remove(index)}
                  startIcon={<DeleteRoundedIcon fontSize="small" />}
                >
                  Remove
                </Button>
              </Stack>
            ))}
            <Button
              variant="outlined"
              startIcon={<AddCircleRoundedIcon />}
              onClick={() =>
                educationArray.append({
                  id: createId(),
                  institution: '',
                  degree: '',
                  startDate: '',
                  endDate: '',
                  description: '',
                })
              }
            >
              Add education
            </Button>
          </Stack>
        </Stack>
      )}
    </Stack>
  )
}

