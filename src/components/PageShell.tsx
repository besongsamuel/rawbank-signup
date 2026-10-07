import { ReactNode } from 'react';
import { Box, Container } from '@mui/material';

export type PageWidth = 'form' | 'wide' | 'clerk';

const maxWidth: Record<PageWidth, { xs: string; md?: number; lg: number }> = {
  form: { xs: '100%', md: 960, lg: 960 },
  wide: { xs: '100%', lg: 1100 },
  clerk: { xs: '100%', lg: 1200 },
};

interface PageShellProps {
  children: ReactNode;
  width?: PageWidth;
}

export default function PageShell({ children, width = 'form' }: PageShellProps) {
  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        width: '100%',
        maxWidth: maxWidth[width],
        mx: 'auto',
        py: { xs: 3, md: 6 },
        px: { xs: 3, md: 4 },
      }}
    >
      {children}
    </Container>
  );
}

interface FormGridProps {
  children: ReactNode;
}

export function FormGrid({ children }: FormGridProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: 2.5,
        mb: 3,
        '& > *': { minWidth: 0 },
      }}
    >
      {children}
    </Box>
  );
}

export function FormFull({ children }: { children: ReactNode }) {
  return <Box sx={{ gridColumn: { md: '1 / -1' } }}>{children}</Box>;
}
