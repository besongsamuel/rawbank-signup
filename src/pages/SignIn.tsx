import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Collapse,
  Container,
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
import { useAuthenticator } from '@aws-amplify/ui-react';
import { StaggerItem, StepSwap } from '../components/Motion';
import AuthBackButton from '../components/auth/AuthBackButton';
import CodeDigits from '../components/auth/CodeDigits';
import accountArt from '../assets/auth-account.jpg';
import codeArt from '../assets/auth-code.jpg';
import { isValidEmail, useAmplifyAuth } from '../hooks/useAmplifyAuth';

export default function SignIn() {
  const navigate = useNavigate();
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const { loading, error, notice, login, confirm, resend } = useAmplifyAuth();

  const [step, setStep] = useState<'details' | 'code'>('details');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);

  const emailReady = isValidEmail(email);
  const passwordReady = password.length >= 8;

  useEffect(() => {
    if (authStatus === 'authenticated') {
      navigate('/account');
    }
  }, [authStatus, navigate]);

  const handleSignIn = async (event: FormEvent) => {
    event.preventDefault();
    setTouched(true);
    if (!emailReady || !passwordReady) return;

    const result = await login(email.trim(), password);
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
    <Container maxWidth="sm" sx={{ py: { xs: 3, sm: 6 }, px: 3, maxWidth: '420px !important' }}>
      <AuthBackButton onClick={handleBack} />

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
              sx={{ width: 140, height: 140, objectFit: 'contain', display: 'block', mx: 'auto', mb: 1 }}
            />
          </StaggerItem>
          <StaggerItem index={1}>
            <Typography variant="h1" sx={{ mb: 1.5, fontSize: { xs: '2rem', sm: '2.5rem' } }}>
              {step === 'details' ? 'Connexion' : 'Confirmez votre e-mail'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {step === 'details'
                ? 'Accédez à votre compte Rawbank'
                : `Entrez le code envoyé à ${email.trim()}.`}
            </Typography>
          </StaggerItem>
        </Box>

        {step === 'details' ? (
          <Box component="form" onSubmit={handleSignIn} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
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
                    ? 'Entrez l’adresse utilisée pour créer le compte'
                    : 'La même adresse que lors de l’inscription'
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
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                error={touched && !passwordReady}
                helperText={touched && !passwordReady ? 'Le mot de passe contient au moins 8 caractères' : ' '}
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
              <Button fullWidth variant="contained" size="large" type="submit" disabled={loading}>
                {loading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </StaggerItem>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleConfirm} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <StaggerItem index={2}>
              <CodeDigits value={code} onChange={setCode} />
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 1.5 }}>
                Ce code confirme que l’adresse e-mail vous appartient
              </Typography>
            </StaggerItem>
            <StaggerItem index={3}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Button fullWidth variant="contained" size="large" type="submit" disabled={loading || code.length < 6}>
                  {loading ? 'Vérification...' : 'Confirmer et se connecter'}
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
          Pas encore de compte?{' '}
          <Link
            component="button"
            type="button"
            variant="body2"
            onClick={() => navigate('/signup')}
            sx={{ color: '#0A0A0A', fontWeight: 600, textDecoration: 'none' }}
          >
            Inscrivez-vous
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}
