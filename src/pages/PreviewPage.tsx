import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded'
import { Box, Button, Container, Stack, Typography } from '@mui/material'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { PortfolioPreview } from '../components/PortfolioPreview'
import { DEFAULT_TEMPLATE_ID } from '../constants/templates'
import { defaultPortfolio } from '../data/defaultPortfolio'
import type { PortfolioFormValues, PortfolioTemplateId } from '../types/portfolio'
import { readStoredDraft } from '../utils/portfolioStorage'
import { useUser } from '../hooks/useUser'
import { shouldShowWatermark } from '../config/plans'

type PreviewLocationState = {
  data?: PortfolioFormValues
  template?: PortfolioTemplateId
}

export const PreviewPage = () => {
  const { user } = useUser()
  const navigate = useNavigate()
  const { state } = useLocation()
  const previewRef = useRef<HTMLDivElement | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  const storedDraft = useMemo(() => readStoredDraft(), [])
  const locationState = state as PreviewLocationState | null

  const data = locationState?.data ?? storedDraft?.values ?? defaultPortfolio
  const template = locationState?.template ?? DEFAULT_TEMPLATE_ID

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
      if (shouldShowWatermark(user)) {
        pdf.setFontSize(10)
        pdf.setTextColor(150, 150, 150)
        pdf.text('Made with Portfolio Studio', pageWidth / 2, pageHeight - 8, { align: 'center' })
      }
      const fileName = data.personal.name ? data.personal.name.replace(/\s+/g, '-').toLowerCase() : 'portfolio'
      pdf.save(`${fileName}.pdf`)
    } catch (error) {
      console.error('Failed to export PDF', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Box sx={{ backgroundColor: '#f1f5f9', minHeight: '100vh', py: { xs: 6, md: 10 } }}>
      <Container maxWidth="md">
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
              <Button
                variant="text"
                startIcon={<ArrowBackRoundedIcon />}
                onClick={() => navigate('/', { state: { data, template }, replace: true })}
              >
                Back to editor
              </Button>
              <Typography variant="h5" fontWeight={700} color="text.primary">
                Full-screen preview
              </Typography>
            </Stack>
            <Button
              variant="contained"
              startIcon={<DownloadRoundedIcon />}
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? 'Generating…' : 'Export PDF'}
            </Button>
          </Stack>

          <Box sx={{ position: 'relative' }}>
          <PortfolioPreview ref={previewRef} data={data} template={template} />
            {shouldShowWatermark(user) && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  px: 1.5,
                  py: 0.5,
                  backgroundColor: 'rgba(255,255,255,0.75)',
                  borderRadius: 1,
                  fontSize: 10,
                  color: '#475569',
                  pointerEvents: 'none',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                }}
              >
                Made with Portfolio Studio
              </Box>
            )}
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}

