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
import React, { useEffect, useState } from "react";

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
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 600);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

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
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, sm: 3 },
          minHeight: { xs: "100vh", sm: "600px" },
          maxHeight: { xs: "100vh", sm: "90vh" },
        },
      }}
    >
      <DialogTitle sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <CalendarToday
            sx={{ fontSize: { xs: 40, sm: 48 }, color: "#FFCC00", mb: 1 }}
          />
          <Typography
            variant="h4"
            sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}
            gutterBottom
          >
            Réserver un Rendez-vous
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
          >
            Sélectionnez la date et l'heure de votre rendez-vous
          </Typography>
        </Box>

        {/* Agency Information */}
        <Box
          sx={{
            p: { xs: 1.5, sm: 2 },
            backgroundColor: "rgba(255, 204, 0, 0.1)",
            borderRadius: 2,
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <LocationOn
              sx={{ color: "#FFCC00", fontSize: { xs: 20, sm: 24 } }}
            />
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, fontSize: { xs: "1rem", sm: "1.25rem" } }}
            >
              {agencyName}
            </Typography>
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
          >
            {agencyAddress}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 3, md: 4 },
            minHeight: { xs: "auto", sm: "400px" },
          }}
        >
          {/* Calendar Section */}
          <Box sx={{ flex: 1, minWidth: { xs: "100%", md: "300px" } }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontSize: { xs: "1.1rem", sm: "1.25rem" },
                mb: 2,
              }}
            >
              <CalendarToday
                sx={{ color: "#FFCC00", fontSize: { xs: 18, sm: 20 } }}
              />
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
                    fontSize: { xs: "0.8rem", sm: "0.875rem" },
                    width: { xs: 32, sm: 36 },
                    height: { xs: 32, sm: 36 },
                    "&.Mui-selected": {
                      backgroundColor: "#FFCC00",
                      color: "#000000",
                      "&:hover": {
                        backgroundColor: "#FFD700",
                      },
                    },
                  },
                  "& .MuiPickersCalendarHeader-root": {
                    paddingLeft: { xs: 1, sm: 2 },
                    paddingRight: { xs: 1, sm: 2 },
                  },
                  "& .MuiDayCalendar-weekContainer": {
                    margin: 0,
                  },
                }}
              />
            </LocalizationProvider>
          </Box>

          <Divider
            orientation="vertical"
            flexItem
            sx={{ display: { xs: "none", md: "block" } }}
          />

          {/* Time Selection Section */}
          <Box sx={{ flex: 1, minWidth: { xs: "100%", md: "300px" } }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontSize: { xs: "1.1rem", sm: "1.25rem" },
                mb: 2,
              }}
            >
              <Schedule
                sx={{ color: "#FFCC00", fontSize: { xs: 18, sm: 20 } }}
              />
              Sélectionner l'Heure
            </Typography>

            {selectedDate ? (
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2, fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
                >
                  {formatDate(selectedDate)}
                </Typography>

                <FormControl fullWidth>
                  <InputLabel sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>
                    Heure du rendez-vous
                  </InputLabel>
                  <Select
                    value={selectedTime}
                    label="Heure du rendez-vous"
                    onChange={(e) => setSelectedTime(e.target.value)}
                    sx={{
                      fontSize: { xs: "0.9rem", sm: "1rem" },
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

      <DialogActions
        sx={{
          p: { xs: 2, sm: 3 },
          gap: 2,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          fullWidth={isMobile}
          sx={{
            borderColor: "#E5E5E5",
            color: "#000000",
            fontSize: { xs: "0.9rem", sm: "1rem" },
            py: { xs: 1.5, sm: 1 },
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
          fullWidth={isMobile}
          sx={{
            backgroundColor: "#000000",
            color: "#FFCC00",
            fontSize: { xs: "0.9rem", sm: "1rem" },
            py: { xs: 1.5, sm: 1 },
            "&:hover": {
              backgroundColor: "#1a1a1a",
            },
            "&:disabled": {
              backgroundColor: "#E5E5E5",
              color: "#9E9E9E",
            },
            flex: { xs: "none", sm: 1 },
          }}
        >
          Confirmer le Rendez-vous
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppointmentBookingModal;
