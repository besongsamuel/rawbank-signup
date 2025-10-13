import { createTheme } from "@mui/material/styles";

// Rawbank Brand Colors - inspired by https://rawbank.com/
// Yellow: Optimism, Black: Trust and Confidence
export const rawbankTheme = createTheme({
  palette: {
    primary: {
      main: "#000000", // Rawbank Black - Trust and Confidence
      light: "#333333",
      dark: "#000000",
      contrastText: "#FFCC00", // Rawbank Yellow
    },
    secondary: {
      main: "#FFCC00", // Rawbank Yellow - Optimism
      light: "#FFD633",
      dark: "#E6B800",
      contrastText: "#000000",
    },
    background: {
      default: "#FFFFFF", // Clean Apple-like white background
      paper: "#FFFFFF",
    },
    text: {
      primary: "#000000", // Pure black for maximum readability
      secondary: "#666666", // Gray for secondary text
    },
    success: {
      main: "#34C759", // iOS-style green
      light: "#D1F2DD",
    },
    error: {
      main: "#FF3B30", // iOS-style red
      light: "#FFEBEE",
    },
    warning: {
      main: "#FFCC00", // Yellow for warnings
      light: "#FFF9E6",
    },
    info: {
      main: "#007AFF", // iOS-style blue
      light: "#E5F2FF",
    },
  },
  typography: {
    // Apple-inspired typography - Clean, readable, modern
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontSize: "3.5rem",
      fontWeight: 700,
      letterSpacing: "-0.02em",
      color: "#000000",
      lineHeight: 1.1,
    },
    h2: {
      fontSize: "2.5rem",
      fontWeight: 600,
      letterSpacing: "-0.01em",
      color: "#000000",
      lineHeight: 1.2,
    },
    h3: {
      fontSize: "2rem",
      fontWeight: 600,
      letterSpacing: "-0.01em",
      color: "#000000",
      lineHeight: 1.2,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 600,
      color: "#000000",
      lineHeight: 1.3,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 600,
      color: "#000000",
      lineHeight: 1.4,
    },
    h6: {
      fontSize: "1.1rem",
      fontWeight: 600,
      color: "#000000",
      lineHeight: 1.4,
    },
    body1: {
      fontSize: "1.0625rem", // 17px - Apple's preferred body size
      lineHeight: 1.47,
      letterSpacing: "-0.01em",
      color: "#000000",
    },
    body2: {
      fontSize: "0.9375rem", // 15px
      lineHeight: 1.5,
      color: "#666666",
    },
    button: {
      textTransform: "none", // Apple uses sentence case
      fontWeight: 500,
      letterSpacing: "-0.01em",
      fontSize: "1.0625rem",
    },
    caption: {
      fontSize: "0.8125rem", // 13px
      lineHeight: 1.5,
      color: "#666666",
    },
  },
  shape: {
    borderRadius: 12, // Apple-like rounded corners
  },
  spacing: 8, // 8px base unit
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "14px 28px",
          fontSize: "1.0625rem",
          fontWeight: 500,
          textTransform: "none",
          letterSpacing: "-0.01em",
          boxShadow: "none",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            boxShadow: "none",
            transform: "scale(0.98)",
          },
          "&:active": {
            transform: "scale(0.96)",
          },
        },
        contained: {
          backgroundColor: "#000000",
          color: "#FFCC00",
          "&:hover": {
            backgroundColor: "#1a1a1a",
          },
        },
        containedSecondary: {
          backgroundColor: "#FFCC00",
          color: "#000000",
          "&:hover": {
            backgroundColor: "#FFD633",
          },
        },
        outlined: {
          borderColor: "#E5E5E5",
          borderWidth: 1,
          color: "#000000",
          "&:hover": {
            borderColor: "#000000",
            backgroundColor: "rgba(0, 0, 0, 0.02)",
          },
        },
        text: {
          color: "#000000",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
            backgroundColor: "#FAFAFA",
            transition: "all 0.2s ease",
            "& fieldset": {
              borderColor: "#E5E5E5",
              borderWidth: 1,
            },
            "&:hover": {
              backgroundColor: "#F5F5F5",
              "& fieldset": {
                borderColor: "#000000",
              },
            },
            "&.Mui-focused": {
              backgroundColor: "#FFFFFF",
              "& fieldset": {
                borderColor: "#000000",
                borderWidth: 2,
              },
            },
          },
          "& .MuiInputLabel-root": {
            color: "#666666",
            "&.Mui-focused": {
              color: "#000000",
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: "#FAFAFA",
          "&:hover": {
            backgroundColor: "#F5F5F5",
          },
          "&.Mui-focused": {
            backgroundColor: "#FFFFFF",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)", // Subtle shadow
          border: "1px solid #F5F5F5",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
        },
        elevation1: {
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
        },
        elevation2: {
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        },
        elevation3: {
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#F0F0F0",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
        filled: {
          backgroundColor: "#F5F5F5",
          color: "#000000",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});
