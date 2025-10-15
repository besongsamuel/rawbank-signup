import { Check, HourglassEmpty } from "@mui/icons-material";
import {
  Box,
  Step,
  StepConnector,
  stepConnectorClasses,
  StepIconProps,
  StepLabel,
  Stepper,
  styled,
  Typography,
} from "@mui/material";
import React from "react";

const TimelineConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
    left: "calc(-50% + 24px)",
    right: "calc(50% + 24px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: "linear-gradient(95deg, #FFCC00 0%, #FFA500 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: "linear-gradient(95deg, #FFCC00 0%, #FFA500 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

const TimelineStepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundImage: "linear-gradient(136deg, #FFCC00 0%, #FFA500 100%)",
    boxShadow: "0 4px 10px 0 rgba(255,204,0,.25)",
    animation: "pulse 2s ease-in-out infinite",
  }),
  ...(ownerState.completed && {
    backgroundImage: "linear-gradient(136deg, #FFCC00 0%, #FFA500 100%)",
  }),
  "@keyframes pulse": {
    "0%, 100%": {
      boxShadow: "0 4px 10px 0 rgba(255,204,0,.25)",
    },
    "50%": {
      boxShadow: "0 4px 20px 0 rgba(255,204,0,.5)",
    },
  },
}));

function TimelineStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  return (
    <TimelineStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {completed ? (
        <Check sx={{ fontSize: 28 }} />
      ) : active ? (
        <HourglassEmpty
          sx={{ fontSize: 28, animation: "spin 2s linear infinite" }}
        />
      ) : (
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.5)",
          }}
        />
      )}
    </TimelineStepIconRoot>
  );
}

interface TimelineStep {
  label: string;
  description: string;
  completed: boolean;
  active: boolean;
  estimatedDays?: string;
}

interface ApplicationTimelineProps {
  status: string;
}

const ApplicationTimeline: React.FC<ApplicationTimelineProps> = ({
  status,
}) => {
  const getTimelineSteps = (): TimelineStep[] => {
    const steps: TimelineStep[] = [
      {
        label: "Demande soumise",
        description: "Votre demande a été reçue avec succès",
        completed: ["submitted", "under_review", "approved"].includes(status),
        active: false,
        estimatedDays: "Complété",
      },
      {
        label: "Vérification des documents",
        description:
          "Nos équipes vérifient vos informations. Pour récupérer votre carte, vous devez prendre rendez-vous avec notre agence.",
        completed: ["under_review", "approved"].includes(status),
        active: status === "submitted",
        estimatedDays: "15 minutes",
      },
      {
        label: "Approbation du manager",
        description: "Validation finale de votre dossier",
        completed: status === "approved",
        active: status === "under_review",
        estimatedDays: "24 heures",
      },
    ];

    return steps;
  };

  const timelineSteps = getTimelineSteps();
  const activeStepIndex = timelineSteps.findIndex((step) => step.active);

  return (
    <Box sx={{ width: "100%", py: 3 }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontWeight: 600, mb: 3, textAlign: "center" }}
      >
        Suivi de votre demande
      </Typography>

      <Stepper
        alternativeLabel
        activeStep={activeStepIndex}
        connector={<TimelineConnector />}
        sx={{
          "& .MuiStepLabel-label": {
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            fontWeight: 500,
          },
        }}
      >
        {timelineSteps.map((step, index) => (
          <Step key={step.label} completed={step.completed}>
            <StepLabel
              StepIconComponent={TimelineStepIcon}
              optional={
                <Box sx={{ textAlign: "center", mt: 1 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block" }}
                  >
                    {step.description}
                  </Typography>
                  {step.active && step.estimatedDays && (
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        color: "#FFCC00",
                        fontWeight: 600,
                        mt: 0.5,
                      }}
                    >
                      ⏱ {step.estimatedDays}
                    </Typography>
                  )}
                  {!step.completed && !step.active && step.estimatedDays && (
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        color: "text.disabled",
                        mt: 0.5,
                      }}
                    >
                      ~{step.estimatedDays}
                    </Typography>
                  )}
                </Box>
              }
            >
              {step.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Estimated Completion */}
      <Box
        sx={{
          mt: 4,
          p: 2,
          backgroundColor: "rgba(255, 204, 0, 0.1)",
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {status === "approved"
            ? "✅ Votre dossier a été approuvé! Vous recevrez votre carte lors de la vérification finale."
            : status === "under_review"
            ? "🔄 Temps estimé restant: ~24 heures"
            : "⏳ Temps total estimé: ~15 minutes + 24 heures pour l'approbation du manager"}
        </Typography>
      </Box>
    </Box>
  );
};

export default ApplicationTimeline;
