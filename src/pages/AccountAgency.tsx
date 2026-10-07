import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, MenuItem, TextField, Typography } from '@mui/material';
import OnboardingFrame from '../components/onboarding/OnboardingFrame';
import { useAmplifyProfile } from '../hooks/useAmplifyProfile';
import { ACCOUNT_TYPES, AGENCIES } from '../onboarding/catalog';
import { useOnboardingNav } from '../onboarding/navigation';

export default function AccountAgency() {
  const navigate = useNavigate();
  const { profile, loading, saving, error, save } = useAmplifyProfile();
  const { returnTo, goNext } = useOnboardingNav('/', '/onboarding/id-upload');
  const [accountType, setAccountType] = useState('individual');
  const [agencyId, setAgencyId] = useState('kinshasa_center');

  useEffect(() => {
    if (!profile) return;
    if (profile.accountType) setAccountType(profile.accountType);
    if (profile.agencyId) setAgencyId(profile.agencyId);
  }, [profile]);

  const handleContinue = async () => {
    try {
      await save({ accountType, agencyId, currentStep: 'identity' });
      goNext();
    } catch {
      // The hook already stores the message.
    }
  };

  return (
    <OnboardingFrame
      step={1}
      title="Choisissez votre compte"
      subtitle="Le type de compte et l’agence où vous serez reçu"
      onBack={() => navigate(returnTo ?? '/', { state: returnTo ? undefined : { fromOnboarding: true } })}
      onContinue={handleContinue}
      continueDisabled={!accountType || !agencyId}
      saving={saving}
      loading={loading}
      error={error}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 1.5,
          mb: 3,
        }}
      >
        {ACCOUNT_TYPES.map((type) => {
          const selected = accountType === type.value;
          return (
            <Button
              key={type.value}
              variant="outlined"
              onClick={() => setAccountType(type.value)}
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
                <Typography sx={{ fontWeight: 600 }}>{type.label}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {type.description}
                </Typography>
              </Box>
            </Button>
          );
        })}
        <TextField
          select
          fullWidth
          label="Agence"
          value={agencyId}
          onChange={(event) => setAgencyId(event.target.value)}
          helperText="Vous pourrez y retirer votre carte"
          sx={{ gridColumn: { md: '1 / -1' } }}
        >
          {AGENCIES.map((agency) => (
            <MenuItem key={agency.id} value={agency.id}>
              {agency.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>
    </OnboardingFrame>
  );
}
