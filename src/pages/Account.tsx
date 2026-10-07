import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Skeleton, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import type { SvgIconComponent } from '@mui/icons-material';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { PageTransition } from '../components/Motion';
import PageShell from '../components/PageShell';
import AppointmentBookingModal from '../components/modals/AppointmentBookingModal';
import { useAmplifyProfile } from '../hooks/useAmplifyProfile';
import { useAppointments } from '../hooks/useAppointments';
import { agencyById } from '../onboarding/catalog';
import { DOSSIER_STEPS, nextDossierStep } from '../onboarding/steps';

const STEP_HINTS: Record<string, string> = {
  account: 'Le type de compte et l’agence où vous serez reçu.',
  identity: 'Une photo nette de votre pièce d’identité.',
  family: 'Votre situation familiale et l’adresse où vous habitez.',
  contacts: 'Un numéro de téléphone et une personne à prévenir.',
  professional: 'Votre métier et d’où viennent vos revenus.',
  fatca: 'Une question simple sur un lien fiscal avec les États-Unis.',
  pep: 'Une question sur une fonction publique, pour vous ou un proche.',
  card: 'La carte que vous retirerez à l’agence.',
};

const STEP_ICONS: Record<string, SvgIconComponent> = {
  account: AccountBalanceOutlinedIcon,
  identity: BadgeOutlinedIcon,
  family: HomeOutlinedIcon,
  contacts: PhoneOutlinedIcon,
  professional: WorkOutlineIcon,
  fatca: PublicOutlinedIcon,
  pep: GavelOutlinedIcon,
  card: CreditCardOutlinedIcon,
};

function formatVisitDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
}

export default function Account() {
  const navigate = useNavigate();
  const { signOut } = useAuthenticator((context) => [context.signOut]);
  const { profile, loading, error } = useAmplifyProfile();
  const appointments = useAppointments(profile?.userId);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [cancelId, setCancelId] = useState<string | null>(null);

  const agency = agencyById(profile?.agencyId);
  const nextStep = nextDossierStep(profile);
  const doneCount = DOSSIER_STEPS.filter((step) => step.done(profile)).length;
  const progress = Math.round((doneCount / DOSSIER_STEPS.length) * 100);
  const clientName = [profile?.firstName, profile?.lastName].filter(Boolean).join(' ') || profile?.email || 'Client';
  const started = doneCount > 0;

  const openBooking = (appointmentId?: string) => {
    setRescheduleId(appointmentId ?? null);
    setBookingOpen(true);
  };

  const handleConfirm = async (visit: { date: Date; time: string }) => {
    if (!profile?.agencyId) return;
    try {
      if (rescheduleId) {
        await appointments.reschedule(rescheduleId, visit.date, visit.time);
        return;
      }
      await appointments.book({
        date: visit.date,
        time: visit.time,
        agencyId: profile.agencyId,
        clientName,
      });
    } catch {
      // The appointments hook keeps the message on the page.
    }
  };

  const handleCancel = async (id: string) => {
    if (cancelId !== id) {
      setCancelId(id);
      return;
    }
    setCancelId(null);
    await appointments.cancel(id);
  };

  return (
    <PageTransition>
      <PageShell width="wide">
        <Box
          sx={{
            display: 'flex',
            alignItems: { sm: 'flex-start' },
            justifyContent: 'space-between',
            gap: 2,
            mb: 1,
          }}
        >
          <Typography variant="h1" sx={{ fontSize: { xs: '1.875rem', sm: '2.25rem' } }}>
            Mon dossier
          </Typography>
          <Button variant="text" onClick={() => signOut()} sx={{ flexShrink: 0, minHeight: 40, px: 1.5 }}>
            Se déconnecter
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 560 }}>
          {profile?.firstName
            ? `${profile.firstName}, voici où en est votre ouverture de compte.`
            : 'Voici ce qui est déjà fait, et ce qu’il reste à compléter.'}
        </Typography>

        {loading ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '1.2fr 0.8fr' },
              gap: 3,
            }}
          >
            <Box>
              <Skeleton variant="rounded" height={16} sx={{ mb: 3 }} />
              <Skeleton variant="rounded" height={160} sx={{ mb: 2 }} />
              <Skeleton variant="rounded" height={320} />
            </Box>
            <Skeleton variant="rounded" height={280} />
          </Box>
        ) : (
          <>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {doneCount} {doneCount === 1 ? 'étape' : 'étapes'} sur {DOSSIER_STEPS.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {progress}%
                </Typography>
              </Box>
              <Box sx={{ height: 8, bgcolor: '#E8E8E8', borderRadius: 99, overflow: 'hidden' }}>
                <Box
                  sx={{
                    width: `${progress}%`,
                    height: '100%',
                    bgcolor: '#FFCC00',
                    borderRadius: 99,
                    transition: 'width 300ms ease',
                  }}
                />
              </Box>
            </Box>

            {(appointments.error || error) && (
              <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                {appointments.error || error}
              </Typography>
            )}

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: '1.2fr 0.8fr' },
                gap: 3,
                alignItems: 'start',
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box
                  sx={{
                    bgcolor: '#FFFFFF',
                    borderRadius: 3,
                    p: { xs: 2.5, sm: 3 },
                    borderTop: '4px solid #FFCC00',
                  }}
                >
                  {nextStep ? (
                    <>
                      <Typography variant="body2" sx={{ color: '#8A6A00', fontWeight: 700, mb: 1 }}>
                        À faire maintenant
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 2 }}>
                        <StepIcon id={nextStep.id} active />
                        <Box>
                          <Typography variant="h2" sx={{ fontSize: '1.35rem', mb: 0.5 }}>
                            {nextStep.label}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {STEP_HINTS[nextStep.id]}
                          </Typography>
                        </Box>
                      </Box>
                      <Button variant="contained" size="large" onClick={() => navigate(nextStep.path)}>
                        {started ? 'Continuer' : 'Commencer'}
                      </Button>
                    </>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: '50%',
                          bgcolor: '#F0FDF4',
                          color: '#34C759',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <CheckIcon />
                      </Box>
                      <Box>
                        <Typography variant="h2" sx={{ fontSize: '1.35rem', mb: 0.5 }}>
                          Dossier complet
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Toutes les étapes sont terminées. Votre demande est en cours de traitement. Vous pouvez prendre rendez-vous pour retirer votre carte.
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>

                <Box sx={{ bgcolor: '#FFFFFF', borderRadius: 3, p: { xs: 2.5, sm: 3 } }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    Toutes les étapes
                  </Typography>
                  {DOSSIER_STEPS.map((step, index) => {
                    const done = step.done(profile);
                    const current = nextStep?.id === step.id;
                    const summary = done ? step.summary(profile) : '';
                    return (
                      <Box key={step.id} sx={{ display: 'flex', gap: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              bgcolor: done ? '#FFCC00' : current ? '#0A0A0A' : '#F5F5F5',
                              color: done ? '#0A0A0A' : current ? '#FFCC00' : '#8A8A8A',
                              border: done || current ? 'none' : '1px solid #E5E5E5',
                            }}
                          >
                            {done ? <CheckIcon sx={{ fontSize: 20 }} /> : index + 1}
                          </Box>
                          {index < DOSSIER_STEPS.length - 1 && (
                            <Box sx={{ width: 2, flex: 1, minHeight: 28, my: 0.5, bgcolor: done ? '#FFCC00' : '#E5E5E5' }} />
                          )}
                        </Box>
                        <Box sx={{ flex: 1, pb: 2.5, opacity: done || current ? 1 : 0.72 }}>
                          <Typography sx={{ fontWeight: 700 }}>{step.label}</Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                            {summary || STEP_HINTS[step.id]}
                          </Typography>
                          {current && (
                            <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 600 }}>
                              Étape en cours
                            </Typography>
                          )}
                          {done && (
                            <Button
                              size="small"
                              onClick={() => navigate(step.path, { state: { returnTo: '/account' } })}
                              sx={{ mt: 0.5, px: 0, minHeight: 32, color: '#0A0A0A', fontWeight: 600 }}
                            >
                              Modifier
                            </Button>
                          )}
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>

              <Box sx={{ bgcolor: '#FFFFFF', borderRadius: 3, p: { xs: 2.5, sm: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      bgcolor: '#FFF9E6',
                      color: '#0A0A0A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CalendarTodayIcon />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Rendez-vous
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Passez à l’agence pour signer vos documents et retirer votre carte.
                </Typography>

                {agency ? (
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, color: '#0A0A0A' }}>
                    <LocationOnOutlinedIcon sx={{ fontSize: 20, mt: 0.15 }} />
                    <Box>
                      <Typography sx={{ fontWeight: 700 }}>{agency.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {agency.address}
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Choisissez d’abord votre agence. Le rendez-vous se prend ensuite.
                  </Typography>
                )}

                {appointments.loading ? (
                  <Skeleton variant="rounded" height={96} sx={{ mb: 2 }} />
                ) : (
                  appointments.appointments.map((visit) => (
                    <Box key={visit.id} sx={{ border: '1px solid #F0F0F0', borderRadius: 2, p: 2, mb: 1.5 }}>
                      <Typography sx={{ fontWeight: 700 }}>{formatVisitDate(visit.scheduledDate)}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: visit.checkInCode ? 1.5 : 0 }}>
                        {visit.scheduledTime}
                      </Typography>
                      {visit.checkInCode && (
                        <Box
                          sx={{
                            bgcolor: '#FFF9E6',
                            borderRadius: 2,
                            px: 1.5,
                            py: 1,
                            mb: 1.5,
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Montrez ce code à l’agence
                          </Typography>
                          <Typography sx={{ fontWeight: 700, letterSpacing: '0.12em', fontSize: '1.25rem' }}>
                            {visit.checkInCode}
                          </Typography>
                        </Box>
                      )}
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Button size="small" variant="outlined" onClick={() => openBooking(visit.id)} disabled={appointments.saving} sx={{ minHeight: 40 }}>
                          Reporter
                        </Button>
                        <Button
                          size="small"
                          onClick={() => handleCancel(visit.id)}
                          disabled={appointments.saving}
                          sx={{ minHeight: 40, color: cancelId === visit.id ? '#FF3B30' : '#5C5C5C' }}
                        >
                          {cancelId === visit.id ? 'Confirmer l’annulation' : 'Annuler'}
                        </Button>
                      </Box>
                    </Box>
                  ))
                )}

                {!appointments.loading && appointments.appointments.length === 0 && (
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Aucun rendez-vous à venir.
                  </Typography>
                )}

                {agency ? (
                  <Button fullWidth variant="contained" size="large" disabled={appointments.saving} onClick={() => openBooking()}>
                    Prendre rendez-vous
                  </Button>
                ) : (
                  <Button fullWidth variant="contained" size="large" onClick={() => navigate('/onboarding/account')}>
                    Choisir mon agence
                  </Button>
                )}
              </Box>
            </Box>
          </>
        )}
      </PageShell>

      {agency && (
        <AppointmentBookingModal
          open={bookingOpen}
          onClose={() => {
            setBookingOpen(false);
            setRescheduleId(null);
          }}
          onConfirm={handleConfirm}
          agencyName={agency.name}
          agencyAddress={agency.address}
        />
      )}
    </PageTransition>
  );
}

function StepIcon({ id, active }: { id: string; active?: boolean }) {
  const Icon = STEP_ICONS[id] ?? AccountBalanceOutlinedIcon;
  return (
    <Box
      sx={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        bgcolor: active ? '#0A0A0A' : '#F5F5F5',
        color: active ? '#FFCC00' : '#0A0A0A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Icon />
    </Box>
  );
}
