import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  LinearProgress,
  Typography,
} from "@mui/material";
import { AutoAwesome } from "@mui/icons-material";
import React from "react";

interface ExtractionLoadingModalProps {
  open: boolean;
  progress: number;
  isUploading: boolean;
  isExtracting: boolean;
}

const ExtractionLoadingModal: React.FC<ExtractionLoadingModalProps> = ({
  open,
  progress,
  isUploading,
  isExtracting,
}) => {
  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 2,
        },
      }}
    >
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 3,
          }}
        >
          {/* Icon with animation */}
          <Box
            sx={{
              mb: 3,
              position: "relative",
            }}
          >
            <CircularProgress
              size={80}
              thickness={2}
              sx={{
                color: "#FFCC00",
              }}
            />
            <AutoAwesome
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: 40,
                color: "#FFCC00",
                animation: "pulse 2s ease-in-out infinite",
                "@keyframes pulse": {
                  "0%, 100%": {
                    opacity: 1,
                    transform: "translate(-50%, -50%) scale(1)",
                  },
                  "50%": {
                    opacity: 0.5,
                    transform: "translate(-50%, -50%) scale(1.1)",
                  },
                },
              }}
            />
          </Box>

          {/* Status text */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: 1,
              textAlign: "center",
            }}
          >
            {isUploading && "Téléchargement de votre document..."}
            {isExtracting && "Extraction des données en cours..."}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              textAlign: "center",
              mb: 3,
              maxWidth: 400,
            }}
          >
            {isUploading &&
              "Veuillez patienter pendant que nous téléchargeons votre document de manière sécurisée."}
            {isExtracting &&
              "Notre IA analyse votre document et extrait automatiquement vos informations. Cela peut prendre quelques secondes."}
          </Typography>

          {/* Progress bar */}
          <Box sx={{ width: "100%", mb: 2 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#FFCC00",
                  borderRadius: 4,
                },
              }}
            />
          </Box>

          {/* Progress percentage */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            {Math.round(progress)}% terminé
          </Typography>

          {/* Tips */}
          <Box
            sx={{
              mt: 3,
              p: 2,
              backgroundColor: "rgba(255, 204, 0, 0.1)",
              borderRadius: 2,
              width: "100%",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                display: "block",
                color: "text.secondary",
                lineHeight: 1.6,
              }}
            >
              💡 <strong>Conseil:</strong> Nos algorithmes d'IA extraient
              automatiquement vos informations pour vous faire gagner du temps.
              Vous pourrez vérifier et modifier les données avant de continuer.
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ExtractionLoadingModal;

