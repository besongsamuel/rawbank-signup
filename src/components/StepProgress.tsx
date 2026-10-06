import { Box, Typography } from '@mui/material';

interface StepProgressProps {
  currentStep: number;
  totalSteps?: number;
}

export default function StepProgress({ currentStep, totalSteps = 7 }: StepProgressProps) {
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Typography 
        variant="body2" 
        sx={{ 
          mb: 1, 
          color: '#5C5C5C',
          fontSize: '0.875rem',
        }}
      >
        Étape {currentStep} sur {totalSteps}
      </Typography>
      <Box
        sx={{
          width: '100%',
          height: 4,
          bgcolor: '#F5F5F5',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            width: `${percentage}%`,
            height: '100%',
            bgcolor: '#FFCC00',
            transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </Box>
    </Box>
  );
}
