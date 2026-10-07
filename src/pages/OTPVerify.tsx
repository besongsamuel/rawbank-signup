import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, TextField, Button, Link } from '@mui/material';
import StepProgress from '../components/StepProgress';
import { PageTransition } from '../components/Motion';
import AuthBackButton from '../components/auth/AuthBackButton';
import { markApplicationSubmitted } from '../hooks/useApplicationDraft';

export default function OTPVerify() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');

  const handleVerify = () => {
    markApplicationSubmitted();
    navigate('/dashboard');
  };

  return (
    <PageTransition>
      <Container maxWidth="sm" sx={{ py: { xs: 3, sm: 6 }, px: 3, maxWidth: '420px !important' }}>
        <AuthBackButton onClick={() => navigate('/onboarding/remaining')} />
        <StepProgress currentStep={4} />

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

        <Box sx={{ mb: 4 }}>
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
          }}
        >
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleVerify}
            disabled={code.length !== 6}
          >
            Vérifier
          </Button>
        </Box>

        <Box sx={{ height: { xs: 88, sm: 0 } }} />
      </Container>
    </PageTransition>
  );
}
