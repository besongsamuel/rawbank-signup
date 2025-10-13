import {
  Box,
  Card,
  CardContent,
  Skeleton,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 20,
  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
  maxWidth: 800,
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

interface SignupSkeletonProps {
  stepType?:
    | "step1"
    | "step2_id"
    | "step2_personal"
    | "step2_marital"
    | "step2_housing"
    | "step2_contact"
    | "step2_professional"
    | "step2_emergency"
    | "step2_bank"
    | "step2_package";
}

const SignupSkeleton: React.FC<SignupSkeletonProps> = ({
  stepType = "step1",
}) => {
  const renderStepSkeleton = () => {
    switch (stepType) {
      case "step1":
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Skeleton
              variant="text"
              width="60%"
              height={40}
              sx={{ mx: "auto" }}
            />
            <Skeleton
              variant="text"
              width="80%"
              height={24}
              sx={{ mx: "auto" }}
            />
            <Skeleton variant="rectangular" width="100%" height={56} />
            <Skeleton variant="rectangular" width="100%" height={56} />
            <Skeleton variant="rectangular" width="100%" height={56} />
            <Skeleton
              variant="rectangular"
              width="100%"
              height={48}
              sx={{ mt: 2 }}
            />
          </Box>
        );

      case "step2_id":
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Skeleton
              variant="text"
              width="50%"
              height={40}
              sx={{ mx: "auto" }}
            />
            <Skeleton
              variant="text"
              width="70%"
              height={24}
              sx={{ mx: "auto" }}
            />
            <Skeleton variant="rectangular" width="100%" height={56} />
            <Skeleton variant="rectangular" width="100%" height={200} />
            <Box sx={{ display: "flex", gap: 2 }}>
              <Skeleton variant="rectangular" width="50%" height={56} />
              <Skeleton variant="rectangular" width="50%" height={56} />
            </Box>
            <Skeleton variant="rectangular" width="100%" height={56} />
            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <Skeleton variant="rectangular" width="50%" height={48} />
              <Skeleton variant="rectangular" width="50%" height={48} />
            </Box>
          </Box>
        );

      case "step2_personal":
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Skeleton
              variant="text"
              width="60%"
              height={40}
              sx={{ mx: "auto" }}
            />
            <Skeleton
              variant="text"
              width="80%"
              height={24}
              sx={{ mx: "auto" }}
            />
            <Skeleton variant="rectangular" width="100%" height={56} />
            <Box sx={{ display: "flex", gap: 2 }}>
              <Skeleton variant="rectangular" width="33%" height={56} />
              <Skeleton variant="rectangular" width="33%" height={56} />
              <Skeleton variant="rectangular" width="33%" height={56} />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Skeleton variant="rectangular" width="50%" height={56} />
              <Skeleton variant="rectangular" width="50%" height={56} />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Skeleton variant="rectangular" width="33%" height={56} />
              <Skeleton variant="rectangular" width="33%" height={56} />
              <Skeleton variant="rectangular" width="33%" height={56} />
            </Box>
            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <Skeleton variant="rectangular" width="50%" height={48} />
              <Skeleton variant="rectangular" width="50%" height={48} />
            </Box>
          </Box>
        );

      default:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Skeleton
              variant="text"
              width="60%"
              height={40}
              sx={{ mx: "auto" }}
            />
            <Skeleton
              variant="text"
              width="80%"
              height={24}
              sx={{ mx: "auto" }}
            />
            <Skeleton variant="rectangular" width="100%" height={56} />
            <Skeleton variant="rectangular" width="100%" height={56} />
            <Skeleton variant="rectangular" width="100%" height={56} />
            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <Skeleton variant="rectangular" width="50%" height={48} />
              <Skeleton variant="rectangular" width="50%" height={48} />
            </Box>
          </Box>
        );
    }
  };

  return (
    <GradientBox>
      <StyledCard>
        <CardContent sx={{ p: 4 }}>
          {/* Progress Stepper Skeleton */}
          <Box sx={{ mb: 4 }}>
            <Stepper activeStep={stepType === "step1" ? 0 : 1} alternativeLabel>
              <Step>
                <StepLabel>
                  <Skeleton variant="text" width={80} height={20} />
                </StepLabel>
              </Step>
              <Step>
                <StepLabel>
                  <Skeleton variant="text" width={80} height={20} />
                </StepLabel>
              </Step>
              <Step>
                <StepLabel>
                  <Skeleton variant="text" width={80} height={20} />
                </StepLabel>
              </Step>
            </Stepper>
          </Box>

          {/* Content Skeleton */}
          {renderStepSkeleton()}
        </CardContent>
      </StyledCard>
    </GradientBox>
  );
};

export default SignupSkeleton;
