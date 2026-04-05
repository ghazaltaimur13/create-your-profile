'use client'

import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded'
import { AppBar, Box, Button, Chip, Container, Stack, Toolbar, Typography } from '@mui/material'
import Link from 'next/link'
import { useState } from 'react'

import { LoginDialog } from '@/components/auth/LoginDialog'
import { useUser } from '@/hooks/useUser'

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, logout } = useUser()
  const [loginOpen, setLoginOpen] = useState(false)

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
              href="/"
              color="inherit"
              startIcon={<MenuBookRoundedIcon />}
              sx={{ fontWeight: 700, textTransform: 'none', fontSize: '1.05rem' }}
            >
              Portfolio Studio
            </Button>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Button
                component={Link}
                href="/preview"
                variant="contained"
                startIcon={<PictureAsPdfRoundedIcon />}
                sx={{ textTransform: 'none', borderRadius: '9999px' }}
              >
                Preview & PDF
              </Button>
              {isAuthenticated ? (
                <>
                  <Chip
                    label={user.plan === 'pro' ? 'Pro' : 'Free'}
                    color={user.plan === 'pro' ? 'success' : 'default'}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                  <Button onClick={logout} color="inherit" sx={{ textTransform: 'none' }}>
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Chip label="Free" size="small" sx={{ fontWeight: 600 }} />
                  <Button onClick={() => setLoginOpen(true)} color="inherit" sx={{ textTransform: 'none' }}>
                    Log in
                  </Button>
                </>
              )}
            </Stack>
          </Container>
        </Toolbar>
      </AppBar>
      <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />
      {children}
      <Box component="footer" sx={{ py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center" component="div">
            Crafted with Next.js, Tailwind, and Material UI · {new Date().getFullYear()}
            {process.env.NEXT_PUBLIC_APP_VERSION ? (
              <Typography
                component="span"
                variant="caption"
                display="block"
                sx={{ mt: 0.75, color: 'text.disabled', fontFamily: 'ui-monospace, monospace' }}
              >
                v{process.env.NEXT_PUBLIC_APP_VERSION}
              </Typography>
            ) : null}
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}
