import { Home } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  FormControlLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useCallback, useState } from "react";
import { HousingInfo } from "../../../types/signup";

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

interface HousingStepProps {
  housingInfo: HousingInfo;
  onDataChange: (data: Partial<HousingInfo>) => void;
  onNext: () => void;
  onPrev: () => void;
  loading?: boolean;
}

const HousingStep: React.FC<HousingStepProps> = ({
  housingInfo,
  onDataChange,
  onNext,
  onPrev,
  loading = false,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!housingInfo.housingStatus) {
      newErrors.housingStatus =
        "Veuillez sélectionner votre statut de logement";
    }
    if (!housingInfo.permanentAddress?.trim()) {
      newErrors.permanentAddress = "L'adresse permanente est requise";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [housingInfo]);

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
              Informations de Logement
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Où habitez-vous actuellement?
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={4}>
              {/* Section Illustration */}
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Home sx={{ fontSize: 64, color: "#FFCC00", mb: 1 }} />
                <Typography variant="h5" gutterBottom>
                  Informations de Logement
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Où habitez-vous actuellement?
                </Typography>
              </Box>

              <Stack spacing={2}>
                <FormControl
                  component="fieldset"
                  error={!!errors.housingStatus}
                >
                  <Typography variant="body2" gutterBottom>
                    Statut de logement *
                  </Typography>
                  <RadioGroup
                    row
                    name="housingStatus"
                    value={housingInfo.housingStatus || ""}
                    onChange={(e) =>
                      onDataChange({
                        housingStatus: e.target.value as
                          | "proprietaire"
                          | "locataire"
                          | "loge_gratuit"
                          | "loge_parents",
                      })
                    }
                  >
                    <FormControlLabel
                      value="proprietaire"
                      control={<Radio />}
                      label="Propriétaire"
                    />
                    <FormControlLabel
                      value="locataire"
                      control={<Radio />}
                      label="Locataire"
                    />
                    <FormControlLabel
                      value="loge_gratuit"
                      control={<Radio />}
                      label="Logé gratuitement"
                    />
                    <FormControlLabel
                      value="loge_parents"
                      control={<Radio />}
                      label="Chez les parents"
                    />
                  </RadioGroup>
                  {errors.housingStatus && (
                    <Typography variant="caption" color="error">
                      {errors.housingStatus}
                    </Typography>
                  )}
                </FormControl>

                <TextField
                  fullWidth
                  label="Adresse permanente *"
                  placeholder="ex: 123 Avenue de la Paix, Kinshasa"
                  value={housingInfo.permanentAddress || ""}
                  onChange={(e) =>
                    onDataChange({ permanentAddress: e.target.value })
                  }
                  error={!!errors.permanentAddress}
                  helperText={
                    errors.permanentAddress ||
                    "Votre adresse de résidence principale"
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Home color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  multiline
                  rows={2}
                />

                <TextField
                  fullWidth
                  label="Adresse de correspondance"
                  placeholder="ex: Boîte postale 1234, Kinshasa"
                  value={housingInfo.mailingAddress || ""}
                  onChange={(e) =>
                    onDataChange({ mailingAddress: e.target.value })
                  }
                  helperText="Si différente de l'adresse permanente"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Home color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  multiline
                  rows={2}
                />
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

export default HousingStep;
