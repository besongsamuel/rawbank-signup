import {
  AccountBalance,
  Business,
  CakeOutlined,
  ContactPhone,
  Email,
  Home,
  LocationOn,
  MonetizationOn,
  Person,
  Phone,
  Public,
  Work,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
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
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useApplicationContext } from "../../contexts/ApplicationContext";
import {
  ContactInfo,
  EmergencyContact,
  HousingInfo,
  MaritalInfo,
  PersonalInfo,
  ProfessionalInfo,
} from "../../types/signup";

const ContentBox = styled(Box)(({ theme }) => ({
  minHeight: "calc(100vh - 160px)", // Account for header/footer
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

interface PersonalInfoFormProps {
  personalInfo: PersonalInfo;
  maritalInfo: MaritalInfo;
  housingInfo: HousingInfo;
  contactInfo: ContactInfo;
  professionalInfo: ProfessionalInfo;
  emergencyContact: EmergencyContact;
  onDataChange: (data: {
    personalInfo?: Partial<PersonalInfo>;
    maritalInfo?: Partial<MaritalInfo>;
    housingInfo?: Partial<HousingInfo>;
    contactInfo?: Partial<ContactInfo>;
    professionalInfo?: Partial<ProfessionalInfo>;
    emergencyContact?: Partial<EmergencyContact>;
  }) => void;
  onNext: () => void;
  onPrev: () => void;
  loading?: boolean;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  personalInfo,
  maritalInfo,
  housingInfo,
  contactInfo,
  professionalInfo,
  emergencyContact,
  onDataChange,
  onNext,
  onPrev,
  loading = false,
}) => {
  const { t } = useTranslation();
  const { user } = useApplicationContext();
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Country/State/City data
  const [selectedCountry, setSelectedCountry] = useState("CD"); // DRC (Congo - Kinshasa)
  const [selectedState, setSelectedState] = useState("");
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

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

  // Initialize email1 from user and set default nationality/country
  useEffect(() => {
    if (user?.email && !contactInfo.email1) {
      onDataChange({
        contactInfo: { email1: user.email },
      });
    }

    // Set default nationality and country to DRC if not set
    if (!personalInfo.nationality) {
      const drcCountry = Country.getCountryByCode("CD");
      if (drcCountry) {
        onDataChange({
          personalInfo: {
            nationality: drcCountry.name,
            countryOfResidence: drcCountry.name,
          },
        });
      }
    }
  }, [user, contactInfo.email1, personalInfo.nationality, onDataChange]);

  // Validation function
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    // Personal Info validation
    if (!personalInfo.civility) newErrors.civility = "Civilité requise";
    if (!personalInfo.lastName.trim())
      newErrors.lastName = "Nom de famille requis";
    if (!personalInfo.firstName.trim()) newErrors.firstName = "Prénom requis";
    if (!personalInfo.birthDate)
      newErrors.birthDate = "Date de naissance requise";
    if (!personalInfo.birthPlace.trim())
      newErrors.birthPlace = "Lieu de naissance requis";
    if (!personalInfo.nationality.trim())
      newErrors.nationality = "Nationalité requise";

    // Contact Info validation
    if (!contactInfo.phone1.trim())
      newErrors.phone1 = "Téléphone principal requis";
    if (!contactInfo.email1.trim()) newErrors.email1 = "Email principal requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email1))
      newErrors.email1 = "Email invalide";

    // Housing Info validation
    if (!housingInfo.permanentAddress.trim())
      newErrors.permanentAddress = "Adresse permanente requise";

    // Professional Info validation
    if (!professionalInfo.profession.trim())
      newErrors.profession = "Profession requise";

    // Emergency Contact validation
    if (!emergencyContact.contactPerson.trim())
      newErrors.contactPerson = "Personne à contacter requise";
    if (!emergencyContact.contactPhone.trim())
      newErrors.contactPhone = "Téléphone du contact requis";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [
    personalInfo,
    contactInfo,
    housingInfo,
    professionalInfo,
    emergencyContact,
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <ContentBox>
      <StyledCard>
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Informations Personnelles
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Complétez vos informations pour ouvrir votre compte
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={4}>
              {/* Personal Information Section */}
              <Box>
                {/* Section Illustration */}
                <Box sx={{ textAlign: "center", mb: 3 }}>
                  <Person sx={{ fontSize: 64, color: "#FFCC00", mb: 1 }} />
                  <Typography variant="h5" gutterBottom>
                    1. Identité
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
                      value={personalInfo.civility || ""}
                      onChange={(e) =>
                        onDataChange({
                          personalInfo: {
                            civility: e.target.value as
                              | "madame"
                              | "mademoiselle"
                              | "monsieur",
                          },
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
                        onDataChange({
                          personalInfo: { lastName: e.target.value },
                        })
                      }
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
                        onDataChange({
                          personalInfo: { middleName: e.target.value },
                        })
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
                        onDataChange({
                          personalInfo: { firstName: e.target.value },
                        })
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
                    onChange={(e) =>
                      onDataChange({
                        personalInfo: { birthDate: e.target.value },
                      })
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

                  {/* Origin and Nationality */}
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
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
                            onDataChange({
                              personalInfo: { provinceOfOrigin: state.name },
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
                            onDataChange({
                              personalInfo: { nationality: country.name },
                            });
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
                      <InputLabel>Ville de naissance</InputLabel>
                      <Select
                        value={personalInfo.birthPlace || ""}
                        onChange={(e) =>
                          onDataChange({
                            personalInfo: { birthPlace: e.target.value },
                          })
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

              <Divider />

              {/* Marital Information Section */}
              <Box>
                <Box sx={{ textAlign: "center", mb: 3 }}>
                  <Home sx={{ fontSize: 64, color: "#FFCC00", mb: 1 }} />
                  <Typography variant="h5" gutterBottom>
                    2. Situation Familiale
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Informations sur votre situation matrimoniale
                  </Typography>
                </Box>
                <Stack spacing={2}>
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <FormControl
                      sx={{ flex: 1, minWidth: { xs: "100%", sm: 250 } }}
                    >
                      <InputLabel>Situation familiale</InputLabel>
                      <Select
                        value={maritalInfo.maritalStatus || ""}
                        onChange={(e) =>
                          onDataChange({
                            maritalInfo: {
                              maritalStatus: e.target.value as
                                | "celibataire"
                                | "marie"
                                | "divorce"
                                | "veuf",
                            },
                          })
                        }
                        label="Situation familiale"
                      >
                        <MenuItem value="celibataire">Célibataire</MenuItem>
                        <MenuItem value="marie">Marié(e)</MenuItem>
                        <MenuItem value="divorce">Divorcé(e)</MenuItem>
                        <MenuItem value="veuf">Veuf(ve)</MenuItem>
                      </Select>
                    </FormControl>

                    {maritalInfo.maritalStatus === "marie" && (
                      <FormControl
                        sx={{ flex: 1, minWidth: { xs: "100%", sm: 250 } }}
                      >
                        <InputLabel>Régime matrimonial</InputLabel>
                        <Select
                          value={maritalInfo.maritalRegime || ""}
                          onChange={(e) =>
                            onDataChange({
                              maritalInfo: {
                                maritalRegime: e.target.value as
                                  | "separation_biens"
                                  | "communaute_universelle"
                                  | "communaute_reduite",
                              },
                            })
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
                      </FormControl>
                    )}

                    <TextField
                      label="Nombre d'enfants"
                      type="number"
                      value={maritalInfo.numberOfChildren || 0}
                      onChange={(e) =>
                        onDataChange({
                          maritalInfo: {
                            numberOfChildren: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                      InputProps={{ inputProps: { min: 0 } }}
                      sx={{ flex: 1, minWidth: { xs: "100%", sm: 200 } }}
                    />
                  </Box>
                </Stack>
              </Box>

              <Divider />

              {/* Housing Information Section */}
              <Box>
                <Box sx={{ textAlign: "center", mb: 3 }}>
                  <Home sx={{ fontSize: 64, color: "#FFCC00", mb: 1 }} />
                  <Typography variant="h5" gutterBottom>
                    3. Informations de Logement
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Où habitez-vous actuellement?
                  </Typography>
                </Box>
                <Stack spacing={2}>
                  <FormControl component="fieldset">
                    <Typography variant="body2" gutterBottom>
                      Statut de logement
                    </Typography>
                    <RadioGroup
                      row
                      value={housingInfo.housingStatus || ""}
                      onChange={(e) =>
                        onDataChange({
                          housingInfo: {
                            housingStatus: e.target.value as
                              | "proprietaire"
                              | "locataire"
                              | "loge_gratuit"
                              | "loge_parents",
                          },
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
                        label="Logé à titre gratuit"
                      />
                      <FormControlLabel
                        value="loge_parents"
                        control={<Radio />}
                        label="Logé chez les parents"
                      />
                    </RadioGroup>
                  </FormControl>

                  <TextField
                    fullWidth
                    label="Adresse permanente *"
                    placeholder="ex: 123 Avenue Kasavubu, Commune de Gombe, Kinshasa"
                    multiline
                    rows={2}
                    value={housingInfo.permanentAddress || ""}
                    onChange={(e) =>
                      onDataChange({
                        housingInfo: { permanentAddress: e.target.value },
                      })
                    }
                    error={!!errors.permanentAddress}
                    helperText={
                      errors.permanentAddress ||
                      "Votre adresse complète actuelle"
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOn color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Adresse courrier"
                    placeholder="Si différente de l'adresse permanente"
                    multiline
                    rows={2}
                    value={housingInfo.mailingAddress || ""}
                    onChange={(e) =>
                      onDataChange({
                        housingInfo: { mailingAddress: e.target.value },
                      })
                    }
                    helperText="Adresse où recevoir le courrier (optionnel)"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOn color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>
              </Box>

              <Divider />

              {/* Contact Information Section */}
              <Box>
                <Box sx={{ textAlign: "center", mb: 3 }}>
                  <Phone sx={{ fontSize: 64, color: "#FFCC00", mb: 1 }} />
                  <Typography variant="h5" gutterBottom>
                    4. Coordonnées
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Comment pouvons-nous vous contacter?
                  </Typography>
                </Box>
                <Stack spacing={2}>
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <TextField
                      label="Téléphone 1 *"
                      type="tel"
                      placeholder="+243 XXX XXX XXX"
                      value={contactInfo.phone1 || ""}
                      onChange={(e) =>
                        onDataChange({
                          contactInfo: { phone1: e.target.value },
                        })
                      }
                      error={!!errors.phone1}
                      helperText={
                        errors.phone1 ||
                        "Pour recevoir vos alertes SMS et notifications"
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ flex: 1, minWidth: { xs: "100%", sm: 250 } }}
                    />
                    <TextField
                      label="Téléphone 2"
                      type="tel"
                      placeholder="+243 XXX XXX XXX"
                      value={contactInfo.phone2 || ""}
                      onChange={(e) =>
                        onDataChange({
                          contactInfo: { phone2: e.target.value },
                        })
                      }
                      helperText="Numéro secondaire (optionnel)"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ flex: 1, minWidth: { xs: "100%", sm: 250 } }}
                    />
                  </Box>
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <TextField
                      label="Email 1 *"
                      type="email"
                      value={user?.email || contactInfo.email1 || ""}
                      disabled
                      helperText="Email utilisé pour la connexion (non modifiable)"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        flex: 1,
                        minWidth: { xs: "100%", sm: 250 },
                        "& .MuiInputBase-input.Mui-disabled": {
                          WebkitTextFillColor: "rgba(0, 0, 0, 0.6)",
                        },
                      }}
                    />
                    <TextField
                      label="Email 2"
                      type="email"
                      placeholder="email.secondaire@exemple.com"
                      value={contactInfo.email2 || ""}
                      onChange={(e) =>
                        onDataChange({
                          contactInfo: { email2: e.target.value },
                        })
                      }
                      helperText="Email secondaire (optionnel)"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ flex: 1, minWidth: { xs: "100%", sm: 250 } }}
                    />
                  </Box>
                </Stack>
              </Box>

              <Divider />

              {/* Professional Information Section */}
              <Box>
                <Box sx={{ textAlign: "center", mb: 3 }}>
                  <Work sx={{ fontSize: 64, color: "#FFCC00", mb: 1 }} />
                  <Typography variant="h5" gutterBottom>
                    5. Informations Professionnelles
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Parlez-nous de votre activité professionnelle
                  </Typography>
                </Box>
                <Stack spacing={2}>
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <TextField
                      label="Profession *"
                      placeholder="ex: Commerçant, Enseignant, Ingénieur"
                      value={professionalInfo.profession || ""}
                      onChange={(e) =>
                        onDataChange({
                          professionalInfo: { profession: e.target.value },
                        })
                      }
                      error={!!errors.profession}
                      helperText={
                        errors.profession || "Votre occupation principale"
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
                      label="Employeur"
                      placeholder="ex: Nom de l'entreprise"
                      value={professionalInfo.employer || ""}
                      onChange={(e) =>
                        onDataChange({
                          professionalInfo: { employer: e.target.value },
                        })
                      }
                      helperText="Nom de votre employeur ou entreprise (optionnel)"
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
                      label="Revenus mensuels (brut) USD"
                      type="number"
                      placeholder="1000"
                      value={professionalInfo.monthlyIncome || ""}
                      onChange={(e) =>
                        onDataChange({
                          professionalInfo: {
                            monthlyIncome: parseFloat(e.target.value) || 0,
                          },
                        })
                      }
                      helperText="Vos revenus mensuels estimés en USD"
                      InputProps={{
                        inputProps: { min: 0, step: 0.01 },
                        startAdornment: (
                          <InputAdornment position="start">
                            <MonetizationOn color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ flex: 1, minWidth: { xs: "100%", sm: 250 } }}
                    />
                    <TextField
                      label="Origine des revenus"
                      placeholder="ex: Salaire, Commerce, Investissements"
                      value={professionalInfo.incomeOrigin || ""}
                      onChange={(e) =>
                        onDataChange({
                          professionalInfo: { incomeOrigin: e.target.value },
                        })
                      }
                      helperText="D'où proviennent vos revenus?"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccountBalance color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ flex: 1, minWidth: { xs: "100%", sm: 250 } }}
                    />
                  </Box>
                </Stack>
              </Box>

              <Divider />

              {/* Emergency Contact Section */}
              <Box>
                <Box sx={{ textAlign: "center", mb: 3 }}>
                  <ContactPhone
                    sx={{ fontSize: 64, color: "#FFCC00", mb: 1 }}
                  />
                  <Typography variant="h5" gutterBottom>
                    6. Contact d'Urgence
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Une personne de confiance à contacter en cas de besoin
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <TextField
                    label="Personne à contacter *"
                    placeholder="ex: Marie KABONGO (Épouse)"
                    value={emergencyContact.contactPerson || ""}
                    onChange={(e) =>
                      onDataChange({
                        emergencyContact: { contactPerson: e.target.value },
                      })
                    }
                    error={!!errors.contactPerson}
                    helperText={
                      errors.contactPerson ||
                      "Nom et lien de parenté de votre contact d'urgence"
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ flex: 1, minWidth: 250 }}
                  />
                  <TextField
                    label="Téléphone *"
                    type="tel"
                    placeholder="+243 XXX XXX XXX"
                    value={emergencyContact.contactPhone || ""}
                    onChange={(e) =>
                      onDataChange({
                        emergencyContact: { contactPhone: e.target.value },
                      })
                    }
                    error={!!errors.contactPhone}
                    helperText={
                      errors.contactPhone ||
                      "Numéro pour joindre votre contact d'urgence"
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ContactPhone color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ flex: 1, minWidth: 250 }}
                  />
                </Box>
              </Box>

              {/* Action Buttons */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 2,
                  pt: 2,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={onPrev}
                  disabled={loading}
                  size="large"
                >
                  Précédent
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  size="large"
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Continuer"
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

export default PersonalInfoForm;
