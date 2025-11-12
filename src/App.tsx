import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded'
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material'
import { Link, Outlet, Route, Routes } from 'react-router-dom'

import { BuilderPage } from './pages/BuilderPage'
import { PreviewPage } from './pages/PreviewPage'

const AppLayout = () => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{ borderBottom: '1px solid', borderColor: 'divider', backgroundColor: '#ffffff' }}
      >
        <Toolbar>
          <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Button
              component={Link}
              to="/"
              color="inherit"
              startIcon={<MenuBookRoundedIcon />}
              sx={{ fontWeight: 700, textTransform: 'none', fontSize: '1.05rem' }}
            >
              Portfolio Studio
            </Button>
            <Button
              component={Link}
              to="/preview"
              variant="contained"
              startIcon={<PictureAsPdfRoundedIcon />}
              sx={{ textTransform: 'none', borderRadius: '9999px' }}
            >
              Preview & PDF
            </Button>
          </Container>
        </Toolbar>
      </AppBar>
      <Outlet />
      <Box component="footer" sx={{ py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            Crafted with React, Tailwind, and Material UI · {new Date().getFullYear()}
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}

export const App = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<BuilderPage />} />
        <Route path="preview" element={<PreviewPage />} />
      </Route>
    </Routes>
  )
}

export default App
