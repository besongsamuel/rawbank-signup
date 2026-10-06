import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Button,
} from '@mui/material';
import { PageTransition } from '../../components/Motion';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';

interface Appointment {
  id: string;
  clientName: string;
  scheduledTime: string;
  status: 'scheduled' | 'checked_in' | 'in_progress' | 'completed' | 'no_show';
  checkInCode?: string;
}

export default function ClerkCalendar() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      clientName: 'Jean Ngandu Mukendi',
      scheduledTime: '09:00',
      status: 'scheduled',
      checkInCode: 'ABC123',
    },
    {
      id: '2',
      clientName: 'Marie Tshala Kabongo',
      scheduledTime: '10:30',
      status: 'checked_in',
    },
    {
      id: '3',
      clientName: 'Joseph Ilunga Mwamba',
      scheduledTime: '14:00',
      status: 'scheduled',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'checked_in':
        return '#FFCC00';
      case 'in_progress':
        return '#007AFF';
      case 'completed':
        return '#34C759';
      case 'no_show':
        return '#FF3B30';
      default:
        return '#5C5C5C';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Prévu';
      case 'checked_in':
        return 'Arrivé';
      case 'in_progress':
        return 'En cours';
      case 'completed':
        return 'Terminé';
      case 'no_show':
        return 'Absent';
      default:
        return status;
    }
  };

  return (
    <PageTransition>
      <Container maxWidth="md" sx={{ py: { xs: 3, sm: 6 }, px: 3 }}>
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h1" 
            sx={{ 
              mb: 1.5,
              fontSize: { xs: '2rem', sm: '2.5rem' },
            }}
          >
            Rendez-vous du jour
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#5C5C5C' }}>
            <CalendarTodayIcon sx={{ fontSize: 20 }} />
            <Typography variant="body2">
              {new Date().toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {appointments.map((appointment) => (
            <Card 
              key={appointment.id}
              sx={{
                borderLeft: `4px solid ${getStatusColor(appointment.status)}`,
              }}
            >
              <CardActionArea
                onClick={() => navigate(`/clerk/meeting/${appointment.id}`)}
                sx={{ p: 0 }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <AccessTimeIcon sx={{ color: '#5C5C5C' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {appointment.scheduledTime}
                      </Typography>
                    </Box>
                    <Chip 
                      label={getStatusLabel(appointment.status)}
                      size="small"
                      sx={{
                        bgcolor: `${getStatusColor(appointment.status)}20`,
                        color: getStatusColor(appointment.status),
                        fontWeight: 600,
                        borderRadius: 2,
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <PersonIcon sx={{ color: '#5C5C5C', fontSize: 20 }} />
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {appointment.clientName}
                    </Typography>
                  </Box>

                  {appointment.checkInCode && (
                    <Typography variant="body2" color="text.secondary">
                      Code: {appointment.checkInCode}
                    </Typography>
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>

        {appointments.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CalendarTodayIcon sx={{ fontSize: 64, color: '#E5E5E5', mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              Aucun rendez-vous pour aujourd'hui
            </Typography>
          </Box>
        )}
      </Container>
    </PageTransition>
  );
}
