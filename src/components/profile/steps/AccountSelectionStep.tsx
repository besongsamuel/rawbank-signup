import {
  AccountBalance,
  Business,
  Group,
  LocationOn,
  Person,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormLabel,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useApplicationContext } from "../../../contexts/ApplicationContext";

// Import Application type from context
interface Application {
  id: string;
  user_id: string;
  application_number: string;
  account_type: string;
  agency_id: string;
  card_type?: string;
  status: "draft" | "submitted" | "under_review" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
  submitted_at?: string;
}

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

const AccountTypeCard = styled(Card)<{ selected?: boolean }>(
  ({ theme, selected }) => ({
    padding: theme.spacing(2),
    cursor: "pointer",
    border: selected ? "2px solid #FFCC00" : "2px solid transparent",
    backgroundColor: selected ? "#FFF9E6" : "#FAFAFA",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: selected ? "#FFF9E6" : "#F5F5F5",
      borderColor: "#FFCC00",
    },
  })
);

interface AccountSelectionData {
  accountType: string;
  agencyId: string;
}

interface AccountSelectionStepProps {
  data: AccountSelectionData;
  onDataChange: (data: Partial<AccountSelectionData>) => void;
  onNext: () => void;
  onPrev: () => void;
  loading?: boolean;
}

// Mock agencies data - in production, this would come from the database
const MOCK_AGENCIES = [
  {
    id: "kinshasa_center",
    name: "Agence Kinshasa Centre",
    address: "Avenue du 30 Juin, Kinshasa",
    recommended: true, // Most popular agency
  },
  {
    id: "kinshasa_gombe",
    name: "Agence Kinshasa Gombe",
    address: "Boulevard du 30 Juin, Gombe",
  },
  {
    id: "kinshasa_limete",
    name: "Agence Kinshasa Limete",
    address: "Avenue Kasa-Vubu, Limete",
  },
  {
    id: "lubumbashi_center",
    name: "Agence Lubumbashi Centre",
    address: "Avenue Kasongo, Lubumbashi",
  },
  {
    id: "lubumbashi_katanga",
    name: "Agence Lubumbashi Katanga",
    address: "Boulevard Kamalondo, Lubumbashi",
  },
  {
    id: "goma_center",
    name: "Agence Goma Centre",
    address: "Avenue de la Paix, Goma",
  },
  {
    id: "bukavu_center",
    name: "Agence Bukavu Centre",
    address: "Avenue de l'Indépendance, Bukavu",
  },
  {
    id: "matadi_center",
    name: "Agence Matadi Centre",
    address: "Avenue du Port, Matadi",
  },
];

const AccountSelectionStep: React.FC<AccountSelectionStepProps> = ({
  data,
  onDataChange,
  onNext,
  onPrev,
  loading = false,
}) => {
  const { user, application, updateApplication } = useApplicationContext();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const hasLoadedData = useRef(false);

  // Pre-populate form fields based on existing application data or smart defaults
  useEffect(() => {
    if (!hasLoadedData.current) {
      const updateData: Partial<AccountSelectionData> = {};

      if (application) {
        // Pre-populate account type if available
        if (application.account_type && !data.accountType) {
          updateData.accountType = application.account_type;
        }

        // Pre-populate agency if available
        if (application.agency_id && !data.agencyId) {
          updateData.agencyId = application.agency_id;
        }
      } else {
        // Smart defaults for new applications
        // Most users open individual accounts - pre-select it
        if (!data.accountType) {
          updateData.accountType = "individual";
        }

        // Pre-select the recommended agency (most popular/central)
        if (!data.agencyId) {
          const recommendedAgency = MOCK_AGENCIES.find((a) => a.recommended);
          if (recommendedAgency) {
            updateData.agencyId = recommendedAgency.id;
          }
        }
      }

      // Update the form data if we have any changes
      if (Object.keys(updateData).length > 0) {
        onDataChange(updateData);
      }

      hasLoadedData.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [application, data.accountType, data.agencyId]);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!data.accountType) {
      newErrors.accountType = "Le type de compte est requis";
    }
    if (!data.agencyId) {
      newErrors.agencyId = "L'agence est requise";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [data]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (!validateForm() || !user?.id) return;

      try {
        // Generate unique application number for new application if needed
        let applicationData: Partial<Application> = {
          account_type: data.accountType,
          agency_id: data.agencyId,
        };

        if (!application) {
          const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
          const random = Math.floor(Math.random() * 1000)
            .toString()
            .padStart(3, "0"); // 3-digit random
          const appNumber = `APP${timestamp}${random}`;

          applicationData = {
            ...applicationData,
            application_number: appNumber,
            status: "draft",
          };
        }

        // Use context update function
        await updateApplication(applicationData);

        console.log("Application processed successfully");
        onNext();
      } catch (error) {
        console.error("Error:", error);
        setErrors({ submit: "Une erreur inattendue s'est produite" });
      }
    },
    [validateForm, user?.id, data, onNext, application, updateApplication]
  );

  const accountTypes = [
    {
      value: "individual",
      label: "Compte Individuel",
      description: "Compte personnel pour une personne physique",
      icon: <Person sx={{ fontSize: 40, color: "#FFCC00" }} />,
    },
    {
      value: "joint",
      label: "Compte Joint",
      description: "Compte partagé entre deux personnes",
      icon: <Group sx={{ fontSize: 40, color: "#FFCC00" }} />,
    },
    {
      value: "business",
      label: "Compte Professionnel",
      description: "Compte pour professionnels et petites entreprises",
      icon: <Business sx={{ fontSize: 40, color: "#FFCC00" }} />,
    },
    {
      value: "corporate",
      label: "Compte Entreprise",
      description: "Compte pour grandes entreprises et sociétés",
      icon: <AccountBalance sx={{ fontSize: 40, color: "#FFCC00" }} />,
    },
  ];

  return (
    <ContentBox>
      <StyledCard>
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Sélection du Compte et de l'Agence
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Choisissez le type de compte et l'agence où vous souhaitez ouvrir
              votre compte
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={4}>
              {/* Account Type Selection */}
              <Box>
                <Box sx={{ textAlign: "center", mb: 3 }}>
                  <AccountBalance
                    sx={{ fontSize: 64, color: "#FFCC00", mb: 1 }}
                  />
                  <Typography variant="h5" gutterBottom>
                    1. Type de Compte
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sélectionnez le type de compte qui correspond à vos besoins
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  {accountTypes.map((type) => (
                    <Box
                      key={type.value}
                      sx={{ flex: "1 1 300px", minWidth: 300 }}
                    >
                      <AccountTypeCard
                        selected={data.accountType === type.value}
                        onClick={() =>
                          onDataChange({ accountType: type.value })
                        }
                      >
                        <Box sx={{ textAlign: "center" }}>
                          {type.icon}
                          <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
                            {type.label}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {type.description}
                          </Typography>
                        </Box>
                      </AccountTypeCard>
                    </Box>
                  ))}
                </Box>

                {errors.accountType && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ mt: 1, display: "block" }}
                  >
                    {errors.accountType}
                  </Typography>
                )}
              </Box>

              {/* Agency Selection */}
              <Box>
                <Box sx={{ textAlign: "center", mb: 3 }}>
                  <LocationOn sx={{ fontSize: 64, color: "#FFCC00", mb: 1 }} />
                  <Typography variant="h5" gutterBottom>
                    2. Sélection de l'Agence
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Choisissez l'agence Rawbank la plus proche de vous
                  </Typography>
                </Box>

                <FormControl fullWidth error={!!errors.agencyId}>
                  <FormLabel>Agence Rawbank *</FormLabel>
                  <Select
                    value={data.agencyId || ""}
                    onChange={(e) => onDataChange({ agencyId: e.target.value })}
                    label="Agence Rawbank *"
                    startAdornment={
                      <InputAdornment position="start">
                        <LocationOn color="primary" />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="">
                      <em>Sélectionnez une agence</em>
                    </MenuItem>
                    {MOCK_AGENCIES.map((agency) => (
                      <MenuItem key={agency.id} value={agency.id}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <Box>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 500 }}
                            >
                              {agency.name}
                              {agency.recommended && (
                                <Typography
                                  component="span"
                                  sx={{
                                    ml: 1,
                                    px: 1,
                                    py: 0.25,
                                    backgroundColor: "#FFCC00",
                                    color: "#000",
                                    borderRadius: 1,
                                    fontSize: "0.7rem",
                                    fontWeight: 600,
                                  }}
                                >
                                  ⭐ Recommandé
                                </Typography>
                              )}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {agency.address}
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.agencyId && (
                    <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                      {errors.agencyId}
                    </Typography>
                  )}
                </FormControl>
              </Box>

              {/* Error Display */}
              {errors.submit && (
                <Typography
                  variant="body2"
                  color="error"
                  sx={{ textAlign: "center" }}
                >
                  {errors.submit}
                </Typography>
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
                  {loading ? "Création..." : "Sauvegarder et continuer"}
                </Button>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </StyledCard>
    </ContentBox>
  );
};

export default AccountSelectionStep;
