import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApplicationContext } from "../../contexts/ApplicationContext";
import { supabase } from "../../lib/supabase";
import TrustSignals from "../common/TrustSignals";

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 20,
  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
  maxWidth: 500,
  margin: "auto",
}));

const ContentBox = styled(Box)(({ theme }) => ({
  minHeight: "100%",
  background: "#FFFFFF",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
}));

const LogoSection = styled(Box)(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(4),
}));

type LoginMethod = "email" | "phone";

const SigninForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useApplicationContext();
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);

  // Check for authentication errors from URL parameters (from magic link callback)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const errorParam = params.get("error");

    if (errorParam) {
      const errorMessage = decodeURIComponent(errorParam);
      console.error("Authentication error:", errorMessage);
      setError(errorMessage);

      // Clean up URL by removing error parameters
      navigate("/login", { replace: true });
    }
  }, [location.search, navigate]);
  // Redirect if already logged in
  useEffect(() => {
    const checkUserAndRedirect = async () => {
      if (user && !authLoading) {
        try {
          // Check if user has personal_data
          const { data: personalData, error } = await supabase
            .from("personal_data")
            .select("id")
            .eq("id", user.id)
            .single();

          if (error && error.code !== "PGRST116") {
            console.error("Error checking personal data:", error);
            return;
          }

          // If no personal data exists, go to profile completion
          if (!personalData) {
            navigate("/profile/account-selection", { replace: true });
          } else {
            // Check if they have a submitted application
            const { data: application } = await supabase
              .from("applications")
              .select("status")
              .eq("user_id", user.id)
              .eq("status", "submitted")
              .single();

            if (application) {
              navigate("/app", { replace: true });
            } else {
              navigate("/profile/account-selection", { replace: true });
            }
          }
        } catch (error) {
          console.error("Error during redirect check:", error);
        }
      }
    };

    checkUserAndRedirect();
  }, [user, authLoading, navigate]);

  const handleSendMagicLink = useCallback(async () => {
    if (!email) {
      setError("Veuillez entrer votre adresse email");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/callback`,
        },
      });

      if (error) throw error;

      setSuccess(
        "Un lien magique a été envoyé à votre email. Veuillez vérifier votre boîte de réception."
      );
    } catch (error: any) {
      setError(error.message || "Erreur lors de l'envoi du lien magique");
    } finally {
      setLoading(false);
    }
  }, [email]);

  const handleSendOTP = useCallback(async () => {
    if (!phone) {
      setError("Veuillez entrer votre numéro de téléphone");
      return;
    }

    // Format phone number for Supabase (must start with country code)
    const formattedPhone = phone.startsWith("+") ? phone : `+243${phone}`;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) throw error;

      setOtpSent(true);
      setSuccess("Un code OTP a été envoyé à votre téléphone");
    } catch (error: any) {
      setError(error.message || "Erreur lors de l'envoi du code OTP");
    } finally {
      setLoading(false);
    }
  }, [phone]);

  const handleVerifyOTP = useCallback(async () => {
    if (!otp || otp.length !== 6) {
      setError("Veuillez entrer un code OTP valide à 6 chiffres");
      return;
    }

    const formattedPhone = phone.startsWith("+") ? phone : `+243${phone}`;

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: "sms",
      });

      if (error) throw error;

      // Success! The auth state will update and useEffect will handle redirect
      setSuccess("Connexion réussie!");
    } catch (error: any) {
      setError(error.message || "Code OTP invalide");
    } finally {
      setLoading(false);
    }
  }, [phone, otp]);

  if (authLoading) {
    return (
      <ContentBox>
        <CircularProgress />
      </ContentBox>
    );
  }

  return (
    <ContentBox sx={{ margin: "auto" }}>
      <Box sx={{ width: "100%", maxWidth: 600 }}>
        <StyledCard>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            {/* Logo Section */}
            <LogoSection>
              <Typography
                variant="h2"
                gutterBottom
                sx={{ color: "primary.main", fontWeight: 700 }}
              >
                Rawbank
              </Typography>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: 600, color: "#000000" }}
              >
                Connexion / Inscription
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Connectez-vous à votre compte existant ou créez un nouveau
                compte
              </Typography>
            </LogoSection>

            {/* Tab Selection */}
            <Tabs
              value={loginMethod}
              onChange={(_, newValue) => {
                setLoginMethod(newValue);
                setError(null);
                setSuccess(null);
                setOtpSent(false);
              }}
              centered
              sx={{ mb: 3 }}
            >
              <Tab label="Email" value="email" />
              <Tab label="SMS" value="phone" />
            </Tabs>

            {/* Error/Success Messages */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            {/* Email Login Form */}
            {loginMethod === "email" && (
              <Box
                component="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMagicLink();
                }}
              >
                <TextField
                  fullWidth
                  label="Adresse email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemple@email.com"
                  disabled={loading}
                  sx={{ mb: 3 }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleSendMagicLink}
                  disabled={loading}
                  sx={{
                    backgroundColor: "#000000",
                    color: "#FFCC00",
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: "#1a1a1a",
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: "#FFCC00" }} />
                  ) : (
                    "Se connecter / S'inscrire"
                  )}
                </Button>
              </Box>
            )}

            {/* Phone Login Form */}
            {loginMethod === "phone" && !otpSent && (
              <Box
                component="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendOTP();
                }}
              >
                <TextField
                  fullWidth
                  label="Numéro de téléphone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+243 XXX XXX XXX"
                  helperText="Format: +243XXXXXXXXX ou 0XXXXXXXXX"
                  disabled={loading}
                  sx={{ mb: 3 }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleSendOTP}
                  disabled={loading}
                  sx={{
                    backgroundColor: "#000000",
                    color: "#FFCC00",
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: "#1a1a1a",
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: "#FFCC00" }} />
                  ) : (
                    "Se connecter / S'inscrire"
                  )}
                </Button>
              </Box>
            )}

            {/* OTP Verification Form */}
            {loginMethod === "phone" && otpSent && (
              <Box
                component="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleVerifyOTP();
                }}
              >
                <TextField
                  fullWidth
                  label="Code OTP"
                  type="text"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="000000"
                  helperText="Entrez le code à 6 chiffres reçu par SMS"
                  disabled={loading}
                  inputProps={{ maxLength: 6, pattern: "[0-9]*" }}
                  sx={{ mb: 2 }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleVerifyOTP}
                  disabled={loading || otp.length !== 6}
                  sx={{
                    backgroundColor: "#000000",
                    color: "#FFCC00",
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: 600,
                    mb: 2,
                    "&:hover": {
                      backgroundColor: "#1a1a1a",
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: "#FFCC00" }} />
                  ) : (
                    "Vérifier le code"
                  )}
                </Button>
                <Button
                  fullWidth
                  variant="text"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp("");
                    setError(null);
                  }}
                  disabled={loading}
                >
                  Renvoyer le code
                </Button>
              </Box>
            )}

            {/* Additional Info */}
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Nouveau client ?</strong> Entrez votre email ou
                téléphone pour créer votre compte automatiquement.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                <strong>Client existant ?</strong> Utilisez les mêmes
                informations pour vous connecter.
              </Typography>
            </Box>
          </CardContent>
        </StyledCard>

        {/* Trust Signals */}
        <Box sx={{ mt: 3 }}>
          <TrustSignals />
        </Box>
      </Box>
    </ContentBox>
  );
};

export default SigninForm;
