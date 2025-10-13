import { createTheme } from "@mui/material/styles";

export const rawbankTheme = createTheme({
  palette: {
    primary: {
      main: "#1e3c72",
      light: "#2a5298",
      dark: "#0f1e3a",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#667eea",
      light: "#764ba2",
      dark: "#4c63d2",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f8f9fa",
      paper: "#ffffff",
    },
    text: {
      primary: "#333333",
      secondary: "#666666",
    },
    success: {
      main: "#155724",
      light: "#d4edda",
    },
    error: {
      main: "#721c24",
      light: "#f8d7da",
    },
  },
  typography: {
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    h1: {
      fontSize: "3rem",
      fontWeight: 700,
      letterSpacing: "2px",
      color: "#1e3c72",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      color: "#1e3c72",
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 600,
      color: "#1e3c72",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.9rem",
      color: "#666666",
    },
    button: {
      textTransform: "uppercase",
      fontWeight: 600,
      letterSpacing: "1px",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "12px 24px",
          fontSize: "1.1rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "1px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 10px 20px rgba(30, 60, 114, 0.3)",
            transform: "translateY(-2px)",
          },
        },
        contained: {
          background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #0f1e3a 0%, #1e3c72 100%)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#1e3c72",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#1e3c72",
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
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
  },
});
