import { ContactPhone, Email, Phone } from "@mui/icons-material";
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
import { useApplicationContext } from "../../../contexts/ApplicationContext";
import { ContactInfo } from "../../../types/signup";

const ContentBox = styled(Box)(({ theme }) => ({
  minHeight: "calc(100vh - 160px)",
  background: "#FFFFFF",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 800,
  width: "100%",
  margin: "0 auto",
  boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
  borderRadius: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    margin: theme.spacing(1),
    borderRadius: theme.spacing(1),
  },
}));

interface ContactStepProps {
  contactInfo: ContactInfo;
  onDataChange: (data: Partial<ContactInfo>) => void;
  onNext: () => void;
  onPrev: () => void;
  loading?: boolean;
}

const ContactStep: React.FC<ContactStepProps> = ({
  contactInfo,
  onDataChange,
  onNext,
  onPrev,
  loading = false,
}) => {
  const { user } = useApplicationContext();
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize email1 from user
  useEffect(() => {
    if (user?.email && !contactInfo.email1) {
      onDataChange({ email1: user.email });
    }
  }, [user, contactInfo.email1, onDataChange]);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!contactInfo.phone1?.trim()) {
      newErrors.phone1 = "Le numéro de téléphone principal est requis";
    }
    if (!contactInfo.email1?.trim()) {
      newErrors.email1 = "L'adresse email principale est requise";
    }

    // Basic phone validation
    if (contactInfo.phone1 && !/^\+?[\d\s\-\(\)]+$/.test(contactInfo.phone1)) {
      newErrors.phone1 = "Format de numéro de téléphone invalide";
    }

    // Basic email validation
    if (
      contactInfo.email1 &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email1)
    ) {
      newErrors.email1 = "Format d'email invalide";
    }

    if (
      contactInfo.email2 &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email2)
    ) {
      newErrors.email2 = "Format d'email secondaire invalide";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [contactInfo]);

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
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Coordonnées
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Vos informations de contact
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={4}>
              {/* Section Illustration */}
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <ContactPhone sx={{ fontSize: 64, color: "#FFCC00", mb: 1 }} />
                <Typography variant="h5" gutterBottom>
                  Coordonnées
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Vos informations de contact
                </Typography>
              </Box>

              <Stack spacing={2}>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <TextField
                    label="Téléphone principal *"
                    placeholder="+243 XXX XXX XXX"
                    value={contactInfo.phone1 || ""}
                    onChange={(e) => onDataChange({ phone1: e.target.value })}
                    error={!!errors.phone1}
                    helperText={
                      errors.phone1 ||
                      "Nous utiliserons ce numéro pour vous envoyer des notifications importantes"
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ flex: 1, minWidth: { xs: "100%", sm: 250 } }}
                  />

                  <TextField
                    label="Téléphone secondaire"
                    placeholder="+243 XXX XXX XXX"
                    value={contactInfo.phone2 || ""}
                    onChange={(e) => onDataChange({ phone2: e.target.value })}
                    helperText="Numéro de téléphone alternatif (optionnel)"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ flex: 1, minWidth: { xs: "100%", sm: 250 } }}
                  />
                </Box>

                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <TextField
                    label="Email principal *"
                    placeholder="exemple@email.com"
                    value={contactInfo.email1 || ""}
                    onChange={(e) => onDataChange({ email1: e.target.value })}
                    error={!!errors.email1}
                    helperText={
                      errors.email1 || "Votre adresse email principale"
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    disabled={!!user?.email} // Disable if comes from user
                    sx={{ flex: 1, minWidth: { xs: "100%", sm: 250 } }}
                  />

                  <TextField
                    label="Email secondaire"
                    placeholder="exemple@email.com"
                    value={contactInfo.email2 || ""}
                    onChange={(e) => onDataChange({ email2: e.target.value })}
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
                    sx={{ flex: 1, minWidth: { xs: "100%", sm: 250 } }}
                  />
                </Box>
              </Stack>
            </Stack>

            {/* Action Buttons */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 4,
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
                  "&:hover": {
                    backgroundColor: "#1a1a1a",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Sauvegarder et continuer"
                )}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </StyledCard>
    </ContentBox>
  );
};

export default ContactStep;
