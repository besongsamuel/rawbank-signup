import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { SignupStep1Data } from "../../types/signup";
import LanguageSwitcher from "../common/LanguageSwitcher";

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 20,
  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
  maxWidth: 600,
  margin: "0 auto",
}));

const GradientBox = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
}));

interface SignupStep1Props {
  data: SignupStep1Data;
  errors: Record<string, string | undefined>;
  loading: boolean;
  onDataChange: (data: Partial<SignupStep1Data>) => void;
  onSubmit: () => void;
  isLoggedIn?: boolean;
}

const steps = [
  "Informations de connexion",
  "Pièce d'identité",
  "Données personnelles",
  "Situation familiale",
  "Informations de logement",
  "Coordonnées",
  "Informations professionnelles",
  "Contact d'urgence",
  "Sélection de la banque",
  "Choix du package",
];

const SignupStep1: React.FC<SignupStep1Props> = ({
  data,
  errors,
  loading,
  onDataChange,
  onSubmit,
  isLoggedIn = false,
}) => {
  const { t } = useTranslation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onDataChange({ [name]: value });
  };

  return (
    <GradientBox>
      <StyledCard>
        <CardContent sx={{ p: 4 }}>
          {/* Progress Stepper */}
          <Box sx={{ mb: 4 }}>
            <Stepper activeStep={0} alternativeLabel>
              <Step>
                <StepLabel>Connexion</StepLabel>
              </Step>
              <Step>
                <StepLabel>Profil</StepLabel>
              </Step>
            </Stepper>
          </Box>

          {/* Language Switcher */}
          <Box sx={{ position: "absolute", top: 16, right: 16 }}>
            <LanguageSwitcher />
          </Box>

          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h2" gutterBottom>
              {t("auth.signup.title")}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t("auth.signup.subtitle")}
            </Typography>
          </Box>

          {/* Form */}
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {isLoggedIn ? (
                // Show logged-in user info
                <Box sx={{ textAlign: "center", mb: 2 }}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {t("messages.welcome")}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {t("messages.connectedAs")} {data.email}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    {t("messages.emailVerification")}
                  </Typography>
                </Box>
              ) : (
                // Show signup form for new users
                <>
                  <TextField
                    fullWidth
                    label={t("auth.signup.email")}
                    name="email"
                    type="email"
                    value={data.email}
                    onChange={handleInputChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    required
                    placeholder="votre.email@exemple.com"
                  />

                  <TextField
                    fullWidth
                    label={t("auth.signup.password")}
                    name="password"
                    type="password"
                    value={data.password}
                    onChange={handleInputChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    required
                    placeholder="Minimum 8 caractères"
                  />

                  <TextField
                    fullWidth
                    label={t("auth.signup.confirmPassword")}
                    name="confirmPassword"
                    type="password"
                    value={data.confirmPassword}
                    onChange={handleInputChange}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    required
                    placeholder="Confirmez votre mot de passe"
                  />
                </>
              )}

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                fullWidth
                sx={{ mt: 2 }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : isLoggedIn ? (
                  t("steps.step2_id")
                ) : (
                  t("common.continue")
                )}
              </Button>
            </Box>
          </Box>

          {/* Info */}
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              {t("auth.signup.terms")}{" "}
              <Button
                variant="text"
                size="small"
                onClick={() => alert("Conditions d'utilisation")}
                sx={{ p: 0, minWidth: "auto", textDecoration: "underline" }}
              >
                {t("auth.signup.termsLink")}
              </Button>{" "}
              {t("auth.signup.and")}{" "}
              <Button
                variant="text"
                size="small"
                onClick={() => alert("Politique de confidentialité")}
                sx={{ p: 0, minWidth: "auto", textDecoration: "underline" }}
              >
                {t("auth.signup.privacyLink")}
              </Button>
            </Typography>
          </Box>

          {/* Signin Link */}
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              {t("auth.signup.hasAccount")}{" "}
              <Button
                component={Link}
                to="/login"
                variant="text"
                size="small"
                sx={{ p: 0, minWidth: "auto", textDecoration: "underline" }}
              >
                {t("auth.signup.signinLink")}
              </Button>
            </Typography>
          </Box>
        </CardContent>
      </StyledCard>
    </GradientBox>
  );
};

export default SignupStep1;
