import { Box, CircularProgress, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { Navigate } from "react-router-dom";
import { useApplicationContext } from "../../contexts/ApplicationContext";

const LoadingBox = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
}));

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireCompleteProfile?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireCompleteProfile = false,
}) => {
  const { user, profile, application, loading } = useApplicationContext();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <LoadingBox>
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={60} sx={{ color: "white" }} />
          <Typography variant="h6" sx={{ mt: 2, color: "white" }}>
            Checking authentication...
          </Typography>
        </Box>
      </LoadingBox>
    );
  }

  // Redirect to login if user is not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has personal data (has essential fields filled)
  const hasPersonalData = Boolean(
    profile?.first_name &&
      profile?.last_name &&
      profile?.birth_date &&
      profile?.nationality &&
      profile?.id_number &&
      (profile?.phone_1 || profile?.email_1)
  );

  // Check if user has a submitted application
  const hasSubmittedApplication = Boolean(
    application?.status === "submitted" ||
      application?.status === "under_review" ||
      application?.status === "approved"
  );

  // If complete profile is required but user doesn't have it AND hasn't submitted application, redirect to account selection
  if (requireCompleteProfile && !hasPersonalData && !hasSubmittedApplication) {
    return <Navigate to="/profile/account-selection" replace />;
  }

  // User is authenticated and meets requirements, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
