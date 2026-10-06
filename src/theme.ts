import { createTheme } from '@mui/material/styles';

export const rawbankTheme = createTheme({
  palette: {
    primary: {
      main: '#0A0A0A',
      light: '#1A1A1A',
      dark: '#000000',
      contrastText: '#FFCC00',
    },
    secondary: {
      main: '#FFCC00',
      light: '#FFD633',
      dark: '#E6B800',
      contrastText: '#0A0A0A',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0A0A0A',
      secondary: '#5C5C5C',
    },
    success: {
      main: '#34C759',
    },
    error: {
      main: '#FF3B30',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontSize: '1.875rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      color: '#0A0A0A',
      '@media (min-width:600px)': {
        fontSize: '2.5rem',
      },
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
      color: '#0A0A0A',
    },
    body1: {
      fontSize: '1.0625rem',
      lineHeight: 1.6,
      color: '#0A0A0A',
    },
    body2: {
      fontSize: '0.9375rem',
      lineHeight: 1.5,
      color: '#5C5C5C',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '1.0625rem',
      letterSpacing: '-0.01em',
    },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          padding: '16px 32px',
          fontSize: '1.0625rem',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          minHeight: 52,
          transition: 'transform 100ms cubic-bezier(0.4, 0, 0.2, 1)',
          '@media (prefers-reduced-motion: no-preference)': {
            '&:active': {
              transform: 'scale(0.98)',
            },
          },
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          backgroundColor: '#000000',
          color: '#FFCC00',
          '&:hover': {
            backgroundColor: '#1A1A1A',
          },
          '&:disabled': {
            backgroundColor: '#F5F5F5',
            color: '#5C5C5C',
          },
        },
        outlined: {
          borderColor: '#0A0A0A',
          borderWidth: 1.5,
          color: '#0A0A0A',
          '&:hover': {
            borderWidth: 1.5,
            backgroundColor: 'rgba(10, 10, 10, 0.04)',
          },
        },
        text: {
          color: '#5C5C5C',
          '&:hover': {
            backgroundColor: 'rgba(10, 10, 10, 0.04)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#FAFAFA',
            fontSize: '1.0625rem',
            transition: 'all 200ms ease',
            '& fieldset': {
              borderColor: '#E5E5E5',
              borderWidth: 1.5,
              transition: 'all 200ms ease',
            },
            '&:hover fieldset': {
              borderColor: '#0A0A0A',
            },
            '&.Mui-focused': {
              backgroundColor: '#FFFFFF',
              '& fieldset': {
                borderColor: '#FFCC00',
                borderWidth: 2,
              },
            },
          },
          '& .MuiInputLabel-root': {
            fontSize: '1rem',
            color: '#5C5C5C',
            '&.Mui-focused': {
              color: '#0A0A0A',
            },
          },
          '& .MuiFormHelperText-root': {
            fontSize: '0.875rem',
            color: '#5C5C5C',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 12px rgba(10, 10, 10, 0.06)',
          border: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontSize: '0.9375rem',
          fontWeight: 500,
          minHeight: 48,
          transition: 'all 150ms ease',
        },
        filled: {
          backgroundColor: '#F5F5F5',
          color: '#0A0A0A',
          '&.MuiChip-clickable:hover': {
            backgroundColor: '#E5E5E5',
          },
        },
        outlined: {
          borderWidth: 1.5,
          borderColor: '#E5E5E5',
          '&.MuiChip-clickable:hover': {
            backgroundColor: '#FAFAFA',
          },
        },
      },
    },
  },
});
