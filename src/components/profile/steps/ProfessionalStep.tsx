import { Business, MonetizationOn, Work } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useCallback, useEffect } from "react";
import {
  useRealTimeValidation,
  validators,
} from "../../../hooks/useRealTimeValidation";
import { ProfessionalInfo } from "../../../types/signup";
import InfoTooltip from "../../common/InfoTooltip";

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
  // Define validation rules
  const validationRules = [
    {
      field: "profession" as keyof ProfessionalInfo,
      validator: validators.required("La profession est requise"),
      debounce: 500,
    },
    {
      field: "employer" as keyof ProfessionalInfo,
      validator: validators.required("L'employeur est requis"),
      debounce: 500,
    },
    {
      field: "monthlyIncome" as keyof ProfessionalInfo,
      validator: validators.compose(
        validators.required("Le revenu mensuel est requis"),
        validators.min(0, "Le revenu doit être positif")
      ),
      debounce: 800,
    },
    {
      field: "incomeOrigin" as keyof ProfessionalInfo,
      validator: validators.required("L'origine du revenu est requise"),
      debounce: 500,
    },
  ];

  const { errors, validateAll, handleBlur, handleChange } =
    useRealTimeValidation(professionalInfo, validationRules);

  // Trigger validation on field changes
  useEffect(() => {
    handleChange("profession" as keyof ProfessionalInfo);
  }, [professionalInfo.profession, handleChange]);

  useEffect(() => {
    handleChange("employer" as keyof ProfessionalInfo);
  }, [professionalInfo.employer, handleChange]);

  useEffect(() => {
    handleChange("monthlyIncome" as keyof ProfessionalInfo);
  }, [professionalInfo.monthlyIncome, handleChange]);

  useEffect(() => {
    handleChange("incomeOrigin" as keyof ProfessionalInfo);
  }, [professionalInfo.incomeOrigin, handleChange]);

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      if (validateAll()) {
        onNext();
      }
    },
    [validateAll, onNext]
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
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    flexWrap: "wrap",
                    alignItems: "flex-end",
                  }}
                >
                  <Box sx={{ flex: 1, minWidth: { xs: "100%", sm: 250 } }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        mb: 0.5,
                      }}
                    >
                      <Typography
                        component="label"
                        variant="body2"
                        sx={{ fontSize: "0.875rem" }}
                      >
                        Profession *
                      </Typography>
                      <InfoTooltip title="Votre profession nous aide à mieux comprendre votre profil et à vous proposer des services adaptés à votre situation." />
                    </Box>
                    <TextField
                      fullWidth
                      placeholder="ex: Ingénieur, Médecin, Enseignant"
                      value={professionalInfo.profession || ""}
                      onChange={(e) =>
                        onDataChange({ profession: e.target.value })
                      }
                      onBlur={() =>
                        handleBlur("profession" as keyof ProfessionalInfo)
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
                    />
                  </Box>

                  <Box sx={{ flex: 1, minWidth: { xs: "100%", sm: 250 } }}>
                    <TextField
                      fullWidth
                      label="Employeur *"
                      placeholder="ex: Ministère de la Santé, Entreprise ABC"
                      value={professionalInfo.employer || ""}
                      onChange={(e) =>
                        onDataChange({ employer: e.target.value })
                      }
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
                    />
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    flexWrap: "wrap",
                    alignItems: "flex-end",
                  }}
                >
                  <Box sx={{ flex: 1, minWidth: { xs: "100%", sm: 250 } }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        mb: 0.5,
                      }}
                    >
                      <Typography
                        component="label"
                        variant="body2"
                        sx={{ fontSize: "0.875rem" }}
                      >
                        Revenu mensuel brut *
                      </Typography>
                      <InfoTooltip title="Cette information confidentielle nous permet d'évaluer votre éligibilité pour certains services bancaires et de vous proposer des produits adaptés à votre capacité financière." />
                    </Box>
                    <TextField
                      fullWidth
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
                    />
                  </Box>

                  <Box sx={{ flex: 1, minWidth: { xs: "100%", sm: 250 } }}>
                    <Typography
                      component="label"
                      variant="body2"
                      sx={{ fontSize: "0.875rem", display: "block", mb: 0.5 }}
                    >
                      Origine du revenu *
                    </Typography>
                    <FormControl fullWidth error={!!errors.incomeOrigin}>
                      <Select
                        value={professionalInfo.incomeOrigin || ""}
                        displayEmpty
                        onChange={(e) =>
                          onDataChange({ incomeOrigin: e.target.value })
                        }
                      >
                        <MenuItem value="" disabled>
                          <em>Sélectionnez l'origine</em>
                        </MenuItem>
                        <MenuItem value="salaire">Salaire</MenuItem>
                        <MenuItem value="honoraires">Honoraires</MenuItem>
                        <MenuItem value="pension">Pension</MenuItem>
                        <MenuItem value="commerce">Commerce</MenuItem>
                        <MenuItem value="agriculture">Agriculture</MenuItem>
                        <MenuItem value="elevage">Élevage</MenuItem>
                        <MenuItem value="transport">Transport</MenuItem>
                        <MenuItem value="immobilier">Immobilier</MenuItem>
                        <MenuItem value="investissement">
                          Investissement
                        </MenuItem>
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
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 0.5, ml: 1.75, display: "block" }}
                      >
                        Source principale de vos revenus
                      </Typography>
                    </FormControl>
                  </Box>
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

export default ProfessionalStep;
