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
import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useUserProfile } from "../../../hooks/useUserProfile";
import { supabase } from "../../../lib/supabase";

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

const AccountSelectionStep: React.FC<AccountSelectionStepProps> = ({
  data,
  onDataChange,
  onNext,
  onPrev,
  loading = false,
}) => {
  const { user } = useAuth();
  const { application } = useUserProfile(user);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agencies, setAgencies] = useState<any[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Mock agencies data - in production, this would come from the database
  const mockAgencies = [
    {
      id: "kinshasa_center",
      name: "Agence Kinshasa Centre",
      address: "Avenue du 30 Juin, Kinshasa",
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

  React.useEffect(() => {
    setAgencies(mockAgencies);
  }, []);

  // Pre-populate form fields based on existing application data
  useEffect(() => {
    if (application && !dataLoaded) {
      const updateData: Partial<AccountSelectionData> = {};

      // Pre-populate account type if available
      if (application.account_type && !data.accountType) {
        updateData.accountType = application.account_type;
      }

      // Pre-populate agency if available
      if (application.agency_id && !data.agencyId) {
        updateData.agencyId = application.agency_id;
      }

      // Update the form data if we have any changes
      if (Object.keys(updateData).length > 0) {
        onDataChange(updateData);
      }

      setDataLoaded(true);
    }
  }, [application, data, onDataChange, dataLoaded]);

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
        // Generate unique application number using timestamp and random component
        const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
        const random = Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0"); // 3-digit random
        const appNumber = `APP${timestamp}${random}`;

        // Create application record
        const { data: application, error } = await supabase
          .from("applications")
          .insert({
            user_id: user.id,
            application_number: appNumber,
            account_type: data.accountType,
            agency_id: data.agencyId,
            status: "draft",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) {
          console.error("Error creating application:", error);
          setErrors({ submit: "Erreur lors de la création de la demande" });
          return;
        }

        console.log("Application created:", application);
        onNext();
      } catch (error) {
        console.error("Error:", error);
        setErrors({ submit: "Une erreur inattendue s'est produite" });
      }
    },
    [validateForm, user?.id, data, onNext]
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
                    {agencies.map((agency) => (
                      <MenuItem key={agency.id} value={agency.id}>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {agency.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {agency.address}
                          </Typography>
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
