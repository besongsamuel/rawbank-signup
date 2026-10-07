import { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import OnboardingFrame from '../components/onboarding/OnboardingFrame';
import { useAmplifyProfile } from '../hooks/useAmplifyProfile';
import { CARD_OPTIONS } from '../onboarding/catalog';
import { useOnboardingNav } from '../onboarding/navigation';

export default function CardChoice() {
  const { profile, loading, saving, error, save } = useAmplifyProfile();
  const { goBack, goNext } = useOnboardingNav('/onboarding/pep', '/dashboard');
  const [cardType, setCardType] = useState('carte_fidelite_usd');

  useEffect(() => {
    if (profile?.cardType) setCardType(profile.cardType);
  }, [profile]);

  const handleContinue = async () => {
    try {
      await save({ cardType, profileComplete: true, currentStep: 'done' });
      goNext();
    } catch {
      // Shown by the frame.
    }
  };

  return (
    <OnboardingFrame
      step={8}
      title="Choisissez votre carte"
      subtitle="Vous pourrez la retirer à l’agence après validation"
      onBack={goBack}
      onContinue={handleContinue}
      continueDisabled={!cardType}
      saving={saving}
      loading={loading}
      error={error}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
        {CARD_OPTIONS.map((card) => {
          const selected = cardType === card.id;
          return (
            <Button
              key={card.id}
              variant="outlined"
              onClick={() => setCardType(card.id)}
              sx={{
                justifyContent: 'flex-start',
                textAlign: 'left',
                px: 2,
                py: 1.5,
                borderColor: selected ? '#FFCC00' : '#E5E5E5',
                bgcolor: selected ? '#FFCC00' : '#FFFFFF',
                color: '#0A0A0A',
                '&:hover': { borderColor: '#FFCC00', bgcolor: selected ? '#FFD633' : '#FAFAFA' },
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 600 }}>{card.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.description}
                </Typography>
              </Box>
            </Button>
          );
        })}
      </Box>
    </OnboardingFrame>
  );
}
