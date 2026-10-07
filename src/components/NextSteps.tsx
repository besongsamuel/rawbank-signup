import { Box, Typography } from '@mui/material';

const steps = [
  'Notre équipe vérifie vos documents (24-48h)',
  'Vous recevrez un e-mail de confirmation',
  'Passez retirer votre carte dans une agence Rawbank',
];

export default function NextSteps() {
  return (
    <Box
      sx={{
        bgcolor: '#FAFAFA',
        borderRadius: 3,
        p: 3,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Prochaines étapes
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {steps.map((step) => (
          <Box key={step} sx={{ display: 'flex', gap: 2 }}>
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
            <Typography variant="body2">{step}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
