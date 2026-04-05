import { createTheme, responsiveFontSizes } from '@mui/material/styles'

const baseTheme = createTheme({
  palette: {
    primary: {
      main: '#2563eb',
    },
    secondary: {
      main: '#0ea5e9',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'var(--font-inter), "Inter", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    body1: {
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 18,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 9999,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
      },
    },
    /* Tailwind preflight + load order can zero out padding/borders; keep outlined fields usable. */
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderWidth: 1,
          borderStyle: 'solid',
          padding: '0 8px',
        },
        input: ({ ownerState }) => ({
          boxSizing: 'border-box',
          padding: ownerState.size === 'small' ? '8.5px 14px' : '16.5px 14px',
        }),
      },
    },
  },
})

export const theme = responsiveFontSizes(baseTheme)

