import { Box, CircularProgress, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useUserProfile } from "../../hooks/useUserProfile";

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
  const { user, loading: authLoading } = useAuth();
  const { hasPersonalData, loading: profileLoading } = useUserProfile(user);

  // Show loading spinner while checking authentication
  if (authLoading || profileLoading) {
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

  // Redirect to email verification if email is not confirmed
  if (!user.email_confirmed_at) {
    return <Navigate to="/verify-email" replace />;
  }

  // If complete profile is required but user doesn't have it, redirect to complete-profile
  if (requireCompleteProfile && !hasPersonalData) {
    return <Navigate to="/complete-profile" replace />;
  }

  // User is authenticated and meets requirements, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
