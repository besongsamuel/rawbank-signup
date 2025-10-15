import { CalendarToday, LocationOn, Schedule } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { fr } from "date-fns/locale";
import React, { useState } from "react";

interface AppointmentBookingModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (appointment: {
    date: Date;
    time: string;
    agency: string;
  }) => void;
  agencyName: string;
  agencyAddress: string;
}

const AppointmentBookingModal: React.FC<AppointmentBookingModalProps> = ({
  open,
  onClose,
  onConfirm,
  agencyName,
  agencyAddress,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Available time slots (9 AM to 5 PM, every 30 minutes)
  const timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
  ];

  // Filter out past dates
  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      onConfirm({
        date: selectedDate,
        time: selectedTime,
        agency: agencyName,
      });
      onClose();
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: "600px",
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <CalendarToday sx={{ fontSize: 48, color: "#FFCC00", mb: 1 }} />
          <Typography variant="h4" gutterBottom>
            Réserver un Rendez-vous
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sélectionnez la date et l'heure de votre rendez-vous
          </Typography>
        </Box>

        {/* Agency Information */}
        <Box
          sx={{
            p: 2,
            backgroundColor: "rgba(255, 204, 0, 0.1)",
            borderRadius: 2,
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <LocationOn sx={{ color: "#FFCC00" }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {agencyName}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {agencyAddress}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", gap: 4, minHeight: "400px" }}>
          {/* Calendar Section */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <CalendarToday sx={{ color: "#FFCC00" }} />
              Sélectionner la Date
            </Typography>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={fr}
            >
              <DateCalendar
                value={selectedDate}
                onChange={(newDate) => setSelectedDate(newDate)}
                shouldDisableDate={isDateDisabled}
                sx={{
                  "& .MuiPickersDay-root": {
                    "&.Mui-selected": {
                      backgroundColor: "#FFCC00",
                      color: "#000000",
                      "&:hover": {
                        backgroundColor: "#FFD700",
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Box>

          <Divider orientation="vertical" flexItem />

          {/* Time Selection Section */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Schedule sx={{ color: "#FFCC00" }} />
              Sélectionner l'Heure
            </Typography>

            {selectedDate ? (
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {formatDate(selectedDate)}
                </Typography>

                <FormControl fullWidth>
                  <InputLabel>Heure du rendez-vous</InputLabel>
                  <Select
                    value={selectedTime}
                    label="Heure du rendez-vous"
                    onChange={(e) => setSelectedTime(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#FFCC00",
                        },
                      },
                    }}
                  >
                    {timeSlots.map((time) => (
                      <MenuItem key={time} value={time}>
                        {time}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Selected Appointment Summary */}
                {selectedTime && (
                  <Box
                    sx={{
                      mt: 3,
                      p: 2,
                      backgroundColor: "rgba(0, 0, 0, 0.05)",
                      borderRadius: 2,
                      border: "1px solid rgba(255, 204, 0, 0.3)",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, mb: 1 }}
                    >
                      Récapitulatif du Rendez-vous
                    </Typography>
                    <Stack spacing={1}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <CalendarToday
                          sx={{ fontSize: 16, color: "#FFCC00" }}
                        />
                        <Typography variant="body2">
                          {formatDate(selectedDate)}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Schedule sx={{ fontSize: 16, color: "#FFCC00" }} />
                        <Typography variant="body2">{selectedTime}</Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <LocationOn sx={{ fontSize: 16, color: "#FFCC00" }} />
                        <Typography variant="body2">{agencyName}</Typography>
                      </Box>
                    </Stack>
                  </Box>
                )}
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "200px",
                  color: "text.secondary",
                }}
              >
                <Typography variant="body1">
                  Veuillez d'abord sélectionner une date
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: "#E5E5E5",
            color: "#000000",
            "&:hover": {
              borderColor: "#000000",
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          Annuler
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={!selectedDate || !selectedTime}
          sx={{
            backgroundColor: "#000000",
            color: "#FFCC00",
            "&:hover": {
              backgroundColor: "#1a1a1a",
            },
            "&:disabled": {
              backgroundColor: "#E5E5E5",
              color: "#9E9E9E",
            },
            flex: 1,
          }}
        >
          Confirmer le Rendez-vous
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppointmentBookingModal;
