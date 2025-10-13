import { Email, Refresh } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

const ContentBox = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: "#FFFFFF",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 20,
  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
  maxWidth: 600,
  margin: "0 auto",
}));

const LogoSection = styled(Box)(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(4),
}));

const EmailVerification: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState<string>("");
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  // Get email from URL params or localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const emailParam = urlParams.get("email");

    if (emailParam) {
      setEmail(emailParam);
    } else {
      // Try to get email from localStorage (set during signup)
      const savedEmail = localStorage.getItem("signup_email");
      if (savedEmail) {
        setEmail(savedEmail);
      }
    }
  }, [location.search]);

  const handleResendEmail = useCallback(async () => {
    if (!email) return;

    setResending(true);
    setResendError(null);
    setResendSuccess(false);

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      });

      if (error) {
        setResendError(error.message);
      } else {
        setResendSuccess(true);
      }
    } catch (error) {
      setResendError(
        error instanceof Error ? error.message : "Une erreur s'est produite"
      );
    } finally {
      setResending(false);
    }
  }, [email]);

  // Check if user is verified by listening to auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user?.email_confirmed_at) {
        // User is verified, redirect to account selection
        navigate("/profile/account-selection");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Show loading if no email yet
  if (!email) {
    return (
      <ContentBox>
        <StyledCard>
          <CardContent sx={{ p: 4, textAlign: "center" }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Chargement...
            </Typography>
          </CardContent>
        </StyledCard>
      </ContentBox>
    );
  }

  return (
    <ContentBox>
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

          {/* Email Verification Content */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Email sx={{ fontSize: 80, color: "#FFCC00", mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Vérifiez votre adresse email
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Nous avons envoyé un lien de vérification à :
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "primary.main",
                backgroundColor: "#F8F9FA",
                padding: 2,
                borderRadius: 2,
                mb: 3,
              }}
            >
              {email}
            </Typography>
          </Box>

          {/* Instructions */}
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Instructions :</strong>
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              1. Vérifiez votre boîte de réception (et vos spams)
            </Typography>
            <Typography variant="body2">
              2. Cliquez sur le lien de vérification dans l'email
            </Typography>
            <Typography variant="body2">
              3. Revenez sur cette page pour continuer
            </Typography>
          </Alert>

          {/* Resend Email Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Vous n'avez pas reçu l'email ?
            </Typography>

            {resendSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Email de vérification renvoyé avec succès !
              </Alert>
            )}

            {resendError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {resendError}
              </Alert>
            )}

            <Button
              variant="outlined"
              onClick={handleResendEmail}
              disabled={resending}
              startIcon={
                resending ? <CircularProgress size={20} /> : <Refresh />
              }
              sx={{ width: "100%" }}
            >
              {resending ? "Envoi en cours..." : "Renvoyer l'email"}
            </Button>
          </Box>

          {/* Actions */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => navigate("/login")}
              sx={{
                backgroundColor: "#000000",
                color: "#FFCC00",
                "&:hover": {
                  backgroundColor: "#1a1a1a",
                },
              }}
            >
              J'ai vérifié mon email
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/login")}
              sx={{ width: "100%" }}
            >
              Se connecter avec un autre compte
            </Button>
          </Box>
        </CardContent>
      </StyledCard>
    </ContentBox>
  );
};

export default EmailVerification;
