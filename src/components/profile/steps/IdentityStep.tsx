import { CakeOutlined, LocationOn, Person, Public } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  FormControlLabel,
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
import { supabase } from "../../../lib/supabase";
import { PersonalInfo } from "../../../types/signup";

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

interface IdentityStepProps {
  personalInfo: PersonalInfo;
  onDataChange: (data: Partial<PersonalInfo>) => void;
  onNext: () => void;
  onPrev: () => void;
  loading?: boolean;
}

const IdentityStep: React.FC<IdentityStepProps> = ({
  personalInfo,
  onDataChange,
  onNext,
  onPrev,
  loading = false,
}) => {
  const { user } = useApplicationContext();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoadingData, setIsLoadingData] = useState(false);
  const hasLoadedData = useRef(false);

  // Country/State/City data
  const [selectedCountry, setSelectedCountry] = useState("CD"); // DRC (Congo - Kinshasa)
  const [selectedState, setSelectedState] = useState("");
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  // Fetch latest personal data when component loads
  useEffect(() => {
    const fetchPersonalData = async () => {
      if (!user?.id || hasLoadedData.current) return;

      hasLoadedData.current = true;
      setIsLoadingData(true);
      try {
        const { data, error } = await supabase
          .from("personal_data")
          .select("*")
          .eq("id", user.id)
          .single();

        if (!error && data) {
          // Prefill form with existing data
          const existingData: Partial<PersonalInfo> = {
            civility: data.civility,
            firstName: data.first_name,
            middleName: data.middle_name,
            lastName: data.last_name,
            birthDate: data.birth_date,
            birthPlace: data.birth_place,
            provinceOfOrigin: data.province_of_origin,
            nationality: data.nationality,
            countryOfResidence: data.country_of_residence,
          };

          // Only update if we have actual data (not empty strings)
          const hasData = Object.values(existingData).some(
            (value) => value && value !== ""
          );
          if (hasData) {
            onDataChange(existingData);
          }
        }
      } catch (error) {
        console.error("Error fetching personal data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchPersonalData();
  }, [user?.id]);

  // Load states when country changes
  useEffect(() => {
    if (selectedCountry) {
      const countryStates = State.getStatesOfCountry(selectedCountry);
      setStates(countryStates);

      // Pre-select if user already has data
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

  // Set default nationality and country to DRC if not set
  useEffect(() => {
    if (!personalInfo.nationality) {
      const drcCountry = Country.getCountryByCode("CD");
      if (drcCountry) {
        onDataChange({
          nationality: drcCountry.name,
          countryOfResidence: drcCountry.name,
        });
      }
    }
  }, [personalInfo.nationality, onDataChange]);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

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
  }, [personalInfo]);

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      if (validateForm()) {
        onNext();
      }
    },
    [validateForm, onNext]
  );

  // Show loading state while fetching data
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
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Informations d'Identité
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Complétez vos informations personnelles
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={4}>
              {/* Section Illustration */}
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
                  <Typography variant="body2" gutterBottom>
                    Civilité *
                  </Typography>
                  <RadioGroup
                    row
                    name="civility"
                    value={personalInfo.civility || ""}
                    onChange={(e) =>
                      onDataChange({
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
                    onChange={(e) => onDataChange({ lastName: e.target.value })}
                    error={!!errors.lastName}
                    helperText={
                      errors.lastName ||
                      "Votre nom de famille tel qu'il apparaît sur votre pièce d'identité"
                    }
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
                      onDataChange({ middleName: e.target.value })
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
                      onDataChange({ firstName: e.target.value })
                    }
                    error={!!errors.firstName}
                    helperText={
                      errors.firstName ||
                      "Votre prénom tel qu'il apparaît sur votre pièce d'identité"
                    }
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
                  onChange={(e) => onDataChange({ birthDate: e.target.value })}
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
                          onDataChange({ nationality: country.name });
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
                        <MenuItem key={country.isoCode} value={country.isoCode}>
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
                          onDataChange({ provinceOfOrigin: state.name });
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
                        onDataChange({ birthPlace: e.target.value })
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

export default IdentityStep;
