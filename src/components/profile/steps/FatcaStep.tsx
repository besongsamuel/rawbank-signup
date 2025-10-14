import { CheckCircle, Gavel, Person, Public } from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useCallback, useEffect, useState } from "react";
import { FatcaInfo } from "../../../types/signup";

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

const InfoCard = styled(Card)(({ theme }) => ({
  backgroundColor: "#F8F9FA",
  border: "1px solid #E9ECEF",
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

interface FatcaStepProps {
  fatcaInfo: FatcaInfo;
  onDataChange: (data: Partial<FatcaInfo>) => void;
  onNext: () => void;
  onPrev: () => void;
  loading?: boolean;
}

const FatcaStep: React.FC<FatcaStepProps> = ({
  fatcaInfo,
  onDataChange,
  onNext,
  onPrev,
  loading = false,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Set default value to false if not set
  useEffect(() => {
    if (fatcaInfo.isUSPerson === undefined) {
      onDataChange({ isUSPerson: false });
    }
  }, [fatcaInfo.isUSPerson, onDataChange]);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    // If user is a US person, TIN is required
    if (fatcaInfo.isUSPerson && !fatcaInfo.usTin?.trim()) {
      newErrors.usTin =
        "Le numéro d'identification fiscale américain est requis pour les personnes américaines";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [fatcaInfo]);

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      if (validateForm()) {
        onNext();
      }
    },
    [validateForm, onNext]
  );

  const handleUSPersonChange = (isUSPerson: boolean) => {
    // Reset all US-related fields when changing status
    if (!isUSPerson) {
      onDataChange({
        isUSPerson: false,
        usCitizenship: false,
        usBirthPlace: false,
        usResidence: false,
        usAddress: false,
        usPhone: false,
        usPowerOfAttorney: false,
        usTin: "",
      });
    } else {
      onDataChange({ isUSPerson: true });
    }
  };

  const handleCheckboxChange = (field: keyof FatcaInfo, checked: boolean) => {
    onDataChange({ [field]: checked });
  };

  const handleTinChange = (value: string) => {
    // Format TIN (remove spaces, dashes, etc.)
    const formattedTin = value.replace(/[^0-9]/g, "");
    onDataChange({ usTin: formattedTin });
  };

  return (
    <ContentBox>
      <StyledCard>
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Déclaration FATCA
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Conformément à la loi américaine sur la conformité fiscale des
              comptes étrangers
            </Typography>
          </Box>

          {/* Information Card */}
          <InfoCard>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Gavel sx={{ fontSize: 32, color: "#FFCC00", mr: 2 }} />
              <Box>
                <Typography variant="h6" gutterBottom>
                  Qu'est-ce que FATCA ?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  La loi FATCA (Foreign Account Tax Compliance Act) exige que
                  les institutions financières identifient et déclarent les
                  comptes détenus par des personnes américaines.
                </Typography>
              </Box>
            </Box>
          </InfoCard>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={4}>
              {/* US Person Status */}
              <Box>
                <Box sx={{ textAlign: "center", mb: 3 }}>
                  <Person sx={{ fontSize: 64, color: "#FFCC00", mb: 1 }} />
                  <Typography variant="h5" gutterBottom>
                    Statut de personne américaine
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Êtes-vous considéré(e) comme une personne américaine aux
                    fins fiscales ?
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                  <ButtonGroup
                    size="large"
                    sx={{ width: { xs: "100%", sm: "auto" } }}
                  >
                    <Button
                      variant={
                        fatcaInfo.isUSPerson === false
                          ? "contained"
                          : "outlined"
                      }
                      onClick={() => handleUSPersonChange(false)}
                      sx={{
                        flex: { xs: 1, sm: "auto" },
                        minWidth: 120,
                        backgroundColor:
                          fatcaInfo.isUSPerson === false
                            ? "#000000"
                            : "transparent",
                        color:
                          fatcaInfo.isUSPerson === false
                            ? "#FFCC00"
                            : "#000000",
                        "&:hover": {
                          backgroundColor:
                            fatcaInfo.isUSPerson === false
                              ? "#1a1a1a"
                              : "rgba(0,0,0,0.04)",
                        },
                      }}
                    >
                      Non
                    </Button>
                    <Button
                      variant={
                        fatcaInfo.isUSPerson === true ? "contained" : "outlined"
                      }
                      onClick={() => handleUSPersonChange(true)}
                      sx={{
                        flex: { xs: 1, sm: "auto" },
                        minWidth: 120,
                        backgroundColor:
                          fatcaInfo.isUSPerson === true
                            ? "#000000"
                            : "transparent",
                        color:
                          fatcaInfo.isUSPerson === true ? "#FFCC00" : "#000000",
                        "&:hover": {
                          backgroundColor:
                            fatcaInfo.isUSPerson === true
                              ? "#1a1a1a"
                              : "rgba(0,0,0,0.04)",
                        },
                      }}
                    >
                      Oui
                    </Button>
                  </ButtonGroup>
                </Box>

                {/* US Person Details - Only show if user is US person */}
                {fatcaInfo.isUSPerson && (
                  <Box
                    sx={{
                      mt: 3,
                      p: 2,
                      backgroundColor: "#FFF9E6",
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="h6" gutterBottom color="warning.main">
                      Détails de votre statut américain
                    </Typography>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={fatcaInfo.usCitizenship}
                            onChange={(e) =>
                              handleCheckboxChange(
                                "usCitizenship",
                                e.target.checked
                              )
                            }
                            color="primary"
                          />
                        }
                        label="Je suis citoyen(ne) américain(e)"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={fatcaInfo.usBirthPlace}
                            onChange={(e) =>
                              handleCheckboxChange(
                                "usBirthPlace",
                                e.target.checked
                              )
                            }
                            color="primary"
                          />
                        }
                        label="Je suis né(e) aux États-Unis"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={fatcaInfo.usResidence}
                            onChange={(e) =>
                              handleCheckboxChange(
                                "usResidence",
                                e.target.checked
                              )
                            }
                            color="primary"
                          />
                        }
                        label="J'ai résidé aux États-Unis pendant plus de 183 jours au cours des 3 dernières années"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={fatcaInfo.usAddress}
                            onChange={(e) =>
                              handleCheckboxChange(
                                "usAddress",
                                e.target.checked
                              )
                            }
                            color="primary"
                          />
                        }
                        label="J'ai une adresse aux États-Unis"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={fatcaInfo.usPhone}
                            onChange={(e) =>
                              handleCheckboxChange("usPhone", e.target.checked)
                            }
                            color="primary"
                          />
                        }
                        label="J'ai un numéro de téléphone américain"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={fatcaInfo.usPowerOfAttorney}
                            onChange={(e) =>
                              handleCheckboxChange(
                                "usPowerOfAttorney",
                                e.target.checked
                              )
                            }
                            color="primary"
                          />
                        }
                        label="J'ai donné une procuration à une personne américaine"
                      />
                    </FormGroup>

                    {/* US TIN Field */}
                    <TextField
                      fullWidth
                      label="Numéro d'identification fiscale américain (TIN) *"
                      placeholder="123456789"
                      value={fatcaInfo.usTin || ""}
                      onChange={(e) => handleTinChange(e.target.value)}
                      error={!!errors.usTin}
                      helperText={
                        errors.usTin ||
                        "Votre numéro de sécurité sociale (SSN) ou numéro d'identification fiscale (ITIN)"
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Public color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mt: 2 }}
                    />
                  </Box>
                )}
              </Box>

              {/* Declaration - Only show if user is US person */}
              {fatcaInfo.isUSPerson && (
                <Box>
                  <Box sx={{ textAlign: "center", mb: 3 }}>
                    <CheckCircle
                      sx={{ fontSize: 64, color: "#FFCC00", mb: 1 }}
                    />
                    <Typography variant="h5" gutterBottom>
                      Déclaration
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Je certifie que les informations fournies sont exactes et
                      complètes
                    </Typography>
                  </Box>

                  <InfoCard>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      <strong>Déclaration :</strong> Je déclare sous peine de
                      parjure que les informations fournies dans ce formulaire
                      sont exactes et complètes. Je comprends que toute fausse
                      déclaration peut entraîner des sanctions pénales et
                      civiles.
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      <strong>Date de déclaration :</strong>{" "}
                      {new Date().toLocaleDateString("fr-FR")}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Signature électronique :</strong> En soumettant ce
                      formulaire, je confirme que j'ai lu et accepté cette
                      déclaration.
                    </Typography>
                  </InfoCard>
                </Box>
              )}

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
                  {loading ? "Enregistrement..." : "Sauvegarder et continuer"}
                </Button>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </StyledCard>
    </ContentBox>
  );
};

export default FatcaStep;
