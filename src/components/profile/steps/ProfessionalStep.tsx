import { Business, MonetizationOn, Work } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useCallback, useState } from "react";
import { ProfessionalInfo } from "../../../types/signup";

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

interface ProfessionalStepProps {
  professionalInfo: ProfessionalInfo;
  onDataChange: (data: Partial<ProfessionalInfo>) => void;
  onNext: () => void;
  onPrev: () => void;
  loading?: boolean;
}

const ProfessionalStep: React.FC<ProfessionalStepProps> = ({
  professionalInfo,
  onDataChange,
  onNext,
  onPrev,
  loading = false,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!professionalInfo.profession?.trim()) {
      newErrors.profession = "La profession est requise";
    }
    if (!professionalInfo.employer?.trim()) {
      newErrors.employer = "L'employeur est requis";
    }
    if (
      !professionalInfo.monthlyIncome ||
      professionalInfo.monthlyIncome <= 0
    ) {
      newErrors.monthlyIncome = "Le revenu mensuel est requis";
    }
    if (!professionalInfo.incomeOrigin?.trim()) {
      newErrors.incomeOrigin = "L'origine du revenu est requise";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [professionalInfo]);

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
              Informations Professionnelles
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Vos informations professionnelles et financières
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={4}>
              {/* Section Illustration */}
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Work sx={{ fontSize: 64, color: "#FFCC00", mb: 1 }} />
                <Typography variant="h5" gutterBottom>
                  Informations Professionnelles
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Vos informations professionnelles et financières
                </Typography>
              </Box>

              <Stack spacing={2}>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <TextField
                    label="Profession *"
                    placeholder="ex: Ingénieur, Médecin, Enseignant"
                    value={professionalInfo.profession || ""}
                    onChange={(e) =>
                      onDataChange({ profession: e.target.value })
                    }
                    error={!!errors.profession}
                    helperText={
                      errors.profession || "Votre profession ou métier"
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Work color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ flex: 1, minWidth: { xs: "100%", sm: 250 } }}
                  />

                  <TextField
                    label="Employeur *"
                    placeholder="ex: Ministère de la Santé, Entreprise ABC"
                    value={professionalInfo.employer || ""}
                    onChange={(e) => onDataChange({ employer: e.target.value })}
                    error={!!errors.employer}
                    helperText={
                      errors.employer ||
                      "Nom de votre employeur ou organisation"
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Business color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ flex: 1, minWidth: { xs: "100%", sm: 250 } }}
                  />
                </Box>

                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <TextField
                    label="Revenu mensuel brut *"
                    type="number"
                    placeholder="500000"
                    value={professionalInfo.monthlyIncome || ""}
                    onChange={(e) =>
                      onDataChange({
                        monthlyIncome: parseFloat(e.target.value) || 0,
                      })
                    }
                    error={!!errors.monthlyIncome}
                    helperText={
                      errors.monthlyIncome ||
                      "Votre revenu mensuel en francs congolais"
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MonetizationOn color="primary" />
                        </InputAdornment>
                      ),
                      inputProps: { min: 0 },
                    }}
                    sx={{ flex: 1, minWidth: { xs: "100%", sm: 250 } }}
                  />

                  <FormControl
                    sx={{ flex: 1, minWidth: { xs: "100%", sm: 250 } }}
                    error={!!errors.incomeOrigin}
                  >
                    <InputLabel>Origine du revenu *</InputLabel>
                    <Select
                      value={professionalInfo.incomeOrigin || ""}
                      label="Origine du revenu *"
                      onChange={(e) =>
                        onDataChange({ incomeOrigin: e.target.value })
                      }
                    >
                      <MenuItem value="salaire">Salaire</MenuItem>
                      <MenuItem value="honoraires">Honoraires</MenuItem>
                      <MenuItem value="pension">Pension</MenuItem>
                      <MenuItem value="commerce">Commerce</MenuItem>
                      <MenuItem value="agriculture">Agriculture</MenuItem>
                      <MenuItem value="elevage">Élevage</MenuItem>
                      <MenuItem value="transport">Transport</MenuItem>
                      <MenuItem value="immobilier">Immobilier</MenuItem>
                      <MenuItem value="investissement">Investissement</MenuItem>
                      <MenuItem value="autre">Autre</MenuItem>
                    </Select>
                    {errors.incomeOrigin && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mt: 0.5, ml: 1.75 }}
                      >
                        {errors.incomeOrigin}
                      </Typography>
                    )}
                  </FormControl>
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
                  "Continuer"
                )}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </StyledCard>
    </ContentBox>
  );
};

export default ProfessionalStep;
