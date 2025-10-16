import { ContactPhone, Person, Phone } from "@mui/icons-material";
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
import React, { useCallback, useState } from "react";
import { EmergencyContact } from "../../../types/signup";

const ContentBox = styled(Box)(({ theme }) => ({
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

interface EmergencyContactStepProps {
  emergencyContact: EmergencyContact;
  onDataChange: (data: Partial<EmergencyContact>) => void;
  onNext: () => void;
  onPrev: () => void;
  loading?: boolean;
}

const EmergencyContactStep: React.FC<EmergencyContactStepProps> = ({
  emergencyContact,
  onDataChange,
  onNext,
  onPrev,
  loading = false,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!emergencyContact.contactPerson?.trim()) {
      newErrors.contactPerson = "Le nom du contact d'urgence est requis";
    }
    if (!emergencyContact.contactPhone?.trim()) {
      newErrors.contactPhone =
        "Le numéro de téléphone du contact d'urgence est requis";
    }

    // Basic phone validation
    if (
      emergencyContact.contactPhone &&
      !/^\+?[\d\s\-\(\)]+$/.test(emergencyContact.contactPhone)
    ) {
      newErrors.contactPhone = "Format de numéro de téléphone invalide";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [emergencyContact]);

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
              Contact d'Urgence
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Personne à contacter en cas d'urgence
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={4}>
              {/* Section Illustration */}
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <ContactPhone sx={{ fontSize: 64, color: "#FFCC00", mb: 1 }} />
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
                  label="Nom du contact d'urgence *"
                  placeholder="ex: Marie MUKENDI"
                  value={emergencyContact.contactPerson || ""}
                  onChange={(e) =>
                    onDataChange({ contactPerson: e.target.value })
                  }
                  error={!!errors.contactPerson}
                  helperText={
                    errors.contactPerson ||
                    "Nom complet de la personne à contacter en cas d'urgence"
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Téléphone du contact d'urgence *"
                  placeholder="+243 XXX XXX XXX"
                  value={emergencyContact.contactPhone || ""}
                  onChange={(e) =>
                    onDataChange({ contactPhone: e.target.value })
                  }
                  error={!!errors.contactPhone}
                  helperText={
                    errors.contactPhone ||
                    "Numéro de téléphone de la personne à contacter en cas d'urgence"
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />

                <Box
                  sx={{
                    backgroundColor: "#F5F5F5",
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid #E0E0E0",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    <strong>Note importante:</strong> Le contact d'urgence doit
                    être une personne de confiance qui peut être jointe
                    rapidement en cas de besoin. Cette personne peut être un
                    membre de votre famille, un ami proche, ou toute autre
                    personne de confiance.
                  </Typography>
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

export default EmergencyContactStep;
