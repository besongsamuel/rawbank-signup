import { ContactEmergency, Email, Phone } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { ContactInfo, EmergencyContact } from "../../../types/signup";

const ContentBox = styled(Box)(({ theme }) => ({
  minHeight: "calc(100vh - 160px)",
  background: "#FFFFFF",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 900,
  width: "100%",
  margin: "0 auto",
  boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
  borderRadius: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    margin: theme.spacing(1),
    borderRadius: theme.spacing(1),
  },
}));

interface ContactAndEmergencyStepProps {
  contactInfo: ContactInfo;
  emergencyContact: EmergencyContact;
  onContactChange: (data: Partial<ContactInfo>) => void;
  onEmergencyChange: (data: Partial<EmergencyContact>) => void;
  onNext: () => void;
  onPrev: () => void;
  loading?: boolean;
}

const ContactAndEmergencyStep: React.FC<ContactAndEmergencyStepProps> = ({
  contactInfo,
  emergencyContact,
  onContactChange,
  onEmergencyChange,
  onNext,
  onPrev,
  loading = false,
}) => {
  const { user } = useAuth();
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-fill email and phone from user auth
  useEffect(() => {
    const updates: Partial<ContactInfo> = {};

    // Prefill email if available and not already set
    if (user?.email && !contactInfo.email1) {
      updates.email1 = user.email;
    }

    // Prefill phone if available and not already set
    if (user?.phone && !contactInfo.phone1) {
      updates.phone1 = user.phone;
    }

    // Apply updates if any
    if (Object.keys(updates).length > 0) {
      onContactChange(updates);
    }
  }, [
    user?.email,
    user?.phone,
    contactInfo.email1,
    contactInfo.phone1,
    onContactChange,
  ]);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    // Contact info validation - at least one (phone or email) is required
    const hasPhone = contactInfo.phone1?.trim();
    const hasEmail = contactInfo.email1?.trim();

    if (!hasPhone && !hasEmail) {
      newErrors.phone1 =
        "Au moins un numéro de téléphone ou un email est requis";
      newErrors.email1 =
        "Au moins un numéro de téléphone ou un email est requis";
    } else {
      // Validate phone format if provided
      if (hasPhone && !/^\+?[0-9\s\-()]{8,}$/.test(contactInfo.phone1)) {
        newErrors.phone1 = "Format de numéro invalide";
      }

      // Validate email format if provided
      if (hasEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email1)) {
        newErrors.email1 = "Format d'email invalide";
      }
    }

    if (
      contactInfo.phone2 &&
      !/^\+?[0-9\s\-()]{8,}$/.test(contactInfo.phone2)
    ) {
      newErrors.phone2 = "Format de numéro invalide";
    }

    if (
      contactInfo.email2 &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email2)
    ) {
      newErrors.email2 = "Format d'email invalide";
    }

    // Emergency contact validation
    if (!emergencyContact.contactPerson?.trim()) {
      newErrors.contactPerson = "Le nom du contact d'urgence est requis";
    }

    if (!emergencyContact.contactPhone?.trim()) {
      newErrors.contactPhone = "Le numéro du contact d'urgence est requis";
    } else if (!/^\+?[0-9\s\-()]{8,}$/.test(emergencyContact.contactPhone)) {
      newErrors.contactPhone = "Format de numéro invalide";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [contactInfo, emergencyContact]);

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      if (validateForm()) {
        onNext();
      }
    },
    [validateForm, onNext]
  );

  return (
    <ContentBox>
      <StyledCard>
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={4}>
              {/* Header */}
              <Box sx={{ textAlign: "center", mb: 2 }}>
                <Typography variant="h4" gutterBottom>
                  Coordonnées et Contact d'Urgence
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Vos informations de contact et personne à prévenir en cas
                  d'urgence
                </Typography>
              </Box>

              {/* Section 1: Contact Information */}
              <Box>
                <Box sx={{ textAlign: "center", mb: 3 }}>
                  <Phone sx={{ fontSize: 64, color: "#FFCC00", mb: 1 }} />
                  <Typography variant="h5" gutterBottom>
                    Coordonnées
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Au moins un téléphone ou un email est requis
                  </Typography>
                </Box>

                <Stack spacing={2}>
                  {/* Phone Numbers */}
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <TextField
                      label="Téléphone principal"
                      placeholder="+243 XXX XXX XXX"
                      value={contactInfo.phone1 || ""}
                      onChange={(e) =>
                        onContactChange({ phone1: e.target.value })
                      }
                      error={!!errors.phone1}
                      helperText={
                        errors.phone1 ||
                        "Numéro pour vous joindre (requis si pas d'email)"
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ flex: 1, minWidth: { xs: "100%", sm: 200 } }}
                    />
                    <TextField
                      label="Téléphone secondaire"
                      placeholder="+243 XXX XXX XXX"
                      value={contactInfo.phone2 || ""}
                      onChange={(e) =>
                        onContactChange({ phone2: e.target.value })
                      }
                      error={!!errors.phone2}
                      helperText={
                        errors.phone2 || "Numéro alternatif (optionnel)"
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ flex: 1, minWidth: { xs: "100%", sm: 200 } }}
                    />
                  </Box>

                  {/* Email Addresses */}
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <TextField
                      label="Email principal"
                      placeholder="exemple@email.com"
                      value={contactInfo.email1 || ""}
                      onChange={(e) =>
                        onContactChange({ email1: e.target.value })
                      }
                      error={!!errors.email1}
                      helperText={
                        errors.email1 ||
                        "Email de contact (requis si pas de téléphone)"
                      }
                      disabled={!!user?.email}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ flex: 1, minWidth: { xs: "100%", sm: 200 } }}
                    />
                    <TextField
                      label="Email secondaire"
                      placeholder="autre@email.com"
                      value={contactInfo.email2 || ""}
                      onChange={(e) =>
                        onContactChange({ email2: e.target.value })
                      }
                      error={!!errors.email2}
                      helperText={
                        errors.email2 || "Adresse email alternative (optionnel)"
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ flex: 1, minWidth: { xs: "100%", sm: 200 } }}
                    />
                  </Box>
                </Stack>
              </Box>

              {/* Section 2: Emergency Contact */}
              <Box>
                <Box sx={{ textAlign: "center", mb: 3 }}>
                  <ContactEmergency
                    sx={{ fontSize: 64, color: "#FFCC00", mb: 1 }}
                  />
                  <Typography variant="h5" gutterBottom>
                    Contact d'Urgence
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Personne à contacter en cas d'urgence
                  </Typography>
                </Box>

                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Nom complet du contact *"
                    placeholder="ex: Marie KALALA"
                    value={emergencyContact.contactPerson || ""}
                    onChange={(e) =>
                      onEmergencyChange({ contactPerson: e.target.value })
                    }
                    error={!!errors.contactPerson}
                    helperText={
                      errors.contactPerson ||
                      "Nom de la personne à contacter en cas d'urgence (membre de famille, ami proche)"
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ContactEmergency color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Numéro de téléphone *"
                    placeholder="+243 XXX XXX XXX"
                    value={emergencyContact.contactPhone || ""}
                    onChange={(e) =>
                      onEmergencyChange({ contactPhone: e.target.value })
                    }
                    error={!!errors.contactPhone}
                    helperText={
                      errors.contactPhone ||
                      "Numéro de téléphone du contact d'urgence (format: +243 XXX XXX XXX)"
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>
              </Box>

              {/* Navigation Buttons */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={onPrev}
                  disabled={loading}
                  sx={{ flex: 1 }}
                >
                  Précédent
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    flex: 1,
                    backgroundColor: "#000000",
                    color: "#FFCC00",
                    "&:hover": { backgroundColor: "#1a1a1a" },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Sauvegarder et continuer"
                  )}
                </Button>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </StyledCard>
    </ContentBox>
  );
};

export default ContactAndEmergencyStep;
