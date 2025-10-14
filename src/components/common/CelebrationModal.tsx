import { CheckCircle } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Typography,
  keyframes,
} from "@mui/material";
import React, { useEffect, useState } from "react";

const confettiAnimation = keyframes`
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
`;

const scaleIn = keyframes`
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

interface CelebrationModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

const CelebrationModal: React.FC<CelebrationModalProps> = ({
  open,
  onClose,
  title = "🎉 Félicitations !",
  message = "Votre demande a été soumise avec succès !",
}) => {
  const [confetti, setConfetti] = useState<
    Array<{ id: number; left: number; delay: number; color: string }>
  >([]);

  useEffect(() => {
    if (open) {
      // Generate confetti pieces
      const pieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        color: ["#FFCC00", "#FFD700", "#FFA500", "#FF6B6B", "#4ECDC4"][
          Math.floor(Math.random() * 5)
        ],
      }));
      setConfetti(pieces);
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
          position: "relative",
        },
      }}
    >
      {/* Confetti */}
      {confetti.map((piece) => (
        <Box
          key={piece.id}
          sx={{
            position: "absolute",
            left: `${piece.left}%`,
            top: -10,
            width: 10,
            height: 10,
            backgroundColor: piece.color,
            borderRadius: "50%",
            animation: `${confettiAnimation} ${2 + Math.random()}s linear ${
              piece.delay
            }s`,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      ))}

      <DialogContent
        sx={{
          textAlign: "center",
          py: 6,
          px: 4,
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Success Icon */}
        <Box
          sx={{
            display: "inline-flex",
            animation: `${scaleIn} 0.5s ease-out`,
            mb: 3,
          }}
        >
          <CheckCircle
            sx={{
              fontSize: 100,
              color: "#FFCC00",
              filter: "drop-shadow(0 4px 20px rgba(255, 204, 0, 0.3))",
              animation: `${pulse} 2s ease-in-out infinite`,
            }}
          />
        </Box>

        {/* Title */}
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: "#000000",
            mb: 2,
            animation: `${scaleIn} 0.6s ease-out 0.2s backwards`,
          }}
        >
          {title}
        </Typography>

        {/* Message */}
        <Typography
          variant="h6"
          sx={{
            color: "text.secondary",
            mb: 4,
            lineHeight: 1.6,
            animation: `${scaleIn} 0.6s ease-out 0.3s backwards`,
          }}
        >
          {message}
        </Typography>

        {/* Success Details */}
        <Box
          sx={{
            backgroundColor: "rgba(255, 204, 0, 0.1)",
            borderRadius: 2,
            p: 3,
            mb: 4,
            animation: `${scaleIn} 0.6s ease-out 0.4s backwards`,
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
            ✉️ Vérifiez votre email
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Nous vous avons envoyé un récapitulatif de votre demande avec les
            prochaines étapes.
          </Typography>
        </Box>

        {/* Action Button */}
        <Button
          variant="contained"
          size="large"
          onClick={onClose}
          sx={{
            backgroundColor: "#000000",
            color: "#FFCC00",
            px: 6,
            py: 1.5,
            fontSize: "1.1rem",
            fontWeight: 600,
            borderRadius: 2,
            animation: `${scaleIn} 0.6s ease-out 0.5s backwards`,
            "&:hover": {
              backgroundColor: "#1a1a1a",
              transform: "translateY(-2px)",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
            },
            transition: "all 0.3s ease",
          }}
        >
          Continuer vers mon tableau de bord
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CelebrationModal;
