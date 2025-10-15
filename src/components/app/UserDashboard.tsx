import {
  AccountBalance,
  CalendarToday,
  CreditCard,
  Email,
  Event,
  LocationOn,
  Logout,
  Person,
  Phone,
  Schedule,
} from "@mui/icons-material";
import {
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
import AppointmentBookingModal from "../modals/AppointmentBookingModal";
import ApplicationTimeline from "./ApplicationTimeline";

// Vector Illustrations
const SuccessIllustration: React.FC<{ size?: number }> = ({ size = 80 }) => (
  <Box sx={{ width: size, height: size, color: "#FFCC00" }}>
    <svg viewBox="0 0 100 100" fill="currentColor">
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        opacity="0.3"
      />
      <circle
        cx="50"
        cy="50"
        r="35"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.5"
      />
      <circle cx="50" cy="50" r="25" fill="currentColor" opacity="0.8" />
      <path
        d="M40 50 L47 57 L60 44"
        stroke="white"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </Box>
);

const AccountIllustration: React.FC<{ size?: number }> = ({ size = 60 }) => (
  <Box sx={{ width: size, height: size, color: "#000000" }}>
    <svg viewBox="0 0 100 100" fill="currentColor">
      <rect
        x="20"
        y="30"
        width="60"
        height="40"
        rx="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
      <rect
        x="25"
        y="35"
        width="50"
        height="30"
        rx="4"
        fill="#FFCC00"
        opacity="0.8"
      />
      <circle cx="35" cy="50" r="3" fill="currentColor" />
      <circle cx="45" cy="50" r="3" fill="currentColor" />
      <circle cx="55" cy="50" r="3" fill="currentColor" />
      <circle cx="65" cy="50" r="3" fill="currentColor" />
      <rect x="30" y="20" width="40" height="8" rx="4" fill="currentColor" />
    </svg>
  </Box>
);

const PersonalIllustration: React.FC<{ size?: number }> = ({ size = 60 }) => (
  <Box sx={{ width: size, height: size, color: "#FFCC00" }}>
    <svg viewBox="0 0 100 100" fill="currentColor">
      <circle cx="50" cy="35" r="15" fill="currentColor" />
      <path
        d="M25 75 Q25 55 50 55 Q75 55 75 75 L75 85 L25 85 Z"
        fill="currentColor"
      />
      <circle cx="40" cy="30" r="2" fill="white" />
      <circle cx="60" cy="30" r="2" fill="white" />
      <path
        d="M45 40 Q50 45 55 40"
        stroke="white"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  </Box>
);

const ContactIllustration: React.FC<{ size?: number }> = ({ size = 60 }) => (
  <Box sx={{ width: size, height: size, color: "#000000" }}>
    <svg viewBox="0 0 100 100" fill="currentColor">
      <rect
        x="20"
        y="20"
        width="60"
        height="40"
        rx="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
      <rect
        x="25"
        y="25"
        width="50"
        height="30"
        rx="4"
        fill="#FFCC00"
        opacity="0.8"
      />
      <circle cx="35" cy="35" r="2" fill="currentColor" />
      <circle cx="45" cy="35" r="2" fill="currentColor" />
      <circle cx="55" cy="35" r="2" fill="currentColor" />
      <circle cx="65" cy="35" r="2" fill="currentColor" />
      <rect x="30" y="45" width="40" height="4" rx="2" fill="currentColor" />
      <rect x="30" y="50" width="30" height="4" rx="2" fill="currentColor" />
      <circle cx="50" cy="70" r="8" fill="currentColor" />
      <path
        d="M45 70 L50 75 L55 70"
        stroke="white"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  </Box>
);

const ProfessionalIllustration: React.FC<{ size?: number }> = ({
  size = 60,
}) => (
  <Box sx={{ width: size, height: size, color: "#FFCC00" }}>
    <svg viewBox="0 0 100 100" fill="currentColor">
      <rect x="25" y="30" width="50" height="35" rx="4" fill="currentColor" />
      <rect x="30" y="35" width="40" height="25" rx="2" fill="white" />
      <rect x="35" y="40" width="30" height="3" rx="1" fill="currentColor" />
      <rect x="35" y="45" width="25" height="3" rx="1" fill="currentColor" />
      <rect x="35" y="50" width="20" height="3" rx="1" fill="currentColor" />
      <circle cx="50" cy="20" r="8" fill="currentColor" />
      <rect x="45" y="15" width="10" height="10" rx="2" fill="white" />
    </svg>
  </Box>
);

const FatcaIllustration: React.FC<{ size?: number }> = ({ size = 60 }) => (
  <Box sx={{ width: size, height: size, color: "#000000" }}>
    <svg viewBox="0 0 100 100" fill="currentColor">
      <rect
        x="20"
        y="20"
        width="60"
        height="60"
        rx="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
      <rect
        x="25"
        y="25"
        width="50"
        height="50"
        rx="4"
        fill="#FFCC00"
        opacity="0.8"
      />
      <text
        x="50"
        y="40"
        textAnchor="middle"
        fontSize="12"
        fill="currentColor"
        fontWeight="bold"
      >
        FATCA
      </text>
      <rect x="30" y="45" width="40" height="2" rx="1" fill="currentColor" />
      <rect x="30" y="50" width="35" height="2" rx="1" fill="currentColor" />
      <rect x="30" y="55" width="30" height="2" rx="1" fill="currentColor" />
      <rect x="30" y="60" width="25" height="2" rx="1" fill="currentColor" />
    </svg>
  </Box>
);

const PepIllustration: React.FC<{ size?: number }> = ({ size = 60 }) => (
  <Box sx={{ width: size, height: size, color: "#FFCC00" }}>
    <svg viewBox="0 0 100 100" fill="currentColor">
      <circle cx="50" cy="50" r="30" fill="currentColor" />
      <circle cx="50" cy="40" r="8" fill="white" />
      <rect x="35" y="50" width="30" height="15" rx="3" fill="white" />
      <rect x="40" y="55" width="20" height="3" rx="1" fill="currentColor" />
      <rect x="40" y="60" width="15" height="3" rx="1" fill="currentColor" />
      <path
        d="M30 30 L70 30 M30 70 L70 70"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.5"
      />
    </svg>
  </Box>
);

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
  const [showBookingModal, setShowBookingModal] = React.useState(false);
  const [appointment, setAppointment] = React.useState<{
    date: Date;
    time: string;
    agency: string;
  } | null>(null);
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

  const handleAppointmentConfirm = (appointmentData: {
    date: Date;
    time: string;
    agency: string;
  }) => {
    setAppointment(appointmentData);
    setShowBookingModal(false);
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

  const getCardTypeName = (cardType: string) => {
    const cards: Record<string, string> = {
      carte_fidelite_usd: "La carte Fidelité",
      carte_mosolo_cdf: "La carte Mosolo CDF",
      visa_debit_cdf: "La carte de débit Visa CDF",
      visa_infinite: "La carte de débit Visa Infinite",
      visa_academia: "La carte Visa Academia",
      visa_debit_euro: "La carte de débit Visa EURO",
      mastercard_travelers: "La Mastercard Traveler's",
      carte_virtuelle: "La carte virtuelle prépayée",
      visa_debit_upi: "La carte de débit UPI",
    };
    return cards[cardType] || cardType;
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

  const getAgencyAddress = (agencyId: string) => {
    const addresses: Record<string, string> = {
      kinshasa_center: "Avenue du 30 Juin, Kinshasa",
      kinshasa_gombe: "Boulevard du 30 Juin, Gombe",
      kinshasa_limete: "Avenue Kasa-Vubu, Limete",
      lubumbashi_center: "Avenue Kasongo, Lubumbashi",
      lubumbashi_katanga: "Boulevard Kamalondo, Lubumbashi",
      goma_center: "Avenue de la Paix, Goma",
      bukavu_center: "Avenue de l'Indépendance, Bukavu",
      matadi_center: "Avenue du Port, Matadi",
    };
    return addresses[agencyId] || "Adresse non disponible";
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
              <SuccessIllustration size={100} />
              <Typography variant="h3" gutterBottom sx={{ mt: 2 }}>
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

        {/* Application Timeline */}
        {application && (
          <StyledCard>
            <CardContent sx={{ p: 4 }}>
              <ApplicationTimeline status={application.status} />
            </CardContent>
          </StyledCard>
        )}

        {/* Next Steps */}
        <StyledCard>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Event sx={{ fontSize: 32, color: "#FFCC00" }} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Prochaines Étapes
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  color: "#000000",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    backgroundColor: "#FFCC00",
                    color: "#000000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                  }}
                >
                  1
                </Box>
                Rendez-vous en agence
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 2,
                  pl: 5,
                  lineHeight: 1.6,
                  color: "#333333",
                }}
              >
                Pour finaliser votre demande et récupérer votre carte bancaire,
                prenez rendez-vous avec notre équipe dans votre agence
                sélectionnée.
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  pl: 5,
                  color: "#666666",
                  fontStyle: "italic",
                }}
              >
                Documents requis : Pièce d'identité • Durée : 15 minutes
              </Typography>
            </Box>
            {/* Action Buttons */}
            <Stack spacing={2} sx={{ mt: 4 }}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<Event />}
                sx={{
                  backgroundColor: "#000000",
                  color: "#FFCC00",
                  py: 2,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: "#1a1a1a",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
                  },
                  transition: "all 0.3s ease",
                }}
                onClick={() => setShowBookingModal(true)}
              >
                📅 Réserver Mon Rendez-vous Maintenant
              </Button>
            </Stack>

            {/* Appointment Details */}
            {appointment && (
              <Box
                sx={{
                  mt: 4,
                  p: 3,
                  backgroundColor: "rgba(0, 255, 0, 0.1)",
                  borderRadius: 2,
                  border: "1px solid rgba(0, 255, 0, 0.3)",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: "#2E7D32",
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  ✅ Rendez-vous Confirmé
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CalendarToday sx={{ color: "#2E7D32", fontSize: 20 }} />
                    <Typography variant="body1">
                      <strong>Date :</strong>{" "}
                      {appointment.date.toLocaleDateString("fr-FR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Schedule sx={{ color: "#2E7D32", fontSize: 20 }} />
                    <Typography variant="body1">
                      <strong>Heure :</strong> {appointment.time}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LocationOn sx={{ color: "#2E7D32", fontSize: 20 }} />
                    <Typography variant="body1">
                      <strong>Lieu :</strong> {appointment.agency}
                    </Typography>
                  </Box>
                </Stack>
                <Typography
                  variant="body2"
                  sx={{
                    mt: 2,
                    p: 2,
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                    borderRadius: 1,
                    color: "#2E7D32",
                    fontWeight: 500,
                  }}
                >
                  💡 <strong>Rappel :</strong> N'oubliez pas d'apporter votre
                  pièce d'identité le jour du rendez-vous.
                </Typography>
              </Box>
            )}
          </CardContent>
        </StyledCard>

        {/* Account Information */}
        <StyledCard>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <AccountIllustration size={50} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Informations du Compte
              </Typography>
            </Box>
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
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AccountBalance sx={{ fontSize: 20, color: "#FFCC00" }} />
                  <Typography variant="body1" color="text.secondary">
                    Type de compte:
                  </Typography>
                </Box>
                <Chip
                  icon={<AccountBalance sx={{ fontSize: 16 }} />}
                  label={
                    application?.account_type
                      ? getAccountTypeLabel(application.account_type)
                      : "Non spécifié"
                  }
                  size="small"
                  sx={{
                    backgroundColor: "rgba(255, 204, 0, 0.1)",
                    color: "#000000",
                    fontWeight: 600,
                    border: "1px solid rgba(255, 204, 0, 0.3)",
                    "& .MuiChip-icon": {
                      color: "#FFCC00",
                    },
                  }}
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
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CreditCard sx={{ fontSize: 20, color: "#000000" }} />
                  <Typography variant="body1" color="text.secondary">
                    Carte bancaire:
                  </Typography>
                </Box>
                <Chip
                  icon={<CreditCard sx={{ fontSize: 16 }} />}
                  label={
                    application?.card_type
                      ? getCardTypeName(application.card_type)
                      : "Non sélectionnée"
                  }
                  size="small"
                  sx={{
                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                    color: "#000000",
                    fontWeight: 600,
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                    "& .MuiChip-icon": {
                      color: "#000000",
                    },
                  }}
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <PersonalIllustration size={50} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Informations Personnelles
              </Typography>
            </Box>
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <ContactIllustration size={50} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Informations de Contact
              </Typography>
            </Box>
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
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
              >
                <ProfessionalIllustration size={50} />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Informations Professionnelles
                </Typography>
              </Box>
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

        {/* FATCA Information */}
        {profile?.fatca_data && (
          <StyledCard>
            <CardContent sx={{ p: 4 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
              >
                <FatcaIllustration size={50} />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Déclaration FATCA
                </Typography>
              </Box>
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
                    Personne américaine:
                  </Typography>
                  <Chip
                    label={profile.fatca_data.isUSPerson ? "Oui" : "Non"}
                    color={
                      profile.fatca_data.isUSPerson ? "warning" : "success"
                    }
                    size="medium"
                  />
                </Box>
                {profile.fatca_data.isUSPerson && (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body1" color="text.secondary">
                        Citoyenneté américaine:
                      </Typography>
                      <Chip
                        label={profile.fatca_data.usCitizenship ? "Oui" : "Non"}
                        color={
                          profile.fatca_data.usCitizenship
                            ? "warning"
                            : "success"
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
                        Lieu de naissance aux USA:
                      </Typography>
                      <Chip
                        label={profile.fatca_data.usBirthPlace ? "Oui" : "Non"}
                        color={
                          profile.fatca_data.usBirthPlace
                            ? "warning"
                            : "success"
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
                        Résidence aux USA:
                      </Typography>
                      <Chip
                        label={profile.fatca_data.usResidence ? "Oui" : "Non"}
                        color={
                          profile.fatca_data.usResidence ? "warning" : "success"
                        }
                        size="medium"
                      />
                    </Box>
                    {profile.fatca_data.usTin && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="body1" color="text.secondary">
                          TIN américain:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {profile.fatca_data.usTin}
                        </Typography>
                      </Box>
                    )}
                  </>
                )}
              </Stack>
            </CardContent>
          </StyledCard>
        )}

        {/* PEP Information */}
        {profile?.pep_data && (
          <StyledCard>
            <CardContent sx={{ p: 4 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
              >
                <PepIllustration size={50} />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Déclaration PEP (Personne Politiquement Exposée)
                </Typography>
              </Box>
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
                    Personne politiquement exposée:
                  </Typography>
                  <Chip
                    label={profile.pep_data.isPep ? "Oui" : "Non"}
                    color={profile.pep_data.isPep ? "warning" : "success"}
                    size="medium"
                  />
                </Box>
                {profile.pep_data.isPep && (
                  <>
                    {profile.pep_data.pepCategory && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="body1" color="text.secondary">
                          Catégorie PEP:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {profile.pep_data.pepCategory
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </Typography>
                      </Box>
                    )}
                    {profile.pep_data.position && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="body1" color="text.secondary">
                          Position:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {profile.pep_data.position}
                        </Typography>
                      </Box>
                    )}
                    {profile.pep_data.organization && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="body1" color="text.secondary">
                          Organisation:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {profile.pep_data.organization}
                        </Typography>
                      </Box>
                    )}
                    {profile.pep_data.country && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="body1" color="text.secondary">
                          Pays:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {profile.pep_data.country}
                        </Typography>
                      </Box>
                    )}
                    {profile.pep_data.startDate && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="body1" color="text.secondary">
                          Date de début:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {new Date(
                            profile.pep_data.startDate
                          ).toLocaleDateString("fr-FR")}
                        </Typography>
                      </Box>
                    )}
                    {profile.pep_data.endDate && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="body1" color="text.secondary">
                          Date de fin:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {new Date(
                            profile.pep_data.endDate
                          ).toLocaleDateString("fr-FR")}
                        </Typography>
                      </Box>
                    )}
                    {profile.pep_data.relationshipToPep && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="body1" color="text.secondary">
                          Relation avec PEP:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {profile.pep_data.relationshipToPep}
                        </Typography>
                      </Box>
                    )}
                    {profile.pep_data.pepName && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="body1" color="text.secondary">
                          Nom de la PEP:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {profile.pep_data.pepName}
                        </Typography>
                      </Box>
                    )}
                  </>
                )}
              </Stack>
            </CardContent>
          </StyledCard>
        )}

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

      {/* Appointment Booking Modal */}
      <AppointmentBookingModal
        open={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onConfirm={handleAppointmentConfirm}
        agencyName={getAgencyName(application?.agency_id || "")}
        agencyAddress={getAgencyAddress(application?.agency_id || "")}
      />
    </ContentBox>
  );
};

export default UserDashboard;
