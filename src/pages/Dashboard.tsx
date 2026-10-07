import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { PageTransition } from '../components/Motion';
import NextSteps from '../components/NextSteps';
import PageShell from '../components/PageShell';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <PageShell>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: 4, md: 6 },
            alignItems: 'center',
          }}
        >
        <Box sx={{ textAlign: { xs: 'center', md: 'left' }, mb: { xs: 0, md: 0 } }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              margin: { xs: '0 auto 24px', md: '0 0 24px' },
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

        <Box>
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
        </Box>
        </Box>
      </PageShell>
    </PageTransition>
  );
}
