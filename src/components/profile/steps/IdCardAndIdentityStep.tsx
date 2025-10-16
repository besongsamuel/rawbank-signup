import {
  AutoAwesome,
  CakeOutlined,
  Delete,
  LocationOn,
  Person,
  Public,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { City, Country, State } from "country-state-city";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useApplicationContext } from "../../../contexts/ApplicationContext";
import { useIdExtraction } from "../../../hooks/useIdExtraction";
import { supabase } from "../../../lib/supabase";
import { IdCardInfo, PersonalInfo } from "../../../types/signup";
import InfoTooltip from "../../common/InfoTooltip";
import ExtractionConfirmationModal from "../../modals/ExtractionConfirmationModal";
import ExtractionLoadingModal from "../../modals/ExtractionLoadingModal";

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

const UploadArea = styled(Box)(({ theme }) => ({
  border: "2px dashed #FFCC00",
  borderRadius: theme.spacing(2),
  padding: theme.spacing(4),
  textAlign: "center",
  cursor: "pointer",
  transition: "all 0.3s ease",
  backgroundColor: "rgba(255, 204, 0, 0.05)",
  "&:hover": {
    borderColor: "#000000",
    backgroundColor: "rgba(255, 204, 0, 0.1)",
    transform: "scale(1.01)",
  },
}));

const PreviewImage = styled("img")({
  maxWidth: "100%",
  maxHeight: "400px",
  objectFit: "contain",
  borderRadius: "8px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
});

interface IdCardAndIdentityStepProps {
  idCardData: IdCardInfo;
  personalInfo: PersonalInfo;
  onIdCardChange: (data: Partial<IdCardInfo>) => void;
  onPersonalInfoChange: (data: Partial<PersonalInfo>) => void;
  onNext: () => void;
  onPrev: () => void;
  loading?: boolean;
}

const IdCardAndIdentityStep: React.FC<IdCardAndIdentityStepProps> = ({
  idCardData,
  personalInfo,
  onIdCardChange,
  onPersonalInfoChange,
  onNext,
  onPrev,
  loading = false,
}) => {
  const { user } = useApplicationContext();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [existingFiles, setExistingFiles] = useState<any[]>([]);
  const [selectedExistingFile, setSelectedExistingFile] = useState<any | null>(
    null
  );
  const [loadingExistingFiles, setLoadingExistingFiles] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const hasLoadedData = useRef(false);

  // Country/State/City data
  const [selectedCountry, setSelectedCountry] = useState("CD");
  const [selectedState, setSelectedState] = useState("");
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  const { isUploading, isExtracting, extractedData, uploadAndExtract } =
    useIdExtraction();

  // Fetch existing uploaded files and personal data
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id || hasLoadedData.current) return;

      hasLoadedData.current = true;
      setIsLoadingData(true);

      try {
        // Fetch personal data
        const { data: personalData, error: personalError } = await supabase
          .from("personal_data")
          .select("*")
          .eq("id", user.id)
          .single();

        if (!personalError && personalData) {
          // Prefill ID card data
          if (personalData.id_type || personalData.id_number) {
            onIdCardChange({
              type: personalData.id_type,
              number: personalData.id_number,
              issueDate: personalData.id_issue_date,
              expiryDate: personalData.id_expiry_date,
            });
          }

          // Prefill personal info
          const existingData: Partial<PersonalInfo> = {
            civility: personalData.civility,
            firstName: personalData.first_name,
            middleName: personalData.middle_name,
            lastName: personalData.last_name,
            birthDate: personalData.birth_date,
            birthPlace: personalData.birth_place,
            provinceOfOrigin: personalData.province_of_origin,
            nationality: personalData.nationality,
            countryOfResidence: personalData.country_of_residence,
          };

          const hasData = Object.values(existingData).some(
            (value) => value && value !== ""
          );
          if (hasData) {
            onPersonalInfoChange(existingData);
          }
        }

        // Fetch existing files if ID card type is selected
        if (idCardData.type) {
          const { data: files, error: filesError } = await supabase.storage
            .from("ids")
            .list(`${user.id}/${idCardData.type}`, {
              limit: 1,
              sortBy: { column: "created_at", order: "desc" },
            });

          if (!filesError && files && files.length > 0) {
            const latestFile = files[0];
            const { data: urlData } = await supabase.storage
              .from("ids")
              .createSignedUrl(
                `${user.id}/${idCardData.type}/${latestFile.name}`,
                3600
              );

            if (urlData?.signedUrl) {
              const existingFile = {
                ...latestFile,
                signedUrl: urlData.signedUrl,
                type: idCardData.type,
              };
              setExistingFiles([existingFile]);
              setSelectedExistingFile(existingFile);
              setPreviewUrl(urlData.signedUrl);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [user?.id, idCardData.type]);

  // Load states when country changes
  useEffect(() => {
    if (selectedCountry) {
      const countryStates = State.getStatesOfCountry(selectedCountry);
      setStates(countryStates);

      if (personalInfo.provinceOfOrigin && countryStates.length > 0) {
        const existingState = countryStates.find(
          (s) => s.name === personalInfo.provinceOfOrigin
        );
        if (existingState) {
          setSelectedState(existingState.isoCode);
        }
      }
    }
  }, [selectedCountry, personalInfo.provinceOfOrigin]);

  // Load cities when state changes
  useEffect(() => {
    if (selectedCountry && selectedState) {
      const stateCities = City.getCitiesOfState(selectedCountry, selectedState);
      setCities(stateCities);
    } else {
      setCities([]);
    }
  }, [selectedCountry, selectedState]);

  // Set default nationality
  useEffect(() => {
    if (!personalInfo.nationality) {
      const drcCountry = Country.getCountryByCode("CD");
      if (drcCountry) {
        onPersonalInfoChange({
          nationality: drcCountry.name,
          countryOfResidence: drcCountry.name,
        });
      }
    }
  }, [personalInfo.nationality, onPersonalInfoChange]);

  const handleFileUpload = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadError("Veuillez sélectionner une image valide");
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setUploadError("La taille du fichier ne doit pas dépasser 10MB");
      return;
    }

    setUploadedFile(file);
    setSelectedExistingFile(null);
    setUploadError(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleExtractData = async () => {
    if ((!uploadedFile && !selectedExistingFile) || !idCardData.type) {
      setUploadError("Veuillez sélectionner un type de document et une image.");
      return;
    }

    try {
      if (uploadedFile) {
        const extracted = await uploadAndExtract(uploadedFile, idCardData.type);
        setShowConfirmation(true);
      } else if (selectedExistingFile) {
        console.log("Extraction from existing file is optional");
      }
    } catch (error) {
      console.error("Extraction error:", error);
      setUploadError(
        error instanceof Error
          ? error.message
          : "Erreur lors de l'extraction des données"
      );
    }
  };

  // Reload personal data from database
  const reloadPersonalData = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data: personalData, error } = await supabase
        .from("personal_data")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!error && personalData) {
        // Update ID card data
        if (personalData.id_type || personalData.id_number) {
          onIdCardChange({
            type: personalData.id_type,
            number: personalData.id_number,
            issueDate: personalData.id_issue_date,
            expiryDate: personalData.id_expiry_date,
          });
        }

        // Update personal info with extracted data
        const updatedData: Partial<PersonalInfo> = {
          civility: personalData.civility,
          firstName: personalData.first_name,
          middleName: personalData.middle_name,
          lastName: personalData.last_name,
          birthDate: personalData.birth_date,
          birthPlace: personalData.birth_place,
          provinceOfOrigin: personalData.province_of_origin,
          nationality: personalData.nationality,
          countryOfResidence: personalData.country_of_residence,
        };

        const hasData = Object.values(updatedData).some(
          (value) => value && value !== ""
        );
        if (hasData) {
          onPersonalInfoChange(updatedData);
        }

        console.log("Personal data reloaded after extraction");
      }
    } catch (error) {
      console.error("Error reloading personal data:", error);
    }
  }, [user?.id, onIdCardChange, onPersonalInfoChange]);

  const handleConfirmData = async () => {
    if (extractedData) {
      onIdCardChange({
        number: extractedData.idNumber,
        issueDate: extractedData.issueDate || "",
        expiryDate: extractedData.expiryDate || "",
      });
    }
    setShowConfirmation(false);

    // Reload personal data to get all extracted information
    await reloadPersonalData();

    // Stay on current page for any revisions - do not automatically move to next step
    // User can manually proceed when ready
  };

  const handleEditData = async () => {
    if (extractedData) {
      onIdCardChange({
        number: extractedData.idNumber,
        issueDate: extractedData.issueDate || "",
        expiryDate: extractedData.expiryDate || "",
      });
    }
    setShowConfirmation(false);

    // Reload personal data to get all extracted information
    await reloadPersonalData();
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setPreviewUrl(null);
    setUploadError(null);
    setSelectedExistingFile(null);
  };

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    // ID Card validation
    if (!idCardData.type) {
      newErrors.type = "Veuillez sélectionner un type de document";
    }

    // Personal info validation
    if (!personalInfo.civility) {
      newErrors.civility = "Veuillez sélectionner votre civilité";
    }
    if (!personalInfo.firstName?.trim()) {
      newErrors.firstName = "Le prénom est requis";
    }
    if (!personalInfo.lastName?.trim()) {
      newErrors.lastName = "Le nom est requis";
    }
    if (!personalInfo.birthDate) {
      newErrors.birthDate = "La date de naissance est requise";
    }
    if (!personalInfo.nationality?.trim()) {
      newErrors.nationality = "La nationalité est requise";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [idCardData, personalInfo]);

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      if (validateForm()) {
        onNext();
      }
    },
    [validateForm, onNext]
  );

  if (isLoadingData) {
    return (
      <ContentBox>
        <StyledCard>
          <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 }, textAlign: "center" }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Chargement de vos données...
            </Typography>
          </CardContent>
        </StyledCard>
      </ContentBox>
    );
  }

  return (
    <ContentBox>
      <StyledCard>
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={4}>
              {/* Section 1: ID Card Upload */}
              <Box>
                <Box sx={{ textAlign: "center", mb: 3 }}>
                  <Typography variant="h4" gutterBottom>
                    Pièce d'Identité et Informations Personnelles
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Téléchargez votre pièce d'identité et complétez vos
                    informations
                  </Typography>
                </Box>

                {/* ID Type Selection */}
                <FormControl fullWidth error={!!errors.type} sx={{ mb: 3 }}>
                  <InputLabel>Type de document *</InputLabel>
                  <Select
                    value={idCardData.type || ""}
                    onChange={(e) => onIdCardChange({ type: e.target.value })}
                    label="Type de document *"
                  >
                    <MenuItem value="carte_identite">Carte d'identité</MenuItem>
                    <MenuItem value="passeport">Passeport</MenuItem>
                    <MenuItem value="permis_conduire">
                      Permis de conduire
                    </MenuItem>
                    <MenuItem value="carte_electeur">Carte d'électeur</MenuItem>
                  </Select>
                  {errors.type && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ mt: 0.5 }}
                    >
                      {errors.type}
                    </Typography>
                  )}
                </FormControl>

                {/* Existing Files Section */}
                {existingFiles.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      Fichier précédemment téléchargé
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      Fichier sélectionné automatiquement
                    </Typography>
                  </Box>
                )}

                {/* Upload/Preview Area */}
                {!uploadedFile && !selectedExistingFile ? (
                  <UploadArea>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                      style={{ display: "none" }}
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
                      <Typography variant="h6" gutterBottom>
                        📸 Cliquez pour télécharger
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ou glissez-déposez votre document ici
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 1, display: "block" }}
                      >
                        Formats acceptés: JPG, PNG, WEBP (max 10MB)
                      </Typography>
                    </label>
                  </UploadArea>
                ) : (
                  <Box>
                    <Box
                      sx={{ position: "relative", mb: 2, textAlign: "center" }}
                    >
                      <PreviewImage src={previewUrl || ""} alt="ID Preview" />
                      {selectedExistingFile && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 8,
                            left: 8,
                            backgroundColor: "rgba(255, 204, 0, 0.9)",
                            color: "#000",
                            px: 2,
                            py: 1,
                            borderRadius: 1,
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 600 }}
                          >
                            Fichier existant
                          </Typography>
                        </Box>
                      )}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          display: "flex",
                          gap: 1,
                        }}
                      >
                        <IconButton
                          onClick={handleRemoveFile}
                          sx={{
                            backgroundColor: "rgba(0,0,0,0.6)",
                            color: "#FFCC00",
                            "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>

                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleExtractData}
                      disabled={!idCardData.type || isUploading || isExtracting}
                      startIcon={<AutoAwesome />}
                      sx={{
                        mb: 3,
                        backgroundColor: "#000000",
                        color: "#FFCC00",
                        "&:hover": { backgroundColor: "#1a1a1a" },
                      }}
                    >
                      {isExtracting
                        ? "Extraction en cours..."
                        : isUploading
                        ? "Téléchargement..."
                        : "Extraire automatiquement (optionnel)"}
                    </Button>
                  </Box>
                )}

                {/* ID Card Form Fields */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Informations du document
                  </Typography>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label="Numéro du document"
                      value={idCardData.number || ""}
                      onChange={(e) =>
                        onIdCardChange({ number: e.target.value })
                      }
                      helperText="Le numéro unique de votre document"
                    />
                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                      <TextField
                        sx={{ flex: 1, minWidth: { xs: "100%", sm: 200 } }}
                        label="Date d'émission"
                        type="date"
                        value={idCardData.issueDate || ""}
                        onChange={(e) =>
                          onIdCardChange({ issueDate: e.target.value })
                        }
                        InputLabelProps={{ shrink: true }}
                      />
                      <TextField
                        sx={{ flex: 1, minWidth: { xs: "100%", sm: 200 } }}
                        label="Date d'expiration"
                        type="date"
                        value={idCardData.expiryDate || ""}
                        onChange={(e) =>
                          onIdCardChange({ expiryDate: e.target.value })
                        }
                        InputLabelProps={{ shrink: true }}
                      />
                    </Box>
                  </Stack>
                </Box>
              </Box>

              {/* Section 2: Personal Identity Information */}
              <Box>
                <Box sx={{ textAlign: "center", mb: 3 }}>
                  <Person sx={{ fontSize: 64, color: "#FFCC00", mb: 1 }} />
                  <Typography variant="h5" gutterBottom>
                    Identité Personnelle
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ces informations nous aident à vous identifier de manière
                    unique
                  </Typography>
                </Box>

                <Stack spacing={2}>
                  {/* Civility */}
                  <FormControl component="fieldset" error={!!errors.civility}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">Civilité *</Typography>
                      <InfoTooltip title="Nous utilisons votre civilité pour vous adresser correctement dans nos communications officielles." />
                    </Box>
                    <RadioGroup
                      row
                      value={personalInfo.civility || ""}
                      onChange={(e) =>
                        onPersonalInfoChange({
                          civility: e.target.value as
                            | "madame"
                            | "mademoiselle"
                            | "monsieur",
                        })
                      }
                    >
                      <FormControlLabel
                        value="madame"
                        control={<Radio />}
                        label="Mme"
                      />
                      <FormControlLabel
                        value="mademoiselle"
                        control={<Radio />}
                        label="Mlle"
                      />
                      <FormControlLabel
                        value="monsieur"
                        control={<Radio />}
                        label="M."
                      />
                    </RadioGroup>
                    {errors.civility && (
                      <Typography variant="caption" color="error">
                        {errors.civility}
                      </Typography>
                    )}
                  </FormControl>

                  {/* Name Fields */}
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <TextField
                      label="Nom *"
                      placeholder="ex: MUKENDI"
                      value={personalInfo.lastName || ""}
                      onChange={(e) =>
                        onPersonalInfoChange({ lastName: e.target.value })
                      }
                      error={!!errors.lastName}
                      helperText={errors.lastName || "Votre nom de famille"}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ flex: 1, minWidth: { xs: "100%", sm: 200 } }}
                    />
                    <TextField
                      label="Postnom"
                      placeholder="ex: NGANDU"
                      value={personalInfo.middleName || ""}
                      onChange={(e) =>
                        onPersonalInfoChange({ middleName: e.target.value })
                      }
                      helperText="Votre second nom (optionnel)"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ flex: 1, minWidth: { xs: "100%", sm: 200 } }}
                    />
                    <TextField
                      label="Prénom *"
                      placeholder="ex: Jean"
                      value={personalInfo.firstName || ""}
                      onChange={(e) =>
                        onPersonalInfoChange({ firstName: e.target.value })
                      }
                      error={!!errors.firstName}
                      helperText={errors.firstName || "Votre prénom"}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ flex: 1, minWidth: { xs: "100%", sm: 200 } }}
                    />
                  </Box>

                  {/* Birth Date */}
                  <TextField
                    fullWidth
                    label="Date de naissance *"
                    type="date"
                    value={personalInfo.birthDate || ""}
                    onChange={(e) =>
                      onPersonalInfoChange({ birthDate: e.target.value })
                    }
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.birthDate}
                    helperText={
                      errors.birthDate || "Sélectionnez votre date de naissance"
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CakeOutlined color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  {/* Nationality, Province and Birth Place */}
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <FormControl
                      sx={{ flex: 1, minWidth: { xs: "100%", sm: 200 } }}
                      error={!!errors.nationality}
                    >
                      <InputLabel>Nationalité *</InputLabel>
                      <Select
                        value={selectedCountry}
                        onChange={(e) => {
                          setSelectedCountry(e.target.value);
                          const country = Country.getCountryByCode(
                            e.target.value
                          );
                          if (country) {
                            onPersonalInfoChange({ nationality: country.name });
                          }
                        }}
                        label="Nationalité *"
                        startAdornment={
                          <InputAdornment position="start">
                            <Public color="primary" />
                          </InputAdornment>
                        }
                      >
                        {Country.getAllCountries().map((country) => (
                          <MenuItem
                            key={country.isoCode}
                            value={country.isoCode}
                          >
                            {country.name}
                          </MenuItem>
                        ))}
                      </Select>
                      <Typography
                        variant="caption"
                        color={errors.nationality ? "error" : "text.secondary"}
                        sx={{ mt: 0.5, ml: 1.75 }}
                      >
                        {errors.nationality || "Votre pays de citoyenneté"}
                      </Typography>
                    </FormControl>

                    <FormControl
                      sx={{ flex: 1, minWidth: { xs: "100%", sm: 200 } }}
                    >
                      <InputLabel>Province d'origine</InputLabel>
                      <Select
                        value={selectedState}
                        onChange={(e) => {
                          setSelectedState(e.target.value);
                          const state = states.find(
                            (s) => s.isoCode === e.target.value
                          );
                          if (state) {
                            onPersonalInfoChange({
                              provinceOfOrigin: state.name,
                            });
                          }
                        }}
                        label="Province d'origine"
                        startAdornment={
                          <InputAdornment position="start">
                            <LocationOn color="primary" />
                          </InputAdornment>
                        }
                      >
                        <MenuItem value="">
                          <em>Sélectionnez une province</em>
                        </MenuItem>
                        {states.map((state) => (
                          <MenuItem key={state.isoCode} value={state.isoCode}>
                            {state.name}
                          </MenuItem>
                        ))}
                      </Select>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 0.5, ml: 1.75 }}
                      >
                        Province où vous êtes originaire
                      </Typography>
                    </FormControl>

                    <FormControl
                      sx={{ flex: 1, minWidth: { xs: "100%", sm: 200 } }}
                    >
                      <InputLabel>Ville de naissance</InputLabel>
                      <Select
                        value={personalInfo.birthPlace || ""}
                        onChange={(e) =>
                          onPersonalInfoChange({ birthPlace: e.target.value })
                        }
                        label="Ville de naissance"
                        startAdornment={
                          <InputAdornment position="start">
                            <LocationOn color="primary" />
                          </InputAdornment>
                        }
                        disabled={!selectedState || cities.length === 0}
                      >
                        <MenuItem value="">
                          <em>Sélectionnez une ville</em>
                        </MenuItem>
                        {cities.map((city) => (
                          <MenuItem key={city.name} value={city.name}>
                            {city.name}
                          </MenuItem>
                        ))}
                      </Select>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 0.5, ml: 1.75 }}
                      >
                        {selectedState
                          ? "Sélectionnez votre ville"
                          : "Sélectionnez d'abord une province"}
                      </Typography>
                    </FormControl>
                  </Box>
                </Stack>
              </Box>

              {/* Errors */}
              {uploadError && <Alert severity="error">{uploadError}</Alert>}

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
                  disabled={loading || isUploading || isExtracting}
                  sx={{ flex: 1 }}
                >
                  Précédent
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || isUploading || isExtracting}
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

      {/* Modals */}
      <ExtractionLoadingModal
        open={isExtracting || isUploading}
        progress={0}
        isUploading={isUploading}
        isExtracting={isExtracting}
      />
      <ExtractionConfirmationModal
        open={showConfirmation}
        data={extractedData}
        onConfirm={handleConfirmData}
        onEdit={handleEditData}
      />
    </ContentBox>
  );
};

export default IdCardAndIdentityStep;
