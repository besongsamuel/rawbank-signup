import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, keyframes } from '@mui/material';
import { useAuthenticator } from '@aws-amplify/ui-react';

const breatheSlow = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.015);
  }
`;

export default function Welcome() {
  const navigate = useNavigate();
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (authStatus === 'authenticated') {
      navigate('/onboarding/id-upload');
    }
  }, [authStatus, navigate]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#FFFFFF',
      }}
    >
      <Container 
        maxWidth="sm" 
        sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          px: 3,
          py: 6,
          maxWidth: '420px !important',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          {/* Yellow claw accent with subtle breath */}
          <Box
            sx={{
              width: 80,
              height: 80,
              margin: '0 auto 32px',
              background: 'linear-gradient(135deg, #FFCC00 0%, #FFD633 100%)',
              borderRadius: '50% 50% 0 50%',
              transform: 'rotate(-45deg)',
              '@media (prefers-reduced-motion: no-preference)': {
                animation: `${breatheSlow} 5000ms ease-in-out infinite`,
              },
            }}
          />
          
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', sm: '3rem' },
              fontWeight: 700,
              color: '#0A0A0A',
              mb: 3,
              letterSpacing: '-0.03em',
            }}
          >
            RAWBANK
          </Typography>
          
          <Typography
            variant="body1"
            sx={{
              fontSize: '1.125rem',
              lineHeight: 1.6,
              color: '#5C5C5C',
              maxWidth: 360,
              mx: 'auto',
            }}
          >
            Ouvrez votre compte en quelques minutes
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={() => navigate('/signup')}
          >
            Continuer
          </Button>

          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/signin')}
            sx={{ 
              color: '#5C5C5C',
              fontSize: '0.9375rem',
            }}
          >
            J'ai déjà un compte
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
