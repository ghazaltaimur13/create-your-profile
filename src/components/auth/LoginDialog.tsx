'use client'

import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import { useState } from 'react'

import { useUser } from '@/hooks/useUser'
import type { User } from '@/types/user'

type Props = {
  open: boolean
  onClose: () => void
  onAuthenticated?: (user: User) => void
}

export const LoginDialog = ({ open, onClose, onAuthenticated }: Props) => {
  const { loginWithCredentials, signupWithCredentials } = useUser()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSubmit = email.trim().length > 3 && password.trim().length > 3

  const handleSubmit = async () => {
    if (!canSubmit) return
    setSubmitting(true)
    setError(null)
    try {
      await new Promise((r) => setTimeout(r, 250))
      const normalized = email.trim().toLowerCase()
      const result =
        mode === 'signup'
          ? await signupWithCredentials(normalized, password)
          : await loginWithCredentials(normalized, password)
      if (!result.ok) {
        setError(result.message ?? 'Unable to authenticate.')
        return
      }
      onAuthenticated?.(result.user)
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: { borderRadius: 2 },
        },
      }}
    >
      <DialogTitle component="div">
        <Typography variant="h6" component="span" fontWeight={700}>
          {mode === 'login' ? 'Log in to unlock Pro' : 'Create your account'}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ px: 3, pt: 0 }}>
        <Stack spacing={2.5} sx={{ pt: 0.5 }}>
          <Typography variant="body2" color="text.secondary">
            {mode === 'login' ? 'Access your account to continue.' : 'Sign up to get started.'}
          </Typography>

          <ToggleButtonGroup
            value={mode}
            exclusive
            fullWidth
            size="small"
            onChange={(_, val) => val && setMode(val)}
            aria-label="Login or sign up"
            sx={{
              display: 'flex',
              gap: 1,
              '& .MuiToggleButton-root': {
                flex: 1,
                py: 1,
                textTransform: 'none',
                fontWeight: 600,
              },
            }}
          >
            <ToggleButton value="login">Log in</ToggleButton>
            <ToggleButton value="signup">Sign up</ToggleButton>
          </ToggleButtonGroup>

          {error ? <Alert severity="error">{error}</Alert> : null}

          <TextField
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            fullWidth
            variant="outlined"
            size="medium"
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            variant="outlined"
            size="medium"
            slotProps={mode === 'signup' ? { htmlInput: { autoComplete: 'new-password' } } : { htmlInput: { autoComplete: 'current-password' } }}
          />
        </Stack>
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          pb: 2.5,
          pt: 1,
          gap: 1.5,
          flexWrap: 'wrap',
          justifyContent: 'flex-end',
        }}
      >
        <Button onClick={onClose} color="inherit" sx={{ textTransform: 'none' }}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!canSubmit || submitting} sx={{ textTransform: 'none', minWidth: 120 }}>
          {submitting ? (mode === 'login' ? 'Logging in…' : 'Signing up…') : mode === 'login' ? 'Log in' : 'Sign up'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
