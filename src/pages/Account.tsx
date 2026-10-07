import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Skeleton, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { PageTransition } from '../components/Motion';
import AppointmentBookingModal from '../components/modals/AppointmentBookingModal';
import { useAmplifyProfile } from '../hooks/useAmplifyProfile';
import { useAppointments } from '../hooks/useAppointments';
import { agencyById } from '../onboarding/catalog';
import { DOSSIER_STEPS, nextDossierStep } from '../onboarding/steps';

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

  const agency = agencyById(profile?.agencyId);
  const nextStep = nextDossierStep(profile);
  const clientName = [profile?.firstName, profile?.lastName].filter(Boolean).join(' ') || profile?.email || 'Client';

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

  return (
    <PageTransition>
      <Container maxWidth="sm" sx={{ py: { xs: 3, sm: 6 }, px: 3, maxWidth: '480px !important' }}>
        <Typography variant="h1" sx={{ mb: 1, fontSize: { xs: '1.875rem', sm: '2.25rem' } }}>
          Mon dossier
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {profile?.firstName
            ? `${profile.firstName}, voici où en est votre ouverture de compte.`
            : 'Voici ce qui est déjà fait, et ce qu’il reste à compléter.'}
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Skeleton variant="rounded" height={280} />
            <Skeleton variant="rounded" height={160} />
          </Box>
        ) : (
          <>
            <Box sx={{ bgcolor: '#FFFFFF', borderRadius: 3, p: 2.5, mb: 3 }}>
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
                        <Box sx={{ width: 2, flex: 1, minHeight: 24, my: 0.5, bgcolor: done ? '#FFCC00' : '#E5E5E5' }} />
                      )}
                    </Box>
                    <Box sx={{ flex: 1, pb: 2.5, opacity: done || current ? 1 : 0.5 }}>
                      <Typography sx={{ fontWeight: 700 }}>{step.label}</Typography>
                      {summary && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                          {summary}
                        </Typography>
                      )}
                      {current && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                          Étape en cours
                        </Typography>
                      )}
                      {done && (
                        <Button
                          size="small"
                          onClick={() => navigate(step.path, { state: { returnTo: '/account' } })}
                          sx={{ mt: 0.5, px: 0, color: '#0A0A0A', fontWeight: 600 }}
                        >
                          Modifier
                        </Button>
                      )}
                      {current && (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => navigate(step.path)}
                          sx={{ mt: 1 }}
                        >
                          {index === 0 && !DOSSIER_STEPS.some((item) => item.done(profile)) ? 'Commencer' : 'Continuer'}
                        </Button>
                      )}
                    </Box>
                  </Box>
                );
              })}
              {!nextStep && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Toutes les étapes sont complètes. Votre demande est en cours de traitement.
                </Typography>
              )}
            </Box>

            <Box sx={{ bgcolor: '#FFFFFF', borderRadius: 3, p: 2.5, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CalendarTodayIcon sx={{ color: '#0A0A0A' }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Rendez-vous
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {agency
                  ? `À ${agency.name}, ${agency.address}`
                  : 'Choisissez d’abord votre agence pour prendre rendez-vous.'}
              </Typography>

              {appointments.appointments.map((visit) => (
                <Box key={visit.id} sx={{ border: '1px solid #F0F0F0', borderRadius: 2, p: 2, mb: 1.5 }}>
                  <Typography sx={{ fontWeight: 700 }}>{formatVisitDate(visit.scheduledDate)}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {visit.scheduledTime}
                    {visit.checkInCode ? ` · Code ${visit.checkInCode}` : ''}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Button size="small" variant="outlined" onClick={() => openBooking(visit.id)} disabled={appointments.saving}>
                      Reporter
                    </Button>
                    <Button size="small" onClick={() => appointments.cancel(visit.id)} disabled={appointments.saving} sx={{ color: '#5C5C5C' }}>
                      Annuler
                    </Button>
                  </Box>
                </Box>
              ))}

              {!appointments.loading && appointments.appointments.length === 0 && (
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Aucun rendez-vous à venir.
                </Typography>
              )}
              {(appointments.error || error) && (
                <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                  {appointments.error || error}
                </Typography>
              )}
              <Button fullWidth variant="contained" size="large" disabled={!agency || appointments.saving} onClick={() => openBooking()}>
                Prendre rendez-vous
              </Button>
            </Box>
          </>
        )}

        <Button fullWidth variant="outlined" onClick={() => signOut()} sx={{ mt: 1 }}>
          Se déconnecter
        </Button>
      </Container>

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
