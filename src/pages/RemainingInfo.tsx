import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, TextField, Button, Grid, MenuItem, InputAdornment } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import StepProgress from '../components/StepProgress';
import { PageTransition } from '../components/Motion';
import AuthBackButton from '../components/auth/AuthBackButton';

const COUNTRY_CODE = '+243';
const LOCAL_LENGTH = 9;

function formatLocalPhone(digits: string) {
  return [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 9)]
    .filter(Boolean)
    .join(' ');
}

function toLocalDigits(value: string) {
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('243')) digits = digits.slice(3);
  if (digits.startsWith('0')) digits = digits.slice(1);
  return digits.slice(0, LOCAL_LENGTH);
}

export default function RemainingInfo() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    city: 'Kinshasa',
  });

  const handleChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, phone: toLocalDigits(event.target.value) }));
  };

  const phoneComplete = formData.phone.length === LOCAL_LENGTH;

  const handleContinue = () => {
    localStorage.setItem(
      'remainingInfo',
      JSON.stringify({ ...formData, phone: `${COUNTRY_CODE}${formData.phone}` })
    );
    navigate('/onboarding/verify');
  };

  return (
    <PageTransition>
      <Container maxWidth="sm" sx={{ py: { xs: 3, sm: 6 }, px: 3, maxWidth: '420px !important' }}>
        <AuthBackButton onClick={() => navigate(-1)} />
        <StepProgress currentStep={3} />

        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant="h1" 
            sx={{ 
              mb: 1.5,
              fontSize: { xs: '1.875rem', sm: '2.25rem' },
            }}
          >
            Complétez ces informations
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Quelques détails supplémentaires
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="tel"
              label="Téléphone"
              value={formatLocalPhone(formData.phone)}
              onChange={handlePhoneChange}
              placeholder="XXX XXX XXX"
              helperText="Numéro congolais, sans le 0. Nous enverrons un code de vérification"
              autoComplete="tel-national"
              inputProps={{ inputMode: 'numeric', maxLength: 11 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon sx={{ color: '#0A0A0A', fontSize: 20, mr: 0.75 }} />
                    <Box component="span" sx={{ fontWeight: 600, color: '#0A0A0A' }}>
                      {COUNTRY_CODE}
                    </Box>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Adresse"
              value={formData.address}
              onChange={handleChange('address')}
              placeholder="123 Avenue Kasavubu"
              multiline
              rows={2}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Ville"
              value={formData.city}
              onChange={handleChange('city')}
            >
              <MenuItem value="Kinshasa">Kinshasa</MenuItem>
              <MenuItem value="Lubumbashi">Lubumbashi</MenuItem>
              <MenuItem value="Goma">Goma</MenuItem>
              <MenuItem value="Bukavu">Bukavu</MenuItem>
              <MenuItem value="Kisangani">Kisangani</MenuItem>
            </TextField>
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
            disabled={!phoneComplete || !formData.address}
          >
            Continuer
          </Button>
        </Box>

        <Box sx={{ height: { xs: 88, sm: 0 } }} />
      </Container>
    </PageTransition>
  );
}
