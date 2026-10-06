import { Box, keyframes } from '@mui/material';
import { ReactNode } from 'react';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <Box
      sx={{
        '@media (prefers-reduced-motion: no-preference)': {
          animation: `${fadeInUp} 200ms ease-out`,
        },
      }}
    >
      {children}
    </Box>
  );
}

const breathe = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
`;

interface BreathingIconProps {
  children: ReactNode;
  duration?: number;
}

export function BreathingIcon({ children, duration = 2000 }: BreathingIconProps) {
  return (
    <Box
      sx={{
        '@media (prefers-reduced-motion: no-preference)': {
          animation: `${breathe} ${duration}ms ease-in-out infinite`,
        },
      }}
    >
      {children}
    </Box>
  );
}

const flashYellow = keyframes`
  0% {
    opacity: 0.6;
    transform: scale(0.95);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.1);
  }
`;

export function YellowClawFlash() {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        '@media (prefers-reduced-motion: no-preference)': {
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '20%',
            right: '-10%',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(255, 204, 0, 0.3) 0%, transparent 70%)',
            borderRadius: '50% 50% 0 50%',
            transform: 'rotate(-45deg)',
            animation: `${flashYellow} 400ms ease-out`,
          },
        },
      }}
    />
  );
}

const highlightBorder = keyframes`
  0% {
    borderColor: transparent;
  }
  50% {
    borderColor: #FFCC00;
  }
  100% {
    borderColor: #E5E5E5;
  }
`;

interface HighlightFieldProps {
  children: ReactNode;
  highlight?: boolean;
}

export function HighlightField({ children, highlight = false }: HighlightFieldProps) {
  return (
    <Box
      sx={{
        '@media (prefers-reduced-motion: no-preference)': {
          animation: highlight ? `${highlightBorder} 300ms ease-out` : 'none',
        },
      }}
    >
      {children}
    </Box>
  );
}
