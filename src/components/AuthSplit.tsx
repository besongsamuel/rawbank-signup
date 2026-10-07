import { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import { ClawAccent } from './BrandedIcons';

interface AuthSplitProps {
  children: ReactNode;
  subtitle: string;
}

export default function AuthSplit({ children, subtitle }: AuthSplitProps) {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        width: '100%',
        alignItems: 'stretch',
        bgcolor: '#FFFFFF',
      }}
    >
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flex: '1 1 46%',
          flexDirection: 'column',
          justifyContent: 'center',
          bgcolor: '#0A0A0A',
          px: { md: 6, lg: 10 },
          py: 8,
        }}
      >
        <ClawAccent sx={{ fontSize: 88, mb: 3 }} />
        <Typography
          component="p"
          sx={{
            fontSize: { md: '2.75rem', lg: '3.25rem' },
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: '#FFFFFF',
            mb: 2,
          }}
        >
          RAWBANK
        </Typography>
        <Typography sx={{ fontSize: '1.125rem', lineHeight: 1.6, color: '#D4D4D4', maxWidth: 420 }}>
          {subtitle}
        </Typography>
      </Box>
      <Box
        sx={{
          flex: '1 1 54%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: { md: 'center' },
          px: { xs: 3, md: 5, lg: 8 },
          py: { xs: 3, md: 6 },
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 480 }}>{children}</Box>
      </Box>
    </Box>
  );
}
