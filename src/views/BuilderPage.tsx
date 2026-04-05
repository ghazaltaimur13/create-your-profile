import Container from '@mui/material/Container'
import { Suspense } from 'react'

import { PortfolioBuilder } from '../components/PortfolioBuilder'

export const BuilderPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
      <Suspense fallback={null}>
        <PortfolioBuilder />
      </Suspense>
    </Container>
  )
}

