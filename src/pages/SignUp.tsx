import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, TextField, Button, Link } from '@mui/material';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { PageTransition } from '../components/Motion';

export default function SignUp() {
  const navigate = useNavigate();
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);

  useEffect(() => {
    if (authStatus === 'authenticated') {
      navigate('/onboarding/id-upload');
    }
  }, [authStatus, navigate]);

  return (
    <PageTransition>
      <Container maxWidth="sm" sx={{ py: { xs: 4, sm: 8 }, px: 3, maxWidth: '420px !important' }}>
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography 
            variant="h1" 
            sx={{ 
              mb: 1.5,
              fontSize: { xs: '2rem', sm: '2.5rem' },
            }}
          >
            Créez votre compte
          </Typography>
          <Typography variant="body2" color="text.secondary">
            C'est simple et rapide
          </Typography>
        </Box>

        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            fullWidth
            label="Adresse e-mail"
            type="email"
            autoComplete="email"
            placeholder="votre@email.com"
          />
          <TextField
            fullWidth
            label="Mot de passe"
            type="password"
            autoComplete="new-password"
            helperText="Minimum 8 caractères"
          />
          <TextField
            fullWidth
            label="Confirmez le mot de passe"
            type="password"
            autoComplete="new-password"
          />
          
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={() => navigate('/onboarding/id-upload')}
          >
            Créer mon compte
          </Button>

          <Box sx={{ textAlign: 'center', mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Vous avez déjà un compte?{' '}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/signin')}
                sx={{ 
                  color: '#0A0A0A', 
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Connectez-vous
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </PageTransition>
  );
}
