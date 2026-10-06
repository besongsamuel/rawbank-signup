import { Container, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { PageTransition } from '../components/Motion';

export default function Dashboard() {
  const navigate = useNavigate();
  const { signOut } = useAuthenticator((context) => [context.signOut]);

  return (
    <PageTransition>
      <Container maxWidth="sm" sx={{ py: { xs: 4, sm: 8 }, px: 3, maxWidth: '420px !important' }}>
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              margin: '0 auto 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              bgcolor: '#F0FDF4',
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 48, color: '#34C759' }} />
          </Box>
          
          <Typography 
            variant="h1" 
            sx={{ 
              mb: 2,
              fontSize: { xs: '2rem', sm: '2.5rem' },
            }}
          >
            Demande envoyée!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Votre demande d'ouverture de compte est en cours de traitement
          </Typography>
        </Box>

        <Box
          sx={{
            bgcolor: '#FAFAFA',
            borderRadius: 3,
            p: 3,
            mb: 3,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Prochaines étapes
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: '#FFCC00',
                  mt: 1,
                  flexShrink: 0,
                }}
              />
              <Typography variant="body2">
                Notre équipe vérifie vos documents (24-48h)
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: '#FFCC00',
                  mt: 1,
                  flexShrink: 0,
                }}
              />
              <Typography variant="body2">
                Vous recevrez un e-mail de confirmation
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: '#FFCC00',
                  mt: 1,
                  flexShrink: 0,
                }}
              />
              <Typography variant="body2">
                Passez retirer votre carte dans une agence Rawbank
              </Typography>
            </Box>
          </Box>
        </Box>

        <Button
          fullWidth
          variant="outlined"
          onClick={() => signOut()}
        >
          Se déconnecter
        </Button>
      </Container>
    </PageTransition>
  );
}
