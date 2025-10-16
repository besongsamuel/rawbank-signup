import { Box, CircularProgress, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApplicationContext } from "../../contexts/ApplicationContext";
import { supabase } from "../../lib/supabase";

const LoadingBox = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
}));

const MagicLinkCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useApplicationContext();

  useEffect(() => {
    const handleMagicLinkCallback = async () => {
      try {
        // Check for authentication errors in URL parameters
        const params = new URLSearchParams(location.search);
        const errorParam = params.get("error");
        const errorDesc = params.get("error_description");

        if (errorParam) {
          // There's an authentication error
          const errorMessage = errorDesc || errorParam;
          console.error("Magic link auth error:", errorMessage);

          // Redirect to login with error parameters
          navigate(`/login?error=${encodeURIComponent(errorMessage)}`, {
            replace: true,
          });
          return;
        }

        // Wait for auth state to be determined
        if (authLoading) {
          return;
        }

        if (user) {
          // User is authenticated, check if they have personal data
          try {
            const { data: personalData, error } = await supabase
              .from("personal_data")
              .select("id")
              .eq("id", user.id)
              .single();

            if (error && error.code !== "PGRST116") {
              console.error("Error checking personal data:", error);
              navigate("/login?error=Database error", { replace: true });
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
            navigate("/login?error=Authentication error", { replace: true });
          }
        } else {
          // User is not authenticated, redirect to login
          navigate("/login", { replace: true });
        }
      } catch (error) {
        console.error("Error in magic link callback:", error);
        navigate("/login?error=Unexpected error", { replace: true });
      }
    };

    handleMagicLinkCallback();
  }, [location.search, navigate, user, authLoading]);

  // Show loading while processing
  return (
    <LoadingBox>
      <Box sx={{ textAlign: "center" }}>
        <CircularProgress size={60} sx={{ color: "white" }} />
        <Typography variant="h6" sx={{ mt: 2, color: "white" }}>
          Processing authentication...
        </Typography>
      </Box>
    </LoadingBox>
  );
};

export default MagicLinkCallback;
