import { useEffect, useState } from 'react';
import { Box, MenuItem, TextField } from '@mui/material';
import OnboardingFrame from '../components/onboarding/OnboardingFrame';
import { useAmplifyProfile } from '../hooks/useAmplifyProfile';
import { INCOME_SOURCES } from '../onboarding/catalog';
import { useOnboardingNav } from '../onboarding/navigation';

export default function Profession() {
  const { profile, loading, saving, error, save } = useAmplifyProfile();
  const { goBack, goNext } = useOnboardingNav('/onboarding/verify', '/onboarding/fatca');
  const [profession, setProfession] = useState('');
  const [employer, setEmployer] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [incomeSource, setIncomeSource] = useState('');

  useEffect(() => {
    if (!profile) return;
    setProfession(profile.profession ?? '');
    setEmployer(profile.employer ?? '');
    setMonthlyIncome(profile.monthlyIncome == null ? '' : String(profile.monthlyIncome));
    setIncomeSource(profile.incomeSource ?? '');
  }, [profile]);

  const income = Number(monthlyIncome);
  const ready = Boolean(profession.trim() && employer.trim() && incomeSource && monthlyIncome !== '' && income >= 0);

  const handleContinue = async () => {
    try {
      await save({
        profession: profession.trim(),
        employer: employer.trim(),
        monthlyIncome: income,
        incomeSource,
        currentStep: 'fatca',
      });
      goNext();
    } catch {
      // Shown by the frame.
    }
  };

  return (
    <OnboardingFrame
      step={5}
      title="Votre activité"
      subtitle="La profession et l’origine de vos revenus"
      onBack={goBack}
      onContinue={handleContinue}
      continueDisabled={!ready}
      saving={saving}
      loading={loading}
      error={error}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mb: 3 }}>
        <TextField fullWidth label="Profession" value={profession} onChange={(event) => setProfession(event.target.value)} placeholder="Commerçant, enseignant..." helperText="Ce que vous faites au quotidien" />
        <TextField fullWidth label="Employeur" value={employer} onChange={(event) => setEmployer(event.target.value)} placeholder="Nom de l’entreprise ou Indépendant" helperText="L’organisation qui vous rémunère" />
        <TextField fullWidth type="number" label="Revenu mensuel (USD)" value={monthlyIncome} onChange={(event) => setMonthlyIncome(event.target.value)} helperText="Montant brut approximatif" inputProps={{ min: 0 }} />
        <TextField select fullWidth label="Origine des revenus" value={incomeSource} onChange={(event) => setIncomeSource(event.target.value)} helperText="La source principale">
          {INCOME_SOURCES.map((item) => (
            <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
          ))}
        </TextField>
      </Box>
    </OnboardingFrame>
  );
}
