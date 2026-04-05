'use client'

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import { CssBaseline, GlobalStyles } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'

import { UserProvider } from '@/hooks/useUser'
import { theme } from '@/theme'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        <GlobalStyles styles={{ body: { backgroundColor: '#f8fafc' } }} />
        <UserProvider>{children}</UserProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  )
}
