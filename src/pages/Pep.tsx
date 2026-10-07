import { useEffect, useState } from 'react';
import { Box, Button, MenuItem, TextField, Typography } from '@mui/material';
import OnboardingFrame from '../components/onboarding/OnboardingFrame';
import { useAmplifyProfile } from '../hooks/useAmplifyProfile';
import { PEP_CATEGORIES } from '../onboarding/catalog';
import { useOnboardingNav } from '../onboarding/navigation';

export default function Pep() {
  const { profile, loading, saving, error, save } = useAmplifyProfile();
  const { goBack, goNext } = useOnboardingNav('/onboarding/fatca', '/onboarding/card');
  const [isPep, setIsPep] = useState(false);
  const [pepCategory, setPepCategory] = useState('');
  const [position, setPosition] = useState('');
  const [organization, setOrganization] = useState('');

  useEffect(() => {
    const data = profile?.pepData as {
      isPep?: boolean;
      pepCategory?: string;
      position?: string;
      organization?: string;
    } | null;
    if (!data || typeof data !== 'object') return;
    setIsPep(Boolean(data.isPep));
    setPepCategory(data.pepCategory ?? '');
    setPosition(data.position ?? '');
    setOrganization(data.organization ?? '');
  }, [profile]);

  const ready = !isPep || Boolean(pepCategory && position.trim() && organization.trim());

  const handleContinue = async () => {
    try {
      await save({
        pepData: isPep
          ? { isPep: true, pepCategory, position: position.trim(), organization: organization.trim() }
          : { isPep: false },
        currentStep: 'card',
      });
      goNext();
    } catch {
      // Shown by the frame.
    }
  };

  return (
    <OnboardingFrame
      step={7}
      title="Personne politiquement exposée"
      subtitle="Une question obligatoire pour ouvrir le compte"
      onBack={goBack}
      onContinue={handleContinue}
      continueDisabled={!ready}
      saving={saving}
      loading={loading}
      error={error}
    >
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Occupez-vous, ou un proche, une fonction publique importante ?
      </Typography>
      <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
        <Button fullWidth variant={isPep ? 'outlined' : 'contained'} onClick={() => setIsPep(false)}>
          Non
        </Button>
        <Button fullWidth variant={isPep ? 'contained' : 'outlined'} onClick={() => setIsPep(true)}>
          Oui
        </Button>
      </Box>
      {isPep && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mb: 3 }}>
          <TextField select fullWidth label="Catégorie" value={pepCategory} onChange={(event) => setPepCategory(event.target.value)}>
            {PEP_CATEGORIES.map((item) => (
              <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
            ))}
          </TextField>
          <TextField fullWidth label="Fonction" value={position} onChange={(event) => setPosition(event.target.value)} />
          <TextField fullWidth label="Organisation" value={organization} onChange={(event) => setOrganization(event.target.value)} />
        </Box>
      )}
    </OnboardingFrame>
  );
}
