import {
  AccountBalance,
  CheckCircle,
  Email,
  Event,
  Logout,
  Person,
  Phone,
  Work,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useUserProfile } from "../../hooks/useUserProfile";
import LanguageSwitcher from "../common/LanguageSwitcher";

const ContentBox = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: "#FFFFFF",
  padding: theme.spacing(2),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 20,
  boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down("sm")]: {
    borderRadius: theme.spacing(1.5),
  },
}));

const LogoSection = styled(Box)(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(4),
}));

const UserDashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const {
    profile,
    application,
    loading: profileLoading,
  } = useUserProfile(user);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const getAccountTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      individual: "Compte Individuel",
      joint: "Compte Joint",
      business: "Compte Professionnel",
      corporate: "Compte Entreprise",
    };
    return types[type] || type;
  };

  const getAgencyName = (agencyId: string) => {
    const agencies: Record<string, string> = {
      kinshasa_center: "Agence Kinshasa Centre",
      kinshasa_gombe: "Agence Kinshasa Gombe",
      kinshasa_limete: "Agence Kinshasa Limete",
      lubumbashi_center: "Agence Lubumbashi Centre",
      lubumbashi_katanga: "Agence Lubumbashi Katanga",
      goma_center: "Agence Goma Centre",
      bukavu_center: "Agence Bukavu Centre",
      matadi_center: "Agence Matadi Centre",
    };
    return agencies[agencyId] || agencyId;
  };

  const getCivilityLabel = (civility: string) => {
    const civilities: Record<string, string> = {
      monsieur: "Monsieur",
      madame: "Madame",
      mademoiselle: "Mademoiselle",
    };
    return civilities[civility] || civility;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, "success" | "warning" | "info" | "error"> = {
      submitted: "info",
      under_review: "warning",
      approved: "success",
      rejected: "error",
      draft: "warning",
    };
    return colors[status] || "info";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      submitted: "Soumise",
      under_review: "En cours d'examen",
      approved: "Approuvée",
      rejected: "Rejetée",
      draft: "Brouillon",
    };
    return labels[status] || status;
  };

  if (authLoading || profileLoading) {
    return (
      <ContentBox>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "50vh",
          }}
        >
          <CircularProgress size={60} />
        </Box>
      </ContentBox>
    );
  }

  // User is guaranteed to be logged in due to ProtectedRoute
  if (!user) {
    return null; // This should never happen due to ProtectedRoute
  }

  return (
    <ContentBox>
      <Box sx={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Language Switcher */}
        <Box sx={{ position: "absolute", top: 16, right: 16 }}>
          <LanguageSwitcher />
        </Box>

        {/* Header */}
        <LogoSection>
          <Typography
            variant="h1"
            gutterBottom
            sx={{ color: "primary.main", fontWeight: 700 }}
          >
            Rawbank
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.8, fontWeight: 300 }}>
            Une banque portée par des valeurs fortes
          </Typography>
        </LogoSection>

        {/* Welcome Section */}
        <StyledCard>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <CheckCircle sx={{ fontSize: 64, color: "#FFCC00", mb: 2 }} />
              <Typography variant="h3" gutterBottom>
                Félicitations !
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Votre demande d'ouverture de compte a été soumise avec succès
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Avatar sx={{ bgcolor: "primary.main", width: 64, height: 64 }}>
                <Person fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {profile?.first_name && profile?.last_name
                    ? `${profile.first_name} ${profile.last_name}`
                    : user.email}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </StyledCard>

        {/* Account Information */}
        <StyledCard>
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
            >
              <AccountBalance color="primary" />
              Informations du Compte
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Stack spacing={3}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Numéro de demande:
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {application?.application_number}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Type de compte:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {application?.account_type
                    ? getAccountTypeLabel(application.account_type)
                    : "Non spécifié"}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Agence:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {application?.agency_id
                    ? getAgencyName(application.agency_id)
                    : "Non spécifiée"}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Statut:
                </Typography>
                <Chip
                  label={
                    application?.status
                      ? getStatusLabel(application.status)
                      : "Inconnu"
                  }
                  color={
                    application?.status
                      ? getStatusColor(application.status)
                      : "info"
                  }
                  size="medium"
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Date de soumission:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {application?.submitted_at
                    ? formatDate(application.submitted_at)
                    : "Non spécifiée"}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </StyledCard>

        {/* Personal Information */}
        <StyledCard>
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
            >
              <Person color="primary" />
              Informations Personnelles
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Stack spacing={3}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Civilité:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {profile?.civility
                    ? getCivilityLabel(profile.civility)
                    : "Non spécifiée"}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Nom complet:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {profile?.first_name && profile?.last_name
                    ? `${profile.first_name} ${
                        profile.middle_name ? profile.middle_name + " " : ""
                      }${profile.last_name}`
                    : "Non spécifié"}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Date de naissance:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {profile?.birth_date
                    ? formatDate(profile.birth_date)
                    : "Non spécifiée"}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Nationalité:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {profile?.nationality || "Non spécifiée"}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </StyledCard>

        {/* Contact Information */}
        <StyledCard>
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
            >
              <Phone color="primary" />
              Informations de Contact
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Stack spacing={3}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Phone color="primary" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Téléphone principal
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {profile?.phone_1 || "Non spécifié"}
                  </Typography>
                </Box>
              </Box>
              {profile?.phone_2 && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Phone color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Téléphone secondaire
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {profile.phone_2}
                    </Typography>
                  </Box>
                </Box>
              )}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Email color="primary" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Email principal
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {profile?.email_1 || user.email}
                  </Typography>
                </Box>
              </Box>
              {profile?.email_2 && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Email color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Email secondaire
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {profile.email_2}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Stack>
          </CardContent>
        </StyledCard>

        {/* Professional Information */}
        {profile?.profession && (
          <StyledCard>
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
              >
                <Work color="primary" />
                Informations Professionnelles
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Stack spacing={3}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    Profession:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {profile.profession}
                  </Typography>
                </Box>
                {profile.employer && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body1" color="text.secondary">
                      Employeur:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {profile.employer}
                    </Typography>
                  </Box>
                )}
                {profile.monthly_gross_income && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body1" color="text.secondary">
                      Revenus mensuels:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {profile.monthly_gross_income.toLocaleString()} CDF
                    </Typography>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </StyledCard>
        )}

        {/* Next Steps */}
        <StyledCard>
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
            >
              <Event color="primary" />
              Prochaines Étapes
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
                Prochaines étapes pour finaliser votre compte
              </Typography>

              <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
                1. Signature électronique
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, pl: 2 }}>
                Vous recevrez les détails de votre formulaire de demande par
                email à l'adresse que vous avez fournie. Ce document devra être
                signé via signature électronique avant de pouvoir procéder à
                l'étape suivante.
              </Typography>

              <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
                2. Planifiez un rendez-vous avec nous
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Pour finaliser votre processus d'ouverture de compte et
                récupérer votre carte bancaire, vous devez prendre rendez-vous
                avec notre équipe Rawbank.
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Documents requis :</strong> La pièce d'identité que vous
                avez téléchargée lors du processus de candidature.
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, color: "primary.main" }}
              >
                Durée estimée : environ 15 minutes
              </Typography>
            </Alert>
            <Box sx={{ textAlign: "center" }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<Event />}
                sx={{
                  backgroundColor: "#000000",
                  color: "#FFCC00",
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  "&:hover": {
                    backgroundColor: "#1a1a1a",
                  },
                }}
                onClick={() => {
                  // In a real app, this would open a calendar booking system
                  alert(
                    "Fonctionnalité de réservation à venir. Contactez Rawbank directement."
                  );
                }}
              >
                Planifier un Rendez-vous
              </Button>
            </Box>
          </CardContent>
        </StyledCard>

        {/* Actions */}
        <StyledCard>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="outlined"
                size="large"
                startIcon={<Logout />}
                onClick={handleSignOut}
                sx={{ px: 4 }}
              >
                {t("messages.signout")}
              </Button>
            </Box>
          </CardContent>
        </StyledCard>
      </Box>
    </ContentBox>
  );
};

export default UserDashboard;
