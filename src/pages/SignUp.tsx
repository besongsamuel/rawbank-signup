import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Collapse,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAuthenticator } from '@aws-amplify/ui-react';
import AuthSplit from '../components/AuthSplit';
import { StaggerItem, StepSwap } from '../components/Motion';
import AuthBackButton from '../components/auth/AuthBackButton';
import CodeDigits from '../components/auth/CodeDigits';
import accountArt from '../assets/auth-account.jpg';
import codeArt from '../assets/auth-code.jpg';
import {
  isValidEmail,
  passwordChecks,
  useAmplifyAuth,
} from '../hooks/useAmplifyAuth';

export default function SignUp() {
  const navigate = useNavigate();
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const { loading, error, notice, register, confirm, resend } = useAmplifyAuth();

  const [step, setStep] = useState<'details' | 'code'>('details');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);

  const checks = passwordChecks(password);
  const passwordReady = checks.every((check) => check.ok);
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const emailReady = isValidEmail(email);

  useEffect(() => {
    if (authStatus === 'authenticated') {
      navigate('/account');
    }
  }, [authStatus, navigate]);

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault();
    setTouched(true);
    if (!emailReady || !passwordReady || !passwordsMatch) return;

    const result = await register(email.trim(), password);
    if (result === 'confirm') setStep('code');
  };

  const handleConfirm = async (event: FormEvent) => {
    event.preventDefault();
    if (code.trim().length < 6) return;
    await confirm(email.trim(), code.trim(), password);
  };

  const handleBack = () => {
    if (step === 'code') {
      setStep('details');
      return;
    }
    navigate('/');
  };

  return (
    <AuthSplit subtitle="Quelques secondes, puis vous pourrez vous connecter.">
      <AuthBackButton onClick={handleBack} />

      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        {['Compte', 'Code'].map((label, index) => {
          const active = step === 'details' ? index === 0 : index === 1;
          const done = step === 'code' && index === 0;
          return (
            <Box key={label} sx={{ flex: 1 }}>
              <Box
                sx={{
                  height: 4,
                  borderRadius: 99,
                  bgcolor: active || done ? '#FFCC00' : '#E5E5E5',
                  transition: 'background-color 200ms ease',
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  mt: 0.75,
                  textAlign: 'center',
                  color: active ? '#0A0A0A' : '#5C5C5C',
                  fontWeight: active ? 600 : 500,
                }}
              >
                {label}
              </Typography>
            </Box>
          );
        })}
      </Box>

      <Collapse in={Boolean(error)}>
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      </Collapse>
      <Collapse in={Boolean(notice) && !error}>
        <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
          {notice}
        </Alert>
      </Collapse>

      <StepSwap stepKey={step}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <StaggerItem index={0}>
            <Box
              component="img"
              src={step === 'code' ? codeArt : accountArt}
              alt=""
              sx={{ width: 140, height: 140, objectFit: 'contain', display: { xs: 'block', md: 'none' }, mx: 'auto', mb: 1 }}
            />
          </StaggerItem>
          <StaggerItem index={1}>
            <Typography variant="h1" sx={{ mb: 1.5, fontSize: { xs: '2rem', sm: '2.5rem' } }}>
              {step === 'details' ? 'Créez votre compte' : 'Vérifiez votre e-mail'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {step === 'details'
                ? 'Quelques secondes, puis vous pourrez vous connecter.'
                : `Entrez le code à 6 chiffres envoyé à ${email.trim()}.`}
            </Typography>
          </StaggerItem>
        </Box>

        {step === 'details' ? (
          <Box component="form" onSubmit={handleCreate} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <StaggerItem index={2}>
              <TextField
                fullWidth
                label="Adresse e-mail"
                type="email"
                autoComplete="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                error={touched && !emailReady}
                helperText={
                  touched && !emailReady
                    ? 'Entrez une adresse e-mail valide, par exemple marie@email.com'
                    : 'Nous enverrons un code de confirmation à cette adresse'
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon sx={{ color: '#0A0A0A' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </StaggerItem>

            <StaggerItem index={3}>
              <TextField
                fullWidth
                label="Mot de passe"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                error={touched && !passwordReady}
                helperText="Il protège votre nouveau compte Rawbank"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: '#0A0A0A' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                        onClick={() => setShowPassword((current) => !current)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </StaggerItem>

            <StaggerItem index={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                {checks.map((check) => (
                  <Box key={check.label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleIcon sx={{ fontSize: 18, color: check.ok ? '#34C759' : '#C7C7C7' }} />
                    <Typography variant="body2" sx={{ color: check.ok ? '#0A0A0A' : '#5C5C5C' }}>
                      {check.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </StaggerItem>

            <StaggerItem index={5}>
              <TextField
                fullWidth
                label="Confirmez le mot de passe"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                error={touched && confirmPassword.length > 0 && !passwordsMatch}
                helperText={
                  confirmPassword.length === 0
                    ? 'Retapez le même mot de passe'
                    : passwordsMatch
                      ? 'Les mots de passe correspondent'
                      : 'Les deux mots de passe doivent être identiques'
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: passwordsMatch ? '#34C759' : '#0A0A0A' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </StaggerItem>

            <StaggerItem index={6}>
              <Button fullWidth variant="contained" size="large" type="submit" disabled={loading}>
                {loading ? 'Création du compte...' : 'Créer mon compte'}
              </Button>
            </StaggerItem>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleConfirm} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <StaggerItem index={2}>
              <CodeDigits value={code} onChange={setCode} />
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 1.5 }}>
                Regardez votre boîte de réception, et les courriers indésirables
              </Typography>
            </StaggerItem>

            <StaggerItem index={3}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Button fullWidth variant="contained" size="large" type="submit" disabled={loading || code.length < 6}>
                  {loading ? 'Vérification...' : 'Confirmer et continuer'}
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  type="button"
                  disabled={loading}
                  onClick={() => resend(email.trim())}
                >
                  Renvoyer le code
                </Button>
              </Box>
            </StaggerItem>
          </Box>
        )}
      </StepSwap>

      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Vous avez déjà un compte?{' '}
          <Link
            component="button"
            type="button"
            variant="body2"
            onClick={() => navigate('/signin')}
            sx={{ color: '#0A0A0A', fontWeight: 600, textDecoration: 'none' }}
          >
            Connectez-vous
          </Link>
        </Typography>
      </Box>
    </AuthSplit>
  );
}
