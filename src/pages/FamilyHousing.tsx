import { useEffect, useState } from 'react';
import { Checkbox, FormControlLabel, MenuItem, TextField } from '@mui/material';
import { FormFull, FormGrid } from '../components/PageShell';
import OnboardingFrame from '../components/onboarding/OnboardingFrame';
import { useAmplifyProfile } from '../hooks/useAmplifyProfile';
import { HOUSING_STATUSES, MARITAL_REGIMES, MARITAL_STATUSES } from '../onboarding/catalog';
import { useOnboardingNav } from '../onboarding/navigation';

export default function FamilyHousing() {
  const { profile, loading, saving, error, save } = useAmplifyProfile();
  const { goBack, goNext } = useOnboardingNav('/onboarding/confirm', '/onboarding/contacts');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [maritalRegime, setMaritalRegime] = useState('');
  const [numberOfChildren, setNumberOfChildren] = useState('0');
  const [housingStatus, setHousingStatus] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [differentMail, setDifferentMail] = useState(false);
  const [mailingAddress, setMailingAddress] = useState('');

  useEffect(() => {
    if (!profile) return;
    setMaritalStatus(profile.maritalStatus ?? '');
    setMaritalRegime(profile.maritalRegime ?? '');
    setNumberOfChildren(String(profile.numberOfChildren ?? 0));
    setHousingStatus(profile.housingStatus ?? '');
    setPermanentAddress(profile.permanentAddress ?? '');
    setMailingAddress(profile.mailingAddress ?? '');
    setDifferentMail(Boolean(profile.mailingAddress));
  }, [profile]);

  const ready = Boolean(maritalStatus && housingStatus && permanentAddress.trim());

  const handleContinue = async () => {
    try {
      await save({
        maritalStatus,
        maritalRegime: maritalStatus === 'marie' ? maritalRegime : '',
        numberOfChildren: Number(numberOfChildren) || 0,
        housingStatus,
        permanentAddress: permanentAddress.trim(),
        mailingAddress: differentMail ? mailingAddress.trim() : '',
        currentStep: 'contacts',
      });
      goNext();
    } catch {
      // Shown by the frame.
    }
  };

  return (
    <OnboardingFrame
      step={3}
      title="Famille et logement"
      subtitle="Ces détails complètent votre dossier"
      onBack={goBack}
      onContinue={handleContinue}
      continueDisabled={!ready}
      saving={saving}
      loading={loading}
      error={error}
    >
      <FormGrid>
        <TextField select fullWidth label="Situation matrimoniale" value={maritalStatus} onChange={(event) => setMaritalStatus(event.target.value)} helperText="Votre situation actuelle">
          {MARITAL_STATUSES.map((item) => (
            <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
          ))}
        </TextField>
        <TextField
          fullWidth
          type="number"
          label="Enfants à charge"
          value={numberOfChildren}
          onChange={(event) => setNumberOfChildren(event.target.value)}
          helperText="0 si vous n’en avez pas"
          inputProps={{ min: 0 }}
        />
        {maritalStatus === 'marie' && (
          <FormFull>
            <TextField select fullWidth label="Régime matrimonial" value={maritalRegime} onChange={(event) => setMaritalRegime(event.target.value)} helperText="Optionnel">
              <MenuItem value="">Non précisé</MenuItem>
              {MARITAL_REGIMES.map((item) => (
                <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
              ))}
            </TextField>
          </FormFull>
        )}
        <TextField select fullWidth label="Logement" value={housingStatus} onChange={(event) => setHousingStatus(event.target.value)} helperText="Votre situation actuelle">
          {HOUSING_STATUSES.map((item) => (
            <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
          ))}
        </TextField>
        <FormFull>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Adresse permanente"
            value={permanentAddress}
            onChange={(event) => setPermanentAddress(event.target.value)}
            placeholder="123 Avenue de la Gombe, Kinshasa"
            helperText="Numéro, rue, commune et ville"
          />
        </FormFull>
        <FormFull>
          <FormControlLabel
            control={<Checkbox checked={differentMail} onChange={(event) => setDifferentMail(event.target.checked)} />}
            label="Mon adresse postale est différente"
          />
        </FormFull>
        {differentMail && (
          <FormFull>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Adresse postale"
              value={mailingAddress}
              onChange={(event) => setMailingAddress(event.target.value)}
            />
          </FormFull>
        )}
      </FormGrid>
    </OnboardingFrame>
  );
}
