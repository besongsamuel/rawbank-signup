import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, InputAdornment, MenuItem, TextField } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import { FormFull, FormGrid } from '../components/PageShell';
import OnboardingFrame from '../components/onboarding/OnboardingFrame';
import { useAmplifyProfile } from '../hooks/useAmplifyProfile';
import { useOnboardingNav } from '../onboarding/navigation';

const COUNTRY_CODE = '+243';
const LOCAL_LENGTH = 9;
const CITIES = ['Kinshasa', 'Lubumbashi', 'Goma', 'Bukavu', 'Kisangani'];

function formatLocalPhone(digits: string) {
  return [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 9)].filter(Boolean).join(' ');
}

function toLocalDigits(value: string) {
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('243')) digits = digits.slice(3);
  if (digits.startsWith('0')) digits = digits.slice(1);
  return digits.slice(0, LOCAL_LENGTH);
}

export default function RemainingInfo() {
  const navigate = useNavigate();
  const { profile, loading, saving, error, save } = useAmplifyProfile();
  const { returnTo, goBack } = useOnboardingNav('/onboarding/family', '/onboarding/verify');
  const [phone, setPhone] = useState('');
  const [phone2, setPhone2] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Kinshasa');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  useEffect(() => {
    if (!profile) return;
    setPhone(toLocalDigits(profile.phone ?? ''));
    setPhone2(toLocalDigits(profile.phone2 ?? ''));
    setAddress(profile.address ?? '');
    setCity(profile.city || 'Kinshasa');
    setEmergencyName(profile.emergencyContactName ?? '');
    setEmergencyPhone(toLocalDigits(profile.emergencyContactPhone ?? ''));
  }, [profile]);

  const phoneComplete = phone.length === LOCAL_LENGTH;
  const ready = phoneComplete && Boolean(address.trim() && city && emergencyName.trim() && emergencyPhone.length === LOCAL_LENGTH);

  const handleContinue = async () => {
    const fullPhone = `${COUNTRY_CODE}${phone}`;
    const phoneChanged = fullPhone !== (profile?.phone ?? '');
    const skipOtp = Boolean(returnTo && !phoneChanged && profile?.phoneVerified);
    try {
      await save({
        phone: fullPhone,
        phone2: phone2 ? `${COUNTRY_CODE}${phone2}` : '',
        address: address.trim(),
        city,
        emergencyContactName: emergencyName.trim(),
        emergencyContactPhone: `${COUNTRY_CODE}${emergencyPhone}`,
        phoneVerified: skipOtp,
        currentStep: 'contacts',
      });
    } catch {
      return;
    }
    if (skipOtp) {
      navigate('/account');
      return;
    }
    navigate('/onboarding/verify', { state: returnTo ? { returnTo } : undefined });
  };

  return (
    <OnboardingFrame
      step={4}
      title="Vos contacts"
      subtitle="Un numéro pour le code SMS et une personne à prévenir"
      onBack={goBack}
      onContinue={handleContinue}
      continueDisabled={!ready}
      saving={saving}
      loading={loading}
      error={error}
    >
      <FormGrid>
        <TextField
          fullWidth
          type="tel"
          label="Téléphone"
          value={formatLocalPhone(phone)}
          onChange={(event) => setPhone(toLocalDigits(event.target.value))}
          placeholder="XXX XXX XXX"
          helperText="Numéro congolais, sans le 0. Nous enverrons un code de vérification"
          inputProps={{ inputMode: 'numeric', maxLength: 11 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PhoneIcon sx={{ color: '#0A0A0A', fontSize: 20, mr: 0.75 }} />
                <Box component="span" sx={{ fontWeight: 600, color: '#0A0A0A' }}>{COUNTRY_CODE}</Box>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth
          type="tel"
          label="Autre téléphone"
          value={formatLocalPhone(phone2)}
          onChange={(event) => setPhone2(toLocalDigits(event.target.value))}
          placeholder="XXX XXX XXX"
          helperText="Optionnel"
          inputProps={{ inputMode: 'numeric', maxLength: 11 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Box component="span" sx={{ fontWeight: 600, color: '#0A0A0A' }}>{COUNTRY_CODE}</Box>
              </InputAdornment>
            ),
          }}
        />
        <FormFull>
          <TextField fullWidth label="Adresse" value={address} onChange={(event) => setAddress(event.target.value)} placeholder="123 Avenue Kasavubu" multiline rows={2} />
        </FormFull>
        <TextField select fullWidth label="Ville" value={city} onChange={(event) => setCity(event.target.value)}>
          {CITIES.map((item) => (
            <MenuItem key={item} value={item}>{item}</MenuItem>
          ))}
        </TextField>
        <TextField fullWidth label="Personne à prévenir" value={emergencyName} onChange={(event) => setEmergencyName(event.target.value)} helperText="Un proche en cas d’urgence" />
        <TextField
          fullWidth
          type="tel"
          label="Téléphone du proche"
          value={formatLocalPhone(emergencyPhone)}
          onChange={(event) => setEmergencyPhone(toLocalDigits(event.target.value))}
          placeholder="XXX XXX XXX"
          inputProps={{ inputMode: 'numeric', maxLength: 11 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Box component="span" sx={{ fontWeight: 600, color: '#0A0A0A' }}>{COUNTRY_CODE}</Box>
              </InputAdornment>
            ),
          }}
        />
      </FormGrid>
    </OnboardingFrame>
  );
}
