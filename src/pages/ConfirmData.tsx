import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Container, Typography, TextField, Button, Grid } from '@mui/material';
import StepProgress from '../components/StepProgress';
import { PageTransition, YellowClawFlash } from '../components/Motion';
import AuthBackButton from '../components/auth/AuthBackButton';
import { useAmplifyProfile } from '../hooks/useAmplifyProfile';
import { ONBOARDING_STEP_COUNT } from '../onboarding/catalog';
import { useOnboardingNav } from '../onboarding/navigation';

export default function ConfirmData() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, saving, error, save } = useAmplifyProfile();
  const { returnTo, goNext } = useOnboardingNav('/onboarding/id-upload', '/onboarding/family');
  const [showFlash, setShowFlash] = useState(true);

  // Simulated extracted data - in real app, this comes from Lambda
  const [formData, setFormData] = useState({
    firstName: 'Jean',
    middleName: 'Ngandu',
    lastName: 'Mukendi',
    birthDate: '1990-05-20',
    idNumber: 'AB1234567',
  });

  useEffect(() => {
    const timer = setTimeout(() => setShowFlash(false), 450);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const manual = Boolean((location.state as { manual?: boolean } | null)?.manual);
    if (!profile || (!profile.firstName && !profile.idNumber && !manual && !returnTo)) return;
    setFormData({
      firstName: profile.firstName ?? '',
      middleName: profile.middleName ?? '',
      lastName: profile.lastName ?? '',
      birthDate: profile.birthDate ?? '',
      idNumber: profile.idNumber ?? '',
    });
  }, [profile, location.state, returnTo]);

  const handleChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleContinue = async () => {
    const state = location.state as { idType?: string; imageKey?: string } | null;
    try {
      await save({
        firstName: formData.firstName.trim(),
        middleName: formData.middleName.trim(),
        lastName: formData.lastName.trim(),
        birthDate: formData.birthDate || null,
        idNumber: formData.idNumber.trim(),
        idType: state?.idType || profile?.idType,
        idImageKey: state?.imageKey || profile?.idImageKey,
        extractionConfirmed: true,
        currentStep: 'family',
      });
      goNext();
    } catch {
      // The error from the hook is shown under the form.
    }
  };

  return (
    <PageTransition>
      {showFlash && <YellowClawFlash />}
      
      <Container maxWidth="sm" sx={{ py: { xs: 3, sm: 6 }, px: 3, maxWidth: '420px !important' }}>
        <AuthBackButton onClick={() => navigate(returnTo ?? '/onboarding/id-upload')} />
        <StepProgress currentStep={2} totalSteps={ONBOARDING_STEP_COUNT} />

        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant="h1" 
            sx={{ 
              mb: 1.5,
              fontSize: { xs: '1.875rem', sm: '2.25rem' },
            }}
          >
            Vérifiez ces informations
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Modifiez si nécessaire
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Prénom"
              value={formData.firstName}
              onChange={handleChange('firstName')}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Postnom"
              value={formData.middleName}
              onChange={handleChange('middleName')}
              helperText="Nom de famille maternel"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nom"
              value={formData.lastName}
              onChange={handleChange('lastName')}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Date de naissance"
              type="date"
              value={formData.birthDate}
              onChange={handleChange('birthDate')}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Numéro de document"
              value={formData.idNumber}
              onChange={handleChange('idNumber')}
            />
          </Grid>
        </Grid>

        <Box
          sx={{
            position: { xs: 'fixed', sm: 'static' },
            bottom: { xs: 0, sm: 'auto' },
            left: { xs: 0, sm: 'auto' },
            right: { xs: 0, sm: 'auto' },
            p: { xs: 2, sm: 0 },
            bgcolor: { xs: '#FFFFFF', sm: 'transparent' },
            borderTop: { xs: '1px solid #F5F5F5', sm: 'none' },
            boxShadow: { xs: '0 -2px 12px rgba(10, 10, 10, 0.06)', sm: 'none' },
          }}
        >
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleContinue}
            disabled={saving || !formData.firstName || !formData.lastName || !formData.idNumber}
          >
            {saving ? 'Enregistrement...' : 'Confirmer'}
          </Button>
          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 1.5 }}>
              {error}
            </Typography>
          )}
        </Box>

        <Box sx={{ height: { xs: 88, sm: 0 } }} />
      </Container>
    </PageTransition>
  );
}
