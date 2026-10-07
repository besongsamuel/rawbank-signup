import { useState } from 'react';
import { Box, Button, Container, InputAdornment, MenuItem, Skeleton, TextField, Typography } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { PageTransition } from '../components/Motion';
import NextSteps from '../components/NextSteps';
import {
  ApplicationDraft,
  CITY_OPTIONS,
  COUNTRY_CODE,
  ID_TYPE_OPTIONS,
  LOCAL_PHONE_LENGTH,
  formatBirthDate,
  formatLocalPhone,
  formatPhoneDisplay,
  idTypeLabel,
  toLocalDigits,
  useApplicationDraft,
} from '../hooks/useApplicationDraft';

function displayValue(value: string) {
  return value.trim() || 'Non renseigné';
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 2,
        py: 1.25,
        borderBottom: '1px solid #F0F0F0',
        '&:last-of-type': { borderBottom: 'none' },
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'right' }}>
        {displayValue(value)}
      </Typography>
    </Box>
  );
}

export default function Account() {
  const { draft, email, emailReady, save } = useApplicationDraft();
  const { signOut } = useAuthenticator((context) => [context.signOut]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<ApplicationDraft>(draft);

  const phoneComplete = form.contact.phone.length === LOCAL_PHONE_LENGTH;
  const canSave = phoneComplete && Boolean(form.contact.address.trim());

  const startEditing = () => {
    setForm(draft);
    setEditing(true);
  };

  const updateIdentity = (field: keyof ApplicationDraft['identity']) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      identity: { ...prev.identity, [field]: event.target.value },
    }));
  };

  const updateContact = (field: 'address' | 'city') => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      contact: { ...prev.contact, [field]: event.target.value },
    }));
  };

  const handleSave = () => {
    if (!canSave) return;
    save(form);
    setEditing(false);
  };

  return (
    <PageTransition>
      <Container maxWidth="sm" sx={{ py: { xs: 3, sm: 6 }, px: 3, maxWidth: '420px !important' }}>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h1"
            sx={{ mb: 1, fontSize: { xs: '1.875rem', sm: '2.25rem' } }}
          >
            Mon dossier
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Suivez votre demande et mettez à jour vos informations
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <NextSteps />
        </Box>

        <Box sx={{ bgcolor: '#FFFFFF', borderRadius: 3, p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Vos informations
            </Typography>
            {!editing && (
              <Button variant="text" onClick={startEditing} sx={{ color: '#0A0A0A', fontWeight: 600 }}>
                Modifier
              </Button>
            )}
          </Box>

          {editing ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 2 }}>
              <TextField fullWidth label="Prénom" value={form.identity.firstName} onChange={updateIdentity('firstName')} />
              <TextField
                fullWidth
                label="Postnom"
                value={form.identity.middleName}
                onChange={updateIdentity('middleName')}
                helperText="Nom de famille maternel"
              />
              <TextField fullWidth label="Nom" value={form.identity.lastName} onChange={updateIdentity('lastName')} />
              <TextField
                fullWidth
                label="Date de naissance"
                type="date"
                value={form.identity.birthDate}
                onChange={updateIdentity('birthDate')}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Numéro de document"
                value={form.identity.idNumber}
                onChange={updateIdentity('idNumber')}
              />
              <TextField
                select
                fullWidth
                label="Type de document"
                value={form.idType}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    idType: event.target.value as ApplicationDraft['idType'],
                  }))
                }
              >
                <MenuItem value="">Non renseigné</MenuItem>
                {ID_TYPE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                type="tel"
                label="Téléphone"
                value={formatLocalPhone(form.contact.phone)}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    contact: { ...prev.contact, phone: toLocalDigits(event.target.value) },
                  }))
                }
                placeholder="XXX XXX XXX"
                helperText="Numéro congolais, sans le 0"
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
              <TextField
                fullWidth
                label="Adresse"
                value={form.contact.address}
                onChange={updateContact('address')}
                placeholder="123 Avenue Kasavubu"
                multiline
                rows={2}
              />
              <TextField select fullWidth label="Ville" value={form.contact.city} onChange={updateContact('city')}>
                {CITY_OPTIONS.map((city) => (
                  <MenuItem key={city} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </TextField>
              <TextField fullWidth label="E-mail" value={email} disabled helperText="L’adresse de votre compte" />
              <Button fullWidth variant="contained" size="large" onClick={handleSave} disabled={!canSave}>
                Enregistrer
              </Button>
              <Button fullWidth variant="text" onClick={() => setEditing(false)} sx={{ color: '#5C5C5C' }}>
                Annuler
              </Button>
            </Box>
          ) : (
            <Box>
              <DetailRow label="Prénom" value={draft.identity.firstName} />
              <DetailRow label="Postnom" value={draft.identity.middleName} />
              <DetailRow label="Nom" value={draft.identity.lastName} />
              <DetailRow label="Date de naissance" value={formatBirthDate(draft.identity.birthDate)} />
              <DetailRow label="Numéro de document" value={draft.identity.idNumber} />
              <DetailRow label="Type de document" value={idTypeLabel(draft.idType)} />
              <DetailRow label="Téléphone" value={formatPhoneDisplay(draft.contact.phone)} />
              <DetailRow label="Adresse" value={draft.contact.address} />
              <DetailRow label="Ville" value={draft.contact.city} />
              {emailReady ? (
                <DetailRow label="E-mail" value={email} />
              ) : (
                <Skeleton variant="text" height={36} />
              )}
            </Box>
          )}
        </Box>

        <Button fullWidth variant="outlined" onClick={() => signOut()}>
          Se déconnecter
        </Button>
      </Container>
    </PageTransition>
  );
}
