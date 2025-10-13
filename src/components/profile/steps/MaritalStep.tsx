import { Home } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useCallback, useState } from "react";
import { MaritalInfo } from "../../../types/signup";

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

interface MaritalStepProps {
  maritalInfo: MaritalInfo;
  onDataChange: (data: Partial<MaritalInfo>) => void;
  onNext: () => void;
  onPrev: () => void;
  loading?: boolean;
}

const MaritalStep: React.FC<MaritalStepProps> = ({
  maritalInfo,
  onDataChange,
  onNext,
  onPrev,
  loading = false,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!maritalInfo.maritalStatus) {
      newErrors.maritalStatus =
        "Veuillez sélectionner votre situation familiale";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [maritalInfo]);

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
              Situation Familiale
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Informations sur votre situation matrimoniale
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={4}>
              {/* Section Illustration */}
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Home sx={{ fontSize: 64, color: "#FFCC00", mb: 1 }} />
                <Typography variant="h5" gutterBottom>
                  Situation Familiale
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Informations sur votre situation matrimoniale
                </Typography>
              </Box>

              <Stack spacing={2}>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <FormControl
                    sx={{ flex: 1, minWidth: { xs: "100%", sm: 250 } }}
                    error={!!errors.maritalStatus}
                  >
                    <InputLabel>Situation familiale *</InputLabel>
                    <Select
                      value={maritalInfo.maritalStatus || ""}
                      label="Situation familiale *"
                      onChange={(e) =>
                        onDataChange({
                          maritalStatus: e.target.value as
                            | "celibataire"
                            | "marie"
                            | "divorce"
                            | "veuf",
                        })
                      }
                    >
                      <MenuItem value="celibataire">Célibataire</MenuItem>
                      <MenuItem value="marie">Marié(e)</MenuItem>
                      <MenuItem value="divorce">Divorcé(e)</MenuItem>
                      <MenuItem value="veuf">Veuf(ve)</MenuItem>
                    </Select>
                    {errors.maritalStatus && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mt: 0.5, ml: 1.75 }}
                      >
                        {errors.maritalStatus}
                      </Typography>
                    )}
                  </FormControl>

                  {maritalInfo.maritalStatus === "marie" && (
                    <FormControl
                      sx={{ flex: 1, minWidth: { xs: "100%", sm: 250 } }}
                    >
                      <InputLabel>Régime matrimonial</InputLabel>
                      <Select
                        value={maritalInfo.maritalRegime || ""}
                        label="Régime matrimonial"
                        onChange={(e) =>
                          onDataChange({
                            maritalRegime: e.target.value as
                              | "separation_biens"
                              | "communaute_universelle"
                              | "communaute_reduite",
                          })
                        }
                      >
                        <MenuItem value="separation_biens">
                          Séparation des biens
                        </MenuItem>
                        <MenuItem value="communaute_universelle">
                          Communauté universelle
                        </MenuItem>
                        <MenuItem value="communaute_reduite">
                          Com. réduite aux acquêts
                        </MenuItem>
                      </Select>
                    </FormControl>
                  )}

                  <TextField
                    label="Nombre d'enfants"
                    type="number"
                    value={maritalInfo.numberOfChildren || 0}
                    onChange={(e) =>
                      onDataChange({
                        numberOfChildren: parseInt(e.target.value) || 0,
                      })
                    }
                    InputProps={{ inputProps: { min: 0 } }}
                    helperText="Nombre d'enfants à charge"
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

export default MaritalStep;
