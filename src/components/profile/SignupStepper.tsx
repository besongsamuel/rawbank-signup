import { Check } from "@mui/icons-material";
import {
  Box,
  Step,
  StepConnector,
  StepIconProps,
  StepLabel,
  Stepper,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import { SignupStep } from "../../types/signup";

// Custom step icon component
const QontoStepIconRoot = styled("div")<{ ownerState: { active?: boolean } }>(
  ({ theme, ownerState }) => ({
    color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
    display: "flex",
    height: 22,
    alignItems: "center",
    ...(ownerState.active && {
      color: "#FFCC00", // Rawbank yellow
    }),
    "& .QontoStepIcon-completedIcon": {
      color: "#FFCC00", // Rawbank yellow
      zIndex: 1,
      fontSize: 18,
    },
    "& .QontoStepIcon-circle": {
      width: 8,
      height: 8,
      borderRadius: "50%",
      backgroundColor: "currentColor",
    },
  })
);

function QontoStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

// Custom connector
const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.MuiStepConnector-alternativeLabel`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.MuiStepConnector-active`]: {
    [`& .line`]: {
      borderColor: "#FFCC00", // Rawbank yellow
    },
  },
  [`&.MuiStepConnector-completed`]: {
    [`& .line`]: {
      borderColor: "#FFCC00", // Rawbank yellow
    },
  },
  [`& .line`]: {
    borderColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

interface SignupStepperProps {
  currentStep: SignupStep;
  onStepClick?: (step: SignupStep) => void;
}

const SignupStepper: React.FC<SignupStepperProps> = ({
  currentStep,
  onStepClick,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Define all steps in order (merged steps)
  const steps = [
    { key: "step2_account", label: "Compte & Agence", shortLabel: "Compte" },
    {
      key: "step2_id_identity",
      label: "Identité & Document",
      shortLabel: "Identité",
    },
    {
      key: "step2_marital_housing",
      label: "Famille & Logement",
      shortLabel: "Famille",
    },
    {
      key: "step2_contact_emergency",
      label: "Contacts",
      shortLabel: "Contacts",
    },
    { key: "step2_professional", label: "Professionnel", shortLabel: "Pro" },
    { key: "step2_fatca", label: "FATCA", shortLabel: "FATCA" },
    { key: "step2_pep", label: "PPE", shortLabel: "PPE" },
    { key: "step2_review", label: "Révision", shortLabel: "Révision" },
  ];

  // Find current step index
  const activeStep = steps.findIndex((step) => step.key === currentStep);

  // Determine which steps are completed
  const getStepProps = (stepIndex: number) => {
    // All steps before current step are completed
    if (stepIndex < activeStep) {
      return { completed: true };
    }

    // Current step is active
    if (stepIndex === activeStep) {
      return { active: true };
    }

    // Future steps are not completed
    return { completed: false };
  };

  // For mobile, show a simplified progress indicator
  if (isMobile) {
    const currentStepData = steps[activeStep];
    const progressPercentage = ((activeStep + 1) / steps.length) * 100;

    return (
      <Box sx={{ width: "100%", mb: 3 }}>
        {/* Mobile Progress Header */}
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "#000000", mb: 1 }}
          >
            Étape {activeStep + 1} sur {steps.length}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {currentStepData?.label}
          </Typography>
        </Box>

        {/* Mobile Progress Bar */}
        <Box
          sx={{
            width: "100%",
            height: 8,
            backgroundColor: "#eaeaf0",
            borderRadius: 4,
            overflow: "hidden",
            mb: 2,
          }}
        >
          <Box
            sx={{
              width: `${progressPercentage}%`,
              height: "100%",
              backgroundColor: "#FFCC00",
              borderRadius: 4,
              transition: "width 0.3s ease",
            }}
          />
        </Box>

        {/* Mobile Step Indicators */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 1,
          }}
        >
          {steps.map((step, index) => (
            <Box
              key={step.key}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flex: 1,
                minWidth: 0,
                cursor:
                  index <= activeStep && onStepClick ? "pointer" : "default",
                opacity: index <= activeStep ? 1 : 0.6,
                transition: "all 0.2s ease",
                "&:hover":
                  index <= activeStep && onStepClick
                    ? {
                        transform: "scale(1.05)",
                        opacity: 1,
                      }
                    : {},
              }}
              onClick={() => {
                if (index <= activeStep && onStepClick) {
                  onStepClick(step.key as SignupStep);
                }
              }}
            >
              <Box
                sx={{
                  width: isSmallMobile ? 20 : 24,
                  height: isSmallMobile ? 20 : 24,
                  borderRadius: "50%",
                  backgroundColor: index <= activeStep ? "#FFCC00" : "#eaeaf0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 0.5,
                  transition: "all 0.3s ease",
                }}
              >
                {index < activeStep ? (
                  <Check
                    sx={{ fontSize: isSmallMobile ? 12 : 14, color: "#000000" }}
                  />
                ) : (
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: isSmallMobile ? 8 : 10,
                      fontWeight: 600,
                      color: index === activeStep ? "#000000" : "#666666",
                    }}
                  >
                    {index + 1}
                  </Typography>
                )}
              </Box>
              {!isSmallMobile && (
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: 8,
                    textAlign: "center",
                    color: index <= activeStep ? "#000000" : "#666666",
                    fontWeight: index === activeStep ? 600 : 400,
                    lineHeight: 1,
                    maxWidth: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {step.shortLabel}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  // Desktop stepper (original implementation with improvements)
  return (
    <Box sx={{ width: "100%", mb: 4 }}>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={<QontoConnector />}
        sx={{
          "& .MuiStepLabel-root": {
            "& .MuiStepLabel-label": {
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "#666666",
              "&.Mui-active": {
                color: "#000000",
                fontWeight: 600,
              },
              "&.Mui-completed": {
                color: "#000000",
                fontWeight: 600,
              },
            },
          },
        }}
      >
        {steps.map((step, index) => (
          <Step
            key={step.key}
            {...getStepProps(index)}
            sx={{
              cursor:
                index <= activeStep && onStepClick ? "pointer" : "default",
              "&:hover":
                index <= activeStep && onStepClick
                  ? {
                      "& .MuiStepLabel-root": {
                        "& .MuiStepLabel-label": {
                          color: "#FFCC00",
                          fontWeight: 600,
                        },
                      },
                    }
                  : {},
            }}
            onClick={() => {
              if (index <= activeStep && onStepClick) {
                onStepClick(step.key as SignupStep);
              }
            }}
          >
            <StepLabel StepIconComponent={QontoStepIcon}>
              {step.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default SignupStepper;
