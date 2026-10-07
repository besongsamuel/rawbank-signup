import { useEffect, useState } from 'react';
import { Box, Button, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';
import OnboardingFrame from '../components/onboarding/OnboardingFrame';
import { useAmplifyProfile } from '../hooks/useAmplifyProfile';
import { useOnboardingNav } from '../onboarding/navigation';

const FLAGS = [
  { key: 'usCitizenship', label: 'Citoyenneté américaine' },
  { key: 'usBirthPlace', label: 'Né(e) aux États-Unis' },
  { key: 'usResidence', label: 'Résidence aux États-Unis' },
  { key: 'usAddress', label: 'Adresse aux États-Unis' },
  { key: 'usPhone', label: 'Numéro de téléphone américain' },
  { key: 'usPowerOfAttorney', label: 'Procuration donnée à une personne aux États-Unis' },
] as const;

type FlagKey = (typeof FLAGS)[number]['key'];

export default function Fatca() {
  const { profile, loading, saving, error, save } = useAmplifyProfile();
  const { goBack, goNext } = useOnboardingNav('/onboarding/profession', '/onboarding/pep');
  const [isUSPerson, setIsUSPerson] = useState(false);
  const [usTin, setUsTin] = useState('');
  const [flags, setFlags] = useState<Record<FlagKey, boolean>>({
    usCitizenship: false,
    usBirthPlace: false,
    usResidence: false,
    usAddress: false,
    usPhone: false,
    usPowerOfAttorney: false,
  });

  useEffect(() => {
    const data = profile?.fatcaData as { isUSPerson?: boolean; usTin?: string } & Partial<Record<FlagKey, boolean>> | null;
    if (!data || typeof data !== 'object') return;
    setIsUSPerson(Boolean(data.isUSPerson));
    setUsTin(data.usTin ?? '');
    setFlags((current) => {
      const next = { ...current };
      FLAGS.forEach((flag) => {
        next[flag.key] = Boolean(data[flag.key]);
      });
      return next;
    });
  }, [profile]);

  const ready = !isUSPerson || Boolean(usTin.trim());

  const handleContinue = async () => {
    try {
      await save({
        fatcaData: { isUSPerson, usTin: isUSPerson ? usTin.trim() : '', ...flags },
        currentStep: 'pep',
      });
      goNext();
    } catch {
      // Shown by the frame.
    }
  };

  return (
    <OnboardingFrame
      step={6}
      title="Déclaration FATCA"
      subtitle="Indiquez si vous avez un lien fiscal avec les États-Unis"
      onBack={goBack}
      onContinue={handleContinue}
      continueDisabled={!ready}
      saving={saving}
      loading={loading}
      error={error}
    >
      <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
        <Button fullWidth variant={isUSPerson ? 'outlined' : 'contained'} onClick={() => setIsUSPerson(false)}>
          Non
        </Button>
        <Button fullWidth variant={isUSPerson ? 'contained' : 'outlined'} onClick={() => setIsUSPerson(true)}>
          Oui
        </Button>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Êtes-vous une personne américaine au sens fiscal ?
      </Typography>
      {isUSPerson && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
          <TextField fullWidth label="Numéro fiscal américain (TIN)" value={usTin} onChange={(event) => setUsTin(event.target.value)} helperText="Obligatoire pour une personne américaine" />
          {FLAGS.map((flag) => (
            <FormControlLabel
              key={flag.key}
              control={
                <Checkbox
                  checked={flags[flag.key]}
                  onChange={(event) => setFlags((current) => ({ ...current, [flag.key]: event.target.checked }))}
                />
              }
              label={flag.label}
            />
          ))}
        </Box>
      )}
    </OnboardingFrame>
  );
}
