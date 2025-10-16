import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useApplicationContext } from "../../contexts/ApplicationContext";
import { supabase } from "../../lib/supabase";

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 20,
  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
  maxWidth: 500,
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

interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const Signup: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, profile } = useApplicationContext();

  const [formData, setFormData] = useState<SignupFormData>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  // Redirect logged-in users
  useEffect(() => {
    if (user) {
      // Check if user has personal data (has essential fields filled)
      const hasPersonalData = Boolean(
        profile?.first_name &&
          profile?.last_name &&
          profile?.birth_date &&
          profile?.nationality &&
          profile?.id_number &&
          (profile?.phone_1 || profile?.email_1)
      );

      if (hasPersonalData) {
        navigate("/app");
      } else {
        navigate("/profile/id-card");
      }
    }
  }, [user, profile, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formData.email) {
      errors.email = t("errors.emailRequired");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = t("errors.emailInvalid");
    }

    if (!formData.password) {
      errors.password = t("errors.passwordRequired");
    } else if (formData.password.length < 8) {
      errors.password = t("errors.passwordMinLength");
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = t("errors.passwordsDoNotMatch");
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setLoading(true);
      setError("");

      try {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          setError(error.message);
        } else if (data.user) {
          // Save email to localStorage for email verification page
          localStorage.setItem("signup_email", formData.email);
          // Redirect to email verification
          navigate("/verify-email");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : t("errors.unknownError"));
      } finally {
        setLoading(false);
      }
    },
    [formData, navigate, t]
  );

  return (
    <GradientBox>
      <StyledCard>
        <CardContent sx={{ p: 4 }}>
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
              {t("auth.signup.title")}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t("auth.signup.subtitle")}
            </Typography>
          </Box>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                fullWidth
                label={t("auth.signup.email")}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={!!validationErrors.email}
                helperText={validationErrors.email}
                required
                placeholder="votre.email@exemple.com"
              />

              <TextField
                fullWidth
                label={t("auth.signup.password")}
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                error={!!validationErrors.password}
                helperText={validationErrors.password}
                required
                placeholder="Minimum 8 caractères"
              />

              <TextField
                fullWidth
                label={t("auth.signup.confirmPassword")}
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={!!validationErrors.confirmPassword}
                helperText={validationErrors.confirmPassword}
                required
                placeholder="Confirmez votre mot de passe"
              />

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
                ) : (
                  t("auth.signup.signupButton")
                )}
              </Button>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

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

export default Signup;
