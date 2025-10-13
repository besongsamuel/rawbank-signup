import { Check } from "@mui/icons-material";
import {
  Box,
  Step,
  StepConnector,
  StepIconProps,
  StepLabel,
  Stepper,
  styled,
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
}

const SignupStepper: React.FC<SignupStepperProps> = ({ currentStep }) => {
  // Define all steps in order
  const steps = [
    { key: "step2_id", label: "Pièce d'identité" },
    { key: "step2_identity", label: "Identité" },
    { key: "step2_marital", label: "Situation familiale" },
    { key: "step2_housing", label: "Logement" },
    { key: "step2_contact", label: "Contact" },
    { key: "step2_professional", label: "Professionnel" },
    { key: "step2_emergency", label: "Contact d'urgence" },
    { key: "step2_fatca", label: "FATCA" },
    { key: "step2_pep", label: "PPE" },
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
          <Step key={step.key} {...getStepProps(index)}>
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
