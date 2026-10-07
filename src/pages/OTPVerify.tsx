import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Link } from '@mui/material';
import PageShell from '../components/PageShell';
import StepProgress from '../components/StepProgress';
import { PageTransition } from '../components/Motion';
import AuthBackButton from '../components/auth/AuthBackButton';
import { useAmplifyProfile } from '../hooks/useAmplifyProfile';
import { ONBOARDING_STEP_COUNT } from '../onboarding/catalog';
import { useOnboardingNav } from '../onboarding/navigation';

export default function OTPVerify() {
  const navigate = useNavigate();
  const { save, saving, error } = useAmplifyProfile();
  const { returnTo } = useOnboardingNav('/onboarding/contacts', '/onboarding/profession');
  const [code, setCode] = useState('');

  const handleVerify = async () => {
    try {
      await save({ phoneVerified: true, currentStep: 'professional' });
      navigate(returnTo ?? '/onboarding/profession');
    } catch {
      // Shown under the button.
    }
  };

  return (
    <PageTransition>
      <PageShell>
        <AuthBackButton
          onClick={() =>
            navigate('/onboarding/contacts', { state: returnTo ? { returnTo } : undefined })
          }
        />
        <StepProgress currentStep={4} totalSteps={ONBOARDING_STEP_COUNT} />

        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant="h1" 
            sx={{ 
              mb: 1.5,
              fontSize: { xs: '1.875rem', sm: '2.25rem' },
            }}
          >
            Vérifiez votre numéro
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Entrez le code envoyé par SMS
          </Typography>
        </Box>

        <Box sx={{ mb: 4, maxWidth: { md: 480 }, mx: { md: 'auto' } }}>
          <TextField
            fullWidth
            label="Code de vérification"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="000000"
            inputProps={{
              maxLength: 6,
              style: { 
                textAlign: 'center', 
                fontSize: '1.5rem',
                letterSpacing: '0.5rem',
              },
            }}
            sx={{ mb: 2 }}
          />

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Vous n'avez pas reçu le code?{' '}
              <Link
                component="button"
                variant="body2"
                sx={{ 
                  color: '#0A0A0A', 
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Renvoyer
              </Link>
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            position: { xs: 'fixed', sm: 'static' },
            bottom: { xs: 0, sm: 'auto' },
            left: { xs: 0, sm: 'auto' },
            right: { xs: 0, sm: 'auto' },
            p: { xs: 2, sm: 0 },
            bgcolor: { xs: '#FFFFFF', sm: 'transparent' },
            borderTop: { xs: '1px solid #F5F5F5', sm: 'none' },
            boxShadow: { xs: '0 -2px 12px rgba(10, 10, 10, 0.06)', sm: 'none' },
            maxWidth: { md: 480 },
            mx: { md: 'auto' },
          }}
        >
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleVerify}
            disabled={code.length !== 6 || saving}
          >
            {saving ? 'Enregistrement...' : 'Vérifier'}
          </Button>
          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 1.5 }}>
              {error}
            </Typography>
          )}
        </Box>

        <Box sx={{ height: { xs: 88, sm: 0 } }} />
      </PageShell>
    </PageTransition>
  );
}
