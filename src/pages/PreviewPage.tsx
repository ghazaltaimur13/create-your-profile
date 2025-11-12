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

type PreviewLocationState = {
  data?: PortfolioFormValues
  template?: PortfolioTemplateId
}

export const PreviewPage = () => {
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

          <PortfolioPreview ref={previewRef} data={data} template={template} />
        </Stack>
      </Container>
    </Box>
  )
}

