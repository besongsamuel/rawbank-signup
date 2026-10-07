import { Container, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { PageTransition } from '../components/Motion';
import NextSteps from '../components/NextSteps';

export default function Dashboard() {
  const navigate = useNavigate();

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

        <Box sx={{ mb: 3 }}>
          <NextSteps />
        </Box>

        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={() => navigate('/account')}
        >
          Voir mon dossier
        </Button>
      </Container>
    </PageTransition>
  );
}
