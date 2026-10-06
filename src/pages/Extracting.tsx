import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, LinearProgress } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { BreathingIcon } from '../components/Motion';

export default function Extracting() {
  const navigate = useNavigate();
  const location = useLocation();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate AI extraction progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Navigate to confirm screen after extraction
          setTimeout(() => {
            navigate('/onboarding/confirm', {
              state: location.state,
            });
          }, 300);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [navigate, location.state]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#FFFFFF',
        px: 3,
      }}
    >
      <BreathingIcon>
        <AutoAwesomeIcon 
          sx={{ 
            fontSize: 80, 
            color: '#FFCC00',
            mb: 4,
          }} 
        />
      </BreathingIcon>

      <Typography 
        variant="h2" 
        sx={{ 
          mb: 1,
          fontSize: '1.5rem',
          textAlign: 'center',
        }}
      >
        Extraction en cours...
      </Typography>
      
      <Typography 
        variant="body2" 
        color="text.secondary"
        sx={{ mb: 6, textAlign: 'center', maxWidth: 320 }}
      >
        Notre IA analyse votre document
      </Typography>

      <Box sx={{ width: '100%', maxWidth: 300 }}>
        <LinearProgress 
          variant="determinate" 
          value={progress}
          sx={{
            height: 6,
            borderRadius: 3,
            bgcolor: '#F5F5F5',
            '& .MuiLinearProgress-bar': {
              bgcolor: '#FFCC00',
              transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            },
          }}
        />
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ mt: 2, textAlign: 'center' }}
        >
          {progress}%
        </Typography>
      </Box>
    </Box>
  );
}
