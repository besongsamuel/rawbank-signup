import { CalendarToday, Email, Logout, Person } from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useUserProfile } from "../../hooks/useUserProfile";
import LanguageSwitcher from "../common/LanguageSwitcher";

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 20,
  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
  maxWidth: 600,
  margin: "0 auto",
}));

const GradientBox = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: "#FFFFFF", // Clean Apple-like white background
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
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
    loading: profileLoading,
    hasPersonalData,
    refreshProfile,
  } = useUserProfile(user);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const handleCompleteProfile = () => {
    navigate("/profile/id-card");
  };

  if (authLoading || profileLoading) {
    return (
      <GradientBox>
        <StyledCard>
          <CardContent sx={{ p: 4, textAlign: "center" }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              {t("common.loading")}
            </Typography>
          </CardContent>
        </StyledCard>
      </GradientBox>
    );
  }

  // User is guaranteed to be logged in due to ProtectedRoute
  if (!user) {
    return null; // This should never happen due to ProtectedRoute
  }

  return (
    <GradientBox>
      <StyledCard>
        <CardContent sx={{ p: 4 }}>
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

          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h2" gutterBottom>
              {t("messages.welcome")}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t("messages.connectedAs")}
            </Typography>
          </Box>

          {/* User Info */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
                <Person fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h6">
                  {profile?.first_name && profile?.last_name
                    ? `${profile.first_name} ${profile.last_name}`
                    : user.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
            </Box>

            <Divider />

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Email color="primary" />
              <Typography variant="body1">
                <strong>{t("auth.signin.email")}:</strong> {user.email}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <CalendarToday color="primary" />
              <Typography variant="body1">
                <strong>{t("auth.signup.title")}:</strong>{" "}
                {new Date(user.created_at).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>

          {/* Profile Status */}
          {!hasPersonalData && (
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                {t("messages.emailVerification")}
              </Typography>
            </Alert>
          )}

          {/* Actions */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {!hasPersonalData && (
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleCompleteProfile}
                sx={{ mb: 2 }}
              >
                {t("common.continue")} - {t("steps.step2_personal")}
              </Button>
            )}

            <Button
              variant="outlined"
              size="large"
              fullWidth
              startIcon={<Logout />}
              onClick={handleSignOut}
            >
              {t("messages.signout")}
            </Button>
          </Box>
        </CardContent>
      </StyledCard>
    </GradientBox>
  );
};

export default UserDashboard;
