import { CheckCircle, Gavel, Person, Public } from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  FormControl,
  FormLabel,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useCallback, useEffect, useState } from "react";
import { PepInfo } from "../../../types/signup";

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

const InfoCard = styled(Card)(({ theme }) => ({
  backgroundColor: "#F8F9FA",
  border: "1px solid #E9ECEF",
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

interface PepStepProps {
  pepInfo: PepInfo;
  onDataChange: (data: Partial<PepInfo>) => void;
  onNext: () => void;
  onPrev: () => void;
  loading?: boolean;
}

const PepStep: React.FC<PepStepProps> = ({
  pepInfo,
  onDataChange,
  onNext,
  onPrev,
  loading = false,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Set default value to false if not set
  useEffect(() => {
    if (pepInfo.isPep === undefined) {
      onDataChange({ isPep: false });
    }
  }, [pepInfo.isPep, onDataChange]);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    // If user is PEP, additional fields are required
    if (pepInfo.isPep) {
      if (!pepInfo.pepCategory) {
        newErrors.pepCategory = "La catégorie PEP est requise";
      }
      if (!pepInfo.position?.trim()) {
        newErrors.position = "Le poste occupé est requis";
      }
      if (!pepInfo.organization?.trim()) {
        newErrors.organization = "L'organisation est requise";
      }
      if (!pepInfo.country?.trim()) {
        newErrors.country = "Le pays est requis";
      }
      if (!pepInfo.startDate) {
        newErrors.startDate = "La date de début est requise";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [pepInfo]);

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      if (validateForm()) {
        onNext();
      }
    },
    [validateForm, onNext]
  );

  const handlePepChange = (isPep: boolean) => {
    // Reset all PEP-related fields when changing status
    if (!isPep) {
      onDataChange({
        isPep: false,
        pepCategory: undefined,
        position: "",
        organization: "",
        country: "",
        startDate: "",
        endDate: "",
        pepName: "",
        relationshipToPep: "",
      });
    } else {
      onDataChange({ isPep: true });
    }
  };

  const handleCheckboxChange = (field: keyof PepInfo, checked: boolean) => {
    onDataChange({ [field]: checked });
  };

  const handleFieldChange = (field: keyof PepInfo, value: any) => {
    onDataChange({ [field]: value });
  };

  const pepCategories = [
    { value: "government_official", label: "Fonctionnaire gouvernemental" },
    { value: "political_party_leader", label: "Dirigeant de parti politique" },
    { value: "military_officer", label: "Officier militaire" },
    { value: "judicial_official", label: "Fonctionnaire judiciaire" },
    {
      value: "state_enterprise_executive",
      label: "Dirigeant d'entreprise d'État",
    },
    { value: "family_member", label: "Membre de la famille" },
    { value: "close_associate", label: "Proche associé" },
  ];

  return (
    <ContentBox>
      <StyledCard>
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Déclaration PEP
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Conformément aux réglementations sur les Personnes Politiquement
              Exposées
            </Typography>
          </Box>

          {/* Information Card */}
          <InfoCard>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Gavel sx={{ fontSize: 32, color: "#FFCC00", mr: 2 }} />
              <Box>
                <Typography variant="h6" gutterBottom>
                  Qu'est-ce qu'une PEP ?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Une Personne Politiquement Exposée (PEP) est une personne qui
                  occupe ou a occupé une fonction publique importante, ou qui
                  est proche d'une telle personne.
                </Typography>
              </Box>
            </Box>
          </InfoCard>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={4}>
              {/* PEP Status */}
              <Box>
                <Box sx={{ textAlign: "center", mb: 3 }}>
                  <Person sx={{ fontSize: 64, color: "#FFCC00", mb: 1 }} />
                  <Typography variant="h5" gutterBottom>
                    Statut PEP
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Êtes-vous considéré(e) comme une Personne Politiquement
                    Exposée ?
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                  <ButtonGroup
                    size="large"
                    sx={{ width: { xs: "100%", sm: "auto" } }}
                  >
                    <Button
                      variant={
                        pepInfo.isPep === false ? "contained" : "outlined"
                      }
                      onClick={() => handlePepChange(false)}
                      sx={{
                        flex: { xs: 1, sm: "auto" },
                        minWidth: 120,
                        backgroundColor:
                          pepInfo.isPep === false ? "#000000" : "transparent",
                        color: pepInfo.isPep === false ? "#FFCC00" : "#000000",
                        "&:hover": {
                          backgroundColor:
                            pepInfo.isPep === false
                              ? "#1a1a1a"
                              : "rgba(0,0,0,0.04)",
                        },
                      }}
                    >
                      Non
                    </Button>
                    <Button
                      variant={
                        pepInfo.isPep === true ? "contained" : "outlined"
                      }
                      onClick={() => handlePepChange(true)}
                      sx={{
                        flex: { xs: 1, sm: "auto" },
                        minWidth: 120,
                        backgroundColor:
                          pepInfo.isPep === true ? "#000000" : "transparent",
                        color: pepInfo.isPep === true ? "#FFCC00" : "#000000",
                        "&:hover": {
                          backgroundColor:
                            pepInfo.isPep === true
                              ? "#1a1a1a"
                              : "rgba(0,0,0,0.04)",
                        },
                      }}
                    >
                      Oui
                    </Button>
                  </ButtonGroup>
                </Box>

                {/* PEP Details - Only show if user is PEP */}
                {pepInfo.isPep && (
                  <Box
                    sx={{
                      mt: 3,
                      p: 2,
                      backgroundColor: "#FFF9E6",
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="h6" gutterBottom color="warning.main">
                      Détails de votre statut PEP
                    </Typography>
                    <Stack spacing={3}>
                      {/* PEP Category */}
                      <FormControl fullWidth error={!!errors.pepCategory}>
                        <FormLabel>Catégorie PEP *</FormLabel>
                        <Select
                          value={pepInfo.pepCategory || ""}
                          onChange={(e) =>
                            handleFieldChange("pepCategory", e.target.value)
                          }
                          label="Catégorie PEP *"
                          startAdornment={
                            <InputAdornment position="start">
                              <Public color="primary" />
                            </InputAdornment>
                          }
                        >
                          <MenuItem value="">
                            <em>Sélectionnez une catégorie</em>
                          </MenuItem>
                          {pepCategories.map((category) => (
                            <MenuItem
                              key={category.value}
                              value={category.value}
                            >
                              {category.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.pepCategory && (
                          <Typography
                            variant="caption"
                            color="error"
                            sx={{ mt: 1 }}
                          >
                            {errors.pepCategory}
                          </Typography>
                        )}
                      </FormControl>

                      {/* Position */}
                      <TextField
                        fullWidth
                        label="Poste occupé *"
                        placeholder="ex: Ministre des Finances"
                        value={pepInfo.position || ""}
                        onChange={(e) =>
                          handleFieldChange("position", e.target.value)
                        }
                        error={!!errors.position}
                        helperText={
                          errors.position ||
                          "Le poste ou la fonction que vous occupez actuellement"
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />

                      {/* Organization */}
                      <TextField
                        fullWidth
                        label="Organisation *"
                        placeholder="ex: Ministère des Finances"
                        value={pepInfo.organization || ""}
                        onChange={(e) =>
                          handleFieldChange("organization", e.target.value)
                        }
                        error={!!errors.organization}
                        helperText={
                          errors.organization ||
                          "L'organisation ou l'institution où vous travaillez"
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Public color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />

                      {/* Country */}
                      <TextField
                        fullWidth
                        label="Pays *"
                        placeholder="ex: République Démocratique du Congo"
                        value={pepInfo.country || ""}
                        onChange={(e) =>
                          handleFieldChange("country", e.target.value)
                        }
                        error={!!errors.country}
                        helperText={
                          errors.country ||
                          "Le pays où vous occupez cette fonction"
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Public color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />

                      {/* Date Range */}
                      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                        <TextField
                          sx={{ flex: 1, minWidth: { xs: "100%", sm: 200 } }}
                          label="Date de début *"
                          type="date"
                          value={pepInfo.startDate || ""}
                          onChange={(e) =>
                            handleFieldChange("startDate", e.target.value)
                          }
                          InputLabelProps={{ shrink: true }}
                          error={!!errors.startDate}
                          helperText={
                            errors.startDate || "Date de début de la fonction"
                          }
                        />
                        <TextField
                          sx={{ flex: 1, minWidth: { xs: "100%", sm: 200 } }}
                          label="Date de fin"
                          type="date"
                          value={pepInfo.endDate || ""}
                          onChange={(e) =>
                            handleFieldChange("endDate", e.target.value)
                          }
                          InputLabelProps={{ shrink: true }}
                          helperText="Laissez vide si vous occupez toujours cette fonction"
                        />
                      </Box>

                      {/* Relationship fields for family members/associates */}
                      {(pepInfo.pepCategory === "family_member" ||
                        pepInfo.pepCategory === "close_associate") && (
                        <Stack spacing={2}>
                          <TextField
                            fullWidth
                            label="Nom de la personne PEP"
                            placeholder="ex: Jean Mukendi"
                            value={pepInfo.pepName || ""}
                            onChange={(e) =>
                              handleFieldChange("pepName", e.target.value)
                            }
                            helperText="Nom de la personne politiquement exposée"
                          />
                          <TextField
                            fullWidth
                            label="Relation avec cette personne"
                            placeholder="ex: Époux, Fils, Associé d'affaires"
                            value={pepInfo.relationshipToPep || ""}
                            onChange={(e) =>
                              handleFieldChange(
                                "relationshipToPep",
                                e.target.value
                              )
                            }
                            helperText="Votre relation avec cette personne"
                          />
                        </Stack>
                      )}
                    </Stack>
                  </Box>
                )}
              </Box>

              {/* Declaration - Only show if user is PEP */}
              {pepInfo.isPep && (
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

export default PepStep;
