import { CheckCircle, Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from "@mui/material";
import React from "react";
import { ExtractedIdData } from "../../hooks/useIdExtraction";

interface ExtractionConfirmationModalProps {
  open: boolean;
  data: ExtractedIdData | null;
  onConfirm: () => void;
  onEdit: () => void;
}

const ExtractionConfirmationModal: React.FC<
  ExtractionConfirmationModalProps
> = ({ open, data, onConfirm, onEdit }) => {
  if (!data) return null;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Non renseigné";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const DataRow = ({ label, value }: { label: string; value?: string }) => (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        mb: 1.5,
      }}
    >
      <Typography
        variant="body2"
        sx={{ fontWeight: 600, color: "text.secondary", flex: "0 0 40%" }}
      >
        {label}
      </Typography>
      <Typography variant="body2" sx={{ flex: 1 }}>
        {value || <em style={{ color: "#999" }}>Non détecté</em>}
      </Typography>
    </Box>
  );

  return (
    <Dialog
      open={open}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CheckCircle sx={{ color: "#34C759", fontSize: 32 }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Données extraites avec succès!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Vérifiez les informations ci-dessous
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* ID Card Information */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            📄 Informations du document
          </Typography>
          <DataRow label="Type de document" value={data.idType} />
          <DataRow label="Numéro" value={data.idNumber} />
          <DataRow label="Date d'émission" value={formatDate(data.issueDate)} />
          <DataRow
            label="Date d'expiration"
            value={formatDate(data.expiryDate)}
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Personal Information */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            👤 Informations personnelles
          </Typography>
          <DataRow label="Prénom" value={data.firstName} />
          <DataRow label="Postnom" value={data.middleName} />
          <DataRow label="Nom" value={data.lastName} />
          <DataRow
            label="Date de naissance"
            value={formatDate(data.birthDate)}
          />
          <DataRow label="Lieu de naissance" value={data.birthPlace} />
          <DataRow label="Nationalité" value={data.nationality} />
          <DataRow
            label="Genre"
            value={
              data.gender === "M"
                ? "Masculin"
                : data.gender === "F"
                ? "Féminin"
                : data.gender
            }
          />
        </Box>

        {/* Address Information */}
        {(data.address || data.city || data.province || data.country) && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                📍 Adresse
              </Typography>
              <DataRow label="Adresse complète" value={data.address} />
              <DataRow label="Ville" value={data.city} />
              <DataRow label="Province" value={data.province} />
              <DataRow label="Pays" value={data.country} />
            </Box>
          </>
        )}

        {/* Notice */}
        <Box
          sx={{
            mt: 3,
            p: 2,
            backgroundColor: "rgba(255, 204, 0, 0.1)",
            borderRadius: 2,
          }}
        >
          <Typography variant="caption" sx={{ lineHeight: 1.6 }}>
            ℹ️ <strong>Important:</strong> Veuillez vérifier attentivement
            toutes les informations extraites. Vous pouvez les modifier
            manuellement si nécessaire en cliquant sur "Modifier les données".
            Après confirmation, vous resterez sur cette page pour effectuer
            d'éventuelles révisions avant de continuer.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<Edit />}
          onClick={onEdit}
          sx={{
            borderColor: "#E5E5E5",
            color: "#000000",
            "&:hover": {
              borderColor: "#000000",
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          Modifier les données
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          sx={{
            backgroundColor: "#000000",
            color: "#FFCC00",
            "&:hover": {
              backgroundColor: "#1a1a1a",
            },
            flex: 1,
          }}
        >
          Confirmer les données
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExtractionConfirmationModal;
