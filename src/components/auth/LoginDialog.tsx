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
import { useUser } from '../../hooks/useUser'
import type { User } from '../../types/user'

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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{mode === 'login' ? 'Log in to unlock Pro' : 'Create your account'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              {mode === 'login' ? 'Access your account to continue.' : 'Sign up to get started.'}
            </Typography>
            <ToggleButtonGroup
              value={mode}
              exclusive
              size="small"
              onChange={(_, val) => val && setMode(val)}
            >
              <ToggleButton value="login">Login</ToggleButton>
              <ToggleButton value="signup">Sign Up</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!canSubmit || submitting}>
          {submitting ? (mode === 'login' ? 'Logging in…' : 'Signing up…') : mode === 'login' ? 'Log in' : 'Sign up'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}


