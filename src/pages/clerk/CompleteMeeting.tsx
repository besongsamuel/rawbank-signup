import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Alert,
} from '@mui/material';
import { PageTransition } from '../../components/Motion';
import PageShell from '../../components/PageShell';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { logRdvEvent, getAppointmentMetrics } from '../../utils/rdvEvents';

export default function CompleteMeeting() {
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const location = useLocation();
  const startTime = location.state?.startTime as Date;

  const [outcome, setOutcome] = useState<'completed' | 'no_show' | 'rescheduled'>('completed');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const durationMs = startTime ? Date.now() - startTime.getTime() : 0;
  const durationMin = Math.floor(durationMs / 60000);

  const handleComplete = async () => {
    setSaving(true);

    try {
      // Log completion event
      await logRdvEvent({
        eventType: outcome === 'completed' ? 'rdv.completed' : outcome === 'no_show' ? 'rdv.no_show' : 'rdv.rescheduled',
        appointmentId: appointmentId!,
        clientId: 'client-123',
        clerkId: 'clerk-456',
        durationMs,
        metadata: { notes, outcome },
        expectedDurationMs: 30 * 60 * 1000, // 30 min expected
        actualDurationMs: durationMs,
      });

      // Get metrics for logging
      const metrics = await getAppointmentMetrics(appointmentId!);
      console.log('Meeting metrics:', metrics);

      // Navigate back to calendar
      setTimeout(() => {
        navigate('/clerk/calendar');
      }, 500);

    } catch (error) {
      console.error('Failed to complete meeting:', error);
      setSaving(false);
    }
  };

  return (
    <PageTransition>
      <PageShell width="clerk">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <CheckCircleIcon sx={{ fontSize: 64, color: '#34C759', mb: 2 }} />
          <Typography 
            variant="h1" 
            sx={{ 
              mb: 1.5,
              fontSize: { xs: '1.875rem', sm: '2.25rem' },
            }}
          >
            Terminer l'entretien
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Durée: {durationMin} minutes
          </Typography>
        </Box>

        {/* SLA indicator */}
        {durationMin > 30 && (
          <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
            Durée supérieure à la cible (30 min)
          </Alert>
        )}

        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              mb: 2, 
              fontWeight: 600,
              color: '#0A0A0A',
            }}
          >
            Résultat de l'entretien
          </Typography>

          <RadioGroup
            value={outcome}
            onChange={(e) => setOutcome(e.target.value as 'completed' | 'no_show' | 'rescheduled')}
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
              gap: 1.5,
            }}
          >
            <FormControlLabel 
              value="completed" 
              control={<Radio />} 
              label="Compte ouvert avec succès"
              sx={{
                mb: 1.5,
                p: 2,
                borderRadius: 2,
                border: '1.5px solid',
                borderColor: outcome === 'completed' ? '#34C759' : '#E5E5E5',
                bgcolor: outcome === 'completed' ? '#F0FDF4' : 'transparent',
              }}
            />
            <FormControlLabel 
              value="no_show" 
              control={<Radio />} 
              label="Client absent"
              sx={{
                mb: 1.5,
                p: 2,
                borderRadius: 2,
                border: '1.5px solid',
                borderColor: outcome === 'no_show' ? '#FF3B30' : '#E5E5E5',
                bgcolor: outcome === 'no_show' ? '#FFF5F5' : 'transparent',
              }}
            />
            <FormControlLabel 
              value="rescheduled" 
              control={<Radio />} 
              label="Reprogrammé"
              sx={{
                p: 2,
                borderRadius: 2,
                border: '1.5px solid',
                borderColor: outcome === 'rescheduled' ? '#FFCC00' : '#E5E5E5',
                bgcolor: outcome === 'rescheduled' ? '#FFF9E6' : 'transparent',
              }}
            />
          </RadioGroup>
        </Box>

        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            label="Notes (optionnel)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            multiline
            rows={3}
            placeholder="Observations, documents manquants, etc."
          />
        </Box>

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
            onClick={handleComplete}
            disabled={saving}
          >
            {saving ? 'Enregistrement...' : 'Enregistrer et terminer'}
          </Button>
        </Box>

        <Box sx={{ height: { xs: 88, sm: 0 } }} />
      </PageShell>
    </PageTransition>
  );
}
