import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
} from '@mui/material';
import { PageTransition } from '../../components/Motion';
import PageShell from '../../components/PageShell';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import { logRdvEvent } from '../../utils/rdvEvents';

export default function ClerkMeetingDetail() {
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const [meetingStarted, setMeetingStarted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);

  // Mock data - in real app, fetch from Amplify Data
  const appointment = {
    id: appointmentId,
    clientName: 'Jean Ngandu Mukendi',
    scheduledTime: '09:00',
    status: 'checked_in',
    checkInCode: 'ABC123',
    // AI prep data
    prepData: {
      extracted: {
        firstName: 'Jean',
        middleName: 'Ngandu',
        lastName: 'Mukendi',
        birthDate: '1990-05-20',
        idNumber: 'AB1234567',
      },
      missing: ['phone', 'address'],
      confidence: 0.92,
    },
  };

  const handleStartMeeting = async () => {
    const now = new Date();
    setStartTime(now);
    setMeetingStarted(true);

    // Log start event
    await logRdvEvent({
      eventType: 'rdv.started',
      appointmentId: appointmentId!,
      clientId: 'client-123',
      clerkId: 'clerk-456',
      metadata: { scheduledTime: appointment.scheduledTime },
    });
  };

  const handleCompleteMeeting = () => {
    navigate(`/clerk/meeting/${appointmentId}/complete`, {
      state: { startTime },
    });
  };

  return (
    <PageTransition>
      <PageShell width="clerk">
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h1" 
            sx={{ 
              mb: 1.5,
              fontSize: { xs: '1.875rem', sm: '2.25rem' },
            }}
          >
            Détails du rendez-vous
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {appointment.scheduledTime} · Code: {appointment.checkInCode}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1.2fr 0.8fr' },
            gap: 3,
            alignItems: 'start',
          }}
        >
        {/* Client Info Card */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: '#FFCC00',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PersonIcon sx={{ fontSize: 28, color: '#0A0A0A' }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {appointment.clientName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Nouveau client
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
              Données extraites par IA
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <BadgeIcon sx={{ fontSize: 18, color: '#5C5C5C' }} />
                  <Typography variant="body2" color="text.secondary">
                    Nom complet
                  </Typography>
                </Box>
                <Typography variant="body1">
                  {appointment.prepData.extracted.firstName} {appointment.prepData.extracted.middleName} {appointment.prepData.extracted.lastName}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Date de naissance
                </Typography>
                <Typography variant="body1">
                  {new Date(appointment.prepData.extracted.birthDate).toLocaleDateString('fr-FR')}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Nº document
                </Typography>
                <Typography variant="body1">
                  {appointment.prepData.extracted.idNumber}
                </Typography>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 3, p: 2, bgcolor: '#F0FDF4', borderRadius: 2 }}>
              <CheckCircleIcon sx={{ fontSize: 20, color: '#34C759' }} />
              <Typography variant="body2" sx={{ color: '#34C759', fontWeight: 600 }}>
                Confiance: {(appointment.prepData.confidence * 100).toFixed(0)}%
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Box>
        {/* Missing Fields Card */}
        {appointment.prepData.missing.length > 0 && (
          <Card sx={{ mb: 3, borderLeft: '4px solid #FFCC00' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <WarningIcon sx={{ fontSize: 20, color: '#FFCC00' }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  À compléter pendant l'entretien
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {appointment.prepData.missing.map((field: string) => (
                  <Chip
                    key={field}
                    label={field === 'phone' ? 'Téléphone' : 'Adresse'}
                    size="small"
                    sx={{ bgcolor: '#FFF9E6', color: '#0A0A0A' }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
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
          {!meetingStarted ? (
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleStartMeeting}
            >
              Démarrer l'entretien
            </Button>
          ) : (
            <>
              <Box sx={{ mb: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Entretien en cours depuis
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#34C759' }}>
                  {startTime && Math.floor((Date.now() - startTime.getTime()) / 60000)} min
                </Typography>
              </Box>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleCompleteMeeting}
              >
                Terminer l'entretien
              </Button>
            </>
          )}
        </Box>

        <Box sx={{ height: { xs: 88, sm: 0 } }} />
        </Box>
        </Box>
      </PageShell>
    </PageTransition>
  );
}
