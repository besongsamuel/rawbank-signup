import { FamilyRestroom, Home } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
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
import { HousingInfo, MaritalInfo } from "../../../types/signup";

const ContentBox = styled(Box)(({ theme }) => ({
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

interface MaritalAndHousingStepProps {
  maritalInfo: MaritalInfo;
  housingInfo: HousingInfo;
  onMaritalChange: (data: Partial<MaritalInfo>) => void;
  onHousingChange: (data: Partial<HousingInfo>) => void;
  onNext: () => void;
  onPrev: () => void;
  loading?: boolean;
}

const MaritalAndHousingStep: React.FC<MaritalAndHousingStepProps> = ({
  maritalInfo,
  housingInfo,
  onMaritalChange,
  onHousingChange,
  onNext,
  onPrev,
  loading = false,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showMailingAddress, setShowMailingAddress] = useState<boolean>(
    Boolean(housingInfo.mailingAddress)
  );

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!maritalInfo.maritalStatus) {
      newErrors.maritalStatus =
        "Veuillez sélectionner votre situation matrimoniale";
    }

    if (!housingInfo.housingStatus) {
      newErrors.housingStatus =
        "Veuillez sélectionner votre statut de logement";
    }

    if (!housingInfo.permanentAddress?.trim()) {
      newErrors.permanentAddress = "L'adresse permanente est requise";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [maritalInfo, housingInfo]);

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
                  Situation Matrimoniale et Logement
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Informations sur votre statut familial et résidentiel
                </Typography>
              </Box>

              {/* Section 1: Marital Status */}
              <Box>
                <Box sx={{ textAlign: "center", mb: 3 }}>
                  <FamilyRestroom
                    sx={{ fontSize: 64, color: "#FFCC00", mb: 1 }}
                  />
                  <Typography variant="h5" gutterBottom>
                    Situation Matrimoniale
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Informations sur votre statut familial
                  </Typography>
                </Box>

                <Stack spacing={2}>
                  <FormControl fullWidth error={!!errors.maritalStatus}>
                    <InputLabel>Situation matrimoniale *</InputLabel>
                    <Select
                      value={maritalInfo.maritalStatus || ""}
                      onChange={(e) =>
                        onMaritalChange({ maritalStatus: e.target.value })
                      }
                      label="Situation matrimoniale *"
                      startAdornment={
                        <InputAdornment position="start">
                          <FamilyRestroom color="primary" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="celibataire">Célibataire</MenuItem>
                      <MenuItem value="marie">Marié(e)</MenuItem>
                      <MenuItem value="divorce">Divorcé(e)</MenuItem>
                      <MenuItem value="veuf">Veuf/Veuve</MenuItem>
                    </Select>
                    {errors.maritalStatus ? (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mt: 0.5, ml: 1.75 }}
                      >
                        {errors.maritalStatus}
                      </Typography>
                    ) : (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 0.5, ml: 1.75 }}
                      >
                        Votre statut matrimonial actuel
                      </Typography>
                    )}
                  </FormControl>

                  {maritalInfo.maritalStatus === "marie" && (
                    <FormControl fullWidth>
                      <InputLabel>Régime matrimonial</InputLabel>
                      <Select
                        value={maritalInfo.maritalRegime || ""}
                        onChange={(e) =>
                          onMaritalChange({ maritalRegime: e.target.value })
                        }
                        label="Régime matrimonial"
                      >
                        <MenuItem value="separation_biens">
                          Séparation des biens
                        </MenuItem>
                        <MenuItem value="communaute_universelle">
                          Communauté universelle
                        </MenuItem>
                        <MenuItem value="communaute_reduite">
                          Communauté réduite aux acquêts
                        </MenuItem>
                      </Select>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 0.5, ml: 1.75 }}
                      >
                        Le régime qui s'applique à votre mariage (optionnel)
                      </Typography>
                    </FormControl>
                  )}

                  <TextField
                    fullWidth
                    type="number"
                    label="Nombre d'enfants à charge"
                    value={maritalInfo.numberOfChildren ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "") {
                        onMaritalChange({ numberOfChildren: 0 });
                      } else {
                        const numValue = parseInt(value, 10);
                        if (!isNaN(numValue) && numValue >= 0) {
                          onMaritalChange({ numberOfChildren: numValue });
                        }
                      }
                    }}
                    inputProps={{ min: 0 }}
                    helperText="Indiquez le nombre d'enfants dont vous avez la charge (0 si aucun)"
                  />
                </Stack>
              </Box>

              {/* Section 2: Housing Information */}
              <Box>
                <Box sx={{ textAlign: "center", mb: 3 }}>
                  <Home sx={{ fontSize: 64, color: "#FFCC00", mb: 1 }} />
                  <Typography variant="h5" gutterBottom>
                    Informations de Logement
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Détails sur votre résidence actuelle
                  </Typography>
                </Box>

                <Stack spacing={2}>
                  <FormControl fullWidth error={!!errors.housingStatus}>
                    <InputLabel>Statut de logement *</InputLabel>
                    <Select
                      value={housingInfo.housingStatus || ""}
                      onChange={(e) =>
                        onHousingChange({ housingStatus: e.target.value })
                      }
                      label="Statut de logement *"
                      startAdornment={
                        <InputAdornment position="start">
                          <Home color="primary" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="proprietaire">Propriétaire</MenuItem>
                      <MenuItem value="locataire">Locataire</MenuItem>
                      <MenuItem value="loge_gratuitement">
                        Logé(e) gratuitement
                      </MenuItem>
                      <MenuItem value="colocation">Colocation</MenuItem>
                    </Select>
                    {errors.housingStatus ? (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mt: 0.5, ml: 1.75 }}
                      >
                        {errors.housingStatus}
                      </Typography>
                    ) : (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 0.5, ml: 1.75 }}
                      >
                        Votre situation de logement actuelle
                      </Typography>
                    )}
                  </FormControl>

                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Adresse permanente *"
                    placeholder="ex: 123 Avenue de la Gombe, Kinshasa"
                    value={housingInfo.permanentAddress || ""}
                    onChange={(e) =>
                      onHousingChange({ permanentAddress: e.target.value })
                    }
                    error={!!errors.permanentAddress}
                    helperText={
                      errors.permanentAddress ||
                      "Votre adresse de résidence principale (numéro, rue, commune, ville)"
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Home color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  {/* Checkbox for mailing address */}
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={showMailingAddress}
                        onChange={(e) => {
                          setShowMailingAddress(e.target.checked);
                          // Clear mailing address if unchecked
                          if (!e.target.checked) {
                            onHousingChange({ mailingAddress: "" });
                          }
                        }}
                        color="primary"
                      />
                    }
                    label="J'ai une adresse postale différente de mon adresse permanente"
                    sx={{ mt: 2, mb: 1 }}
                  />

                  {/* Mailing Address Field - Only show when checkbox is checked */}
                  {showMailingAddress && (
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Adresse postale"
                      placeholder="ex: BP 123, Kinshasa"
                      value={housingInfo.mailingAddress || ""}
                      onChange={(e) =>
                        onHousingChange({ mailingAddress: e.target.value })
                      }
                      helperText="Votre adresse pour recevoir du courrier (si différente de l'adresse permanente)"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Home color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
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

export default MaritalAndHousingStep;
