import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import { Alert, Button, ButtonBase, Chip, Stack, Typography } from '@mui/material'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { useEffect, useMemo, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Link, useLocation } from 'react-router-dom'

import { DEFAULT_TEMPLATE_ID, PORTFOLIO_TEMPLATE_OPTIONS } from '../constants/templates'
import { defaultPortfolio } from '../data/defaultPortfolio'
import type { PortfolioFormValues, PortfolioTemplateId } from '../types/portfolio'
import { PortfolioPreview } from './PortfolioPreview'
import { PortfolioForm } from './form/PortfolioForm'
import { readStoredDraft, writeStoredDraft } from '../utils/portfolioStorage'

type BuilderLocationState = {
  data?: PortfolioFormValues
  template?: PortfolioTemplateId
} | null

export const PortfolioBuilder = () => {
  const location = useLocation()
  const locationState = location.state as BuilderLocationState

  const storedDraft = useMemo(() => readStoredDraft(), [])

  const fallbackData = useMemo<PortfolioFormValues>(
    () => JSON.parse(JSON.stringify(defaultPortfolio)) as PortfolioFormValues,
    [],
  )

  const initialValues = locationState?.data ?? storedDraft?.values ?? fallbackData
  const initialTemplate = locationState?.template ?? DEFAULT_TEMPLATE_ID

  const methods = useForm<PortfolioFormValues>({
    mode: 'onChange',
    defaultValues: initialValues,
  })

  const [activeTab, setActiveTab] = useState(0)
  const [isExporting, setIsExporting] = useState(false)
  const previewRef = useRef<HTMLDivElement | null>(null)
  const appliedLocationDataRef = useRef<PortfolioFormValues | undefined>(undefined)
  const appliedTemplateRef = useRef<PortfolioTemplateId | undefined>(undefined)

  const [selectedTemplate, setSelectedTemplate] = useState<PortfolioTemplateId>(initialTemplate)

  const selectedTemplateOption = useMemo(
    () =>
      PORTFOLIO_TEMPLATE_OPTIONS.find((option) => option.id === selectedTemplate) ??
      PORTFOLIO_TEMPLATE_OPTIONS[0],
    [selectedTemplate],
  )

  const snapshot = methods.watch()

  useEffect(() => {
    if (!locationState?.data) return
    if (appliedLocationDataRef.current === locationState.data) return
    methods.reset(locationState.data)
    appliedLocationDataRef.current = locationState.data
  }, [locationState?.data, methods])

  useEffect(() => {
    if (!locationState?.template) return
    if (appliedTemplateRef.current === locationState.template) return
    setSelectedTemplate(locationState.template)
    appliedTemplateRef.current = locationState.template
  }, [locationState?.template])

  useEffect(() => {
    if (!snapshot) return
    writeStoredDraft({ values: snapshot, template: selectedTemplate })
  }, [snapshot, selectedTemplate])

  const hasContent = useMemo(() => {
    const { personal, skills, projects, experience, education } = snapshot
    return (
      Boolean(personal.name) ||
      skills.some((item) => item.category || item.items) ||
      projects.some((item) => item.name || item.description) ||
      experience.some((item) => item.company || item.role) ||
      education.some((item) => item.institution || item.degree)
    )
  }, [snapshot])

  const handleExport = async () => {
    if (!previewRef.current) return

    try {
      setIsExporting(true)
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()

      const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height)
      const imgWidth = canvas.width * ratio
      const imgHeight = canvas.height * ratio
      const x = (pageWidth - imgWidth) / 2
      const y = 10

      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight)
      const fileName = snapshot.personal.name ? snapshot.personal.name.replace(/\s+/g, '-').toLowerCase() : 'portfolio'
      pdf.save(`${fileName}.pdf`)
    } catch (error) {
      console.error('Failed to export PDF', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <FormProvider {...methods}>
      <Stack spacing={4}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Typography variant="h4" fontWeight={700} color="text.primary">
              Portfolio maker
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Fill in your story, tweak the layout, and download a polished PDF instantly.
            </Typography>
          </div>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="stretch">
            <Button
              component={Link}
              to="/preview"
              state={{ data: snapshot, template: selectedTemplate }}
              variant="outlined"
              startIcon={<VisibilityRoundedIcon />}
            >
              Full preview
            </Button>
            <Button
              variant="contained"
              onClick={handleExport}
              startIcon={<DownloadRoundedIcon />}
              disabled={isExporting}
            >
              {isExporting ? 'Generating…' : 'Export PDF'}
            </Button>
          </Stack>
        </div>

        <Stack spacing={2}>
          <Typography variant="subtitle1" fontWeight={600} color="text.secondary">
            Template
          </Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            {PORTFOLIO_TEMPLATE_OPTIONS.map((option) => {
              const isActive = option.id === selectedTemplate
              return (
                <ButtonBase
                  key={option.id}
                  focusRipple
                  onClick={() => setSelectedTemplate(option.id)}
                  aria-pressed={isActive}
                  type="button"
                  className={`group relative w-full overflow-hidden rounded-3xl border text-left transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 ${
                    isActive
                      ? 'border-transparent bg-white shadow-[0_28px_65px_-35px_rgba(37,99,235,0.45)] ring-2 ring-primary-400'
                      : 'border-slate-200 bg-white hover:border-primary-200 hover:shadow-[0_22px_55px_-40px_rgba(15,23,42,0.35)]'
                  }`}
                >
                  <span
                    aria-hidden
                    className="absolute inset-y-0 left-0 w-1.5 rounded-tr-full rounded-br-full opacity-0 transition-opacity duration-300 group-hover:opacity-80"
                    style={{ backgroundColor: option.accent }}
                  />
                  <div className="flex flex-col gap-4 p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p
                          className={`text-sm font-semibold tracking-tight transition-colors ${
                            isActive ? 'text-primary-700' : 'text-slate-900'
                          }`}
                        >
                          {option.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">{option.description}</p>
                      </div>
                      <span
                        aria-hidden
                        className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-full text-xs font-semibold text-white shadow-sm"
                        style={{ background: `linear-gradient(135deg, ${option.accent}, ${option.accent}cc)` }}
                      >
                        {option.name.slice(0, 2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                      <span>Supports PDF export</span>
                      {isActive ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-2 py-1 text-primary-700">
                          <CheckCircleRoundedIcon fontSize="inherit" />
                          Selected
                        </span>
                      ) : (
                        <span className="opacity-0 transition-opacity group-hover:opacity-100">Click to use</span>
                      )}
                    </div>
                  </div>
                </ButtonBase>
              )
            })}
          </Stack>
        </Stack>

        {!hasContent && (
          <Alert severity="info" variant="outlined">
            Start by filling out your profile. The live preview will refresh on every keystroke.
          </Alert>
        )}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <PortfolioForm activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="order-last xl:order-none xl:sticky xl:top-6">
            <Stack spacing={2}>
              <Chip
                label={`Live preview · ${selectedTemplateOption.name}`}
                color="primary"
                variant="outlined"
                sx={{ alignSelf: 'flex-start', fontWeight: 600 }}
              />
              <PortfolioPreview ref={previewRef} data={snapshot} template={selectedTemplate} />
            </Stack>
          </div>
        </div>
      </Stack>
    </FormProvider>
  )
}

