import { ReactNode } from 'react';
import { Box, Button, Skeleton, Typography } from '@mui/material';
import PageShell from '../PageShell';
import StepProgress from '../StepProgress';
import { PageTransition } from '../Motion';
import AuthBackButton from '../auth/AuthBackButton';
import { ONBOARDING_STEP_COUNT } from '../../onboarding/catalog';

interface OnboardingFrameProps {
  step: number;
  title: string;
  subtitle: string;
  onBack: () => void;
  onContinue: () => void;
  continueDisabled?: boolean;
  saving?: boolean;
  loading?: boolean;
  error?: string;
  children: ReactNode;
}

export default function OnboardingFrame({
  step,
  title,
  subtitle,
  onBack,
  onContinue,
  continueDisabled = false,
  saving = false,
  loading = false,
  error = '',
  children,
}: OnboardingFrameProps) {
  return (
    <PageTransition>
      <PageShell>
        <AuthBackButton onClick={onBack} />
        <StepProgress currentStep={step} totalSteps={ONBOARDING_STEP_COUNT} />

        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h1" sx={{ mb: 1.5, fontSize: { xs: '1.875rem', sm: '2.25rem' } }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            <Skeleton variant="rounded" height={56} />
            <Skeleton variant="rounded" height={56} />
            <Skeleton variant="rounded" height={56} />
          </Box>
        ) : (
          children
        )}

        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        <Box
          sx={{
            position: { xs: 'fixed', sm: 'static' },
            bottom: { xs: 0, sm: 'auto' },
            left: { xs: 0, sm: 'auto' },
            right: { xs: 0, sm: 'auto' },
            p: { xs: 2, sm: 0 },
            mt: { sm: 3 },
            bgcolor: { xs: '#FFFFFF', sm: 'transparent' },
            borderTop: { xs: '1px solid #F5F5F5', sm: 'none' },
            boxShadow: { xs: '0 -2px 12px rgba(10, 10, 10, 0.06)', sm: 'none' },
          }}
        >
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={onContinue}
            disabled={continueDisabled || saving || loading}
            sx={{
              '&.Mui-disabled': { bgcolor: '#E5E5E5', color: '#5C5C5C' },
            }}
          >
            {saving ? 'Enregistrement...' : 'Continuer'}
          </Button>
        </Box>
        <Box sx={{ height: { xs: 88, sm: 0 } }} />
      </PageShell>
    </PageTransition>
  );
}
