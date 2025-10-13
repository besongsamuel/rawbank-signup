import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Link as MuiLink,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useUserProfile } from "../../hooks/useUserProfile";

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

interface SigninFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const SigninForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    user,
    signIn,
    loading: authLoading,
    error: authError,
    clearError,
  } = useAuth();
  const { hasPersonalData } = useUserProfile(user);

  const [formData, setFormData] = useState<SigninFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      clearError();

      try {
        const { error } = await signIn(formData.email, formData.password);

        if (error) {
          // Error is handled by the auth hook
          return;
        }

        // Success - redirect logic will be handled by useEffect
      } catch (err) {
        console.error("Signin error:", err);
      } finally {
        setLoading(false);
      }
    },
    [formData, signIn, clearError]
  );

  // Handle redirects based on user state
  useEffect(() => {
    if (user && !authLoading) {
      console.log("User logged in:", user.email);
      console.log("Has personal data:", hasPersonalData);

      if (hasPersonalData) {
        // User has complete profile - redirect to app
        console.log("Redirecting to /app");
        navigate("/app");
      } else {
        // User exists but no personal data - redirect to complete-profile (which redirects to id-card)
        console.log("Redirecting to /profile/id-card");
        navigate("/profile/id-card");
      }
    }
  }, [user, authLoading, hasPersonalData, navigate]);

  return (
    <GradientBox>
      <StyledCard>
        <CardContent sx={{ p: 4 }}>
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
              {t("auth.signin.title")}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t("auth.signin.subtitle")}
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                fullWidth
                label={t("auth.signin.email")}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="votre.email@exemple.com"
              />

              <TextField
                fullWidth
                label={t("auth.signin.password")}
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Votre mot de passe"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                  />
                }
                label={t("auth.signin.rememberMe")}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading || authLoading}
                fullWidth
                sx={{ mt: 2 }}
              >
                {loading || authLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  t("auth.signin.signinButton")
                )}
              </Button>

              <Box sx={{ textAlign: "center", mt: 2 }}>
                <MuiLink
                  component="button"
                  type="button"
                  onClick={() => {
                    // Handle forgot password
                    alert("Forgot password functionality will be implemented");
                  }}
                  sx={{ textDecoration: "underline" }}
                >
                  {t("auth.signin.forgotPassword")}
                </MuiLink>
              </Box>
            </Box>
          </Box>

          {authError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {authError}
            </Alert>
          )}

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              {t("auth.signin.noAccount")}{" "}
              <MuiLink
                component={Link}
                to="/signup"
                sx={{ textDecoration: "underline" }}
              >
                {t("auth.signin.signupLink")}
              </MuiLink>
            </Typography>
          </Box>
        </CardContent>
      </StyledCard>
    </GradientBox>
  );
};

export default SigninForm;
