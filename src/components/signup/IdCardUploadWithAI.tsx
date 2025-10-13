import { AutoAwesome, CloudUpload, Delete } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useCallback, useState } from "react";
import { useIdExtraction } from "../../hooks/useIdExtraction";
import { IdCardInfo } from "../../types/signup";
import ExtractionConfirmationModal from "../modals/ExtractionConfirmationModal";
import ExtractionLoadingModal from "../modals/ExtractionLoadingModal";

const ContentBox = styled(Box)(({ theme }) => ({
  minHeight: "calc(100vh - 160px)",
  background: "#FFFFFF",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 20,
  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
  maxWidth: 800,
  margin: "0 auto",
  width: "100%",
}));

const UploadArea = styled(Paper)(({ theme }) => ({
  border: "2px dashed",
  borderColor: "#FFCC00",
  borderRadius: 12,
  padding: theme.spacing(4),
  textAlign: "center",
  cursor: "pointer",
  transition: "all 0.3s ease",
  backgroundColor: "rgba(255, 204, 0, 0.05)",
  "&:hover": {
    borderColor: "#E6B800",
    backgroundColor: "rgba(255, 204, 0, 0.1)",
  },
}));

const PreviewImage = styled("img")(({ theme }) => ({
  maxWidth: "100%",
  maxHeight: 300,
  borderRadius: 8,
  boxShadow: theme.shadows[4],
}));

interface IdCardUploadProps {
  data: IdCardInfo;
  onDataChange: (data: Partial<IdCardInfo>) => void;
  onNext: () => void;
  onPrev: () => void;
  loading?: boolean;
}

const IdCardUploadWithAI: React.FC<IdCardUploadProps> = ({
  data,
  onDataChange,
  onNext,
  onPrev,
  loading = false,
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const {
    uploadAndExtract,
    isUploading,
    isExtracting,
    uploadProgress,
    error: extractionError,
    extractedData,
  } = useIdExtraction();

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        setUploadError(
          "Format de fichier non supporté. Utilisez JPG, PNG ou WebP."
        );
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setUploadError("Le fichier est trop volumineux. Maximum 10 MB.");
        return;
      }

      setUploadError(null);
      setUploadedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const handleExtractData = async () => {
    if (!uploadedFile || !data.type) {
      setUploadError(
        "Veuillez sélectionner un type de document et télécharger une image."
      );
      return;
    }

    try {
      const extracted = await uploadAndExtract(uploadedFile, data.type);
      setShowConfirmation(true);
    } catch (error) {
      console.error("Extraction error:", error);
      setUploadError(
        error instanceof Error
          ? error.message
          : "Erreur lors de l'extraction des données"
      );
    }
  };

  const handleConfirmData = () => {
    if (extractedData) {
      // Update ID card info
      onDataChange({
        number: extractedData.idNumber,
        issueDate: extractedData.issueDate || "",
        expiryDate: extractedData.expiryDate || "",
      });
    }
    setShowConfirmation(false);
    onNext();
  };

  const handleEditData = () => {
    if (extractedData) {
      // Pre-fill form with extracted data
      onDataChange({
        number: extractedData.idNumber,
        issueDate: extractedData.issueDate || "",
        expiryDate: extractedData.expiryDate || "",
      });
    }
    setShowConfirmation(false);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setPreviewUrl(null);
    setUploadError(null);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      const syntheticEvent = {
        target: { files },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileUpload(syntheticEvent);
    }
  };

  return (
    <ContentBox>
      <StyledCard>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <AutoAwesome sx={{ fontSize: 64, color: "#FFCC00", mb: 2 }} />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Téléchargez votre pièce d'identité
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Notre IA extraira automatiquement vos informations
            </Typography>
          </Box>

          {/* ID Type Selection */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Type de document *</InputLabel>
            <Select
              value={data.type || ""}
              onChange={(e) => onDataChange({ type: e.target.value as any })}
              label="Type de document *"
              required
            >
              <MenuItem value="passeport">Passeport</MenuItem>
              <MenuItem value="permis_conduire">Permis de conduire</MenuItem>
              <MenuItem value="carte_identite">
                Carte d'identité nationale
              </MenuItem>
              <MenuItem value="carte_electeur">Carte d'électeur</MenuItem>
            </Select>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              Sélectionnez le type de document que vous allez télécharger
            </Typography>
          </FormControl>

          {/* Upload Area */}
          {!uploadedFile ? (
            <UploadArea
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <CloudUpload sx={{ fontSize: 64, color: "#FFCC00", mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Glissez-déposez votre document ici
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                ou cliquez pour sélectionner un fichier
              </Typography>
              <Chip
                label="JPG, PNG, WebP - Max 10 MB"
                size="small"
                sx={{
                  backgroundColor: "rgba(0, 0, 0, 0.05)",
                }}
              />
              <input
                id="file-input"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
            </UploadArea>
          ) : (
            <Box>
              {/* Preview */}
              <Box
                sx={{
                  position: "relative",
                  mb: 2,
                  textAlign: "center",
                }}
              >
                <PreviewImage src={previewUrl || ""} alt="ID Preview" />
                <Box
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    display: "flex",
                    gap: 1,
                  }}
                >
                  <IconButton
                    onClick={handleRemoveFile}
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 1)",
                      },
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Box>

              {/* File Info */}
              <Box
                sx={{
                  p: 2,
                  backgroundColor: "rgba(255, 204, 0, 0.1)",
                  borderRadius: 2,
                  mb: 2,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  📄 {uploadedFile.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </Typography>
              </Box>

              {/* Extract Button */}
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleExtractData}
                disabled={!data.type || isUploading || isExtracting}
                startIcon={<AutoAwesome />}
                sx={{
                  backgroundColor: "#000000",
                  color: "#FFCC00",
                  py: 1.5,
                  fontSize: "1.1rem",
                  "&:hover": {
                    backgroundColor: "#1a1a1a",
                  },
                }}
              >
                Extraire les données automatiquement
              </Button>
            </Box>
          )}

          {/* Manual Entry Option */}
          {!uploadedFile && (
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Ou remplissez manuellement les informations
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
                <TextField
                  fullWidth
                  label="Numéro du document"
                  value={data.number || ""}
                  onChange={(e) => onDataChange({ number: e.target.value })}
                />
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <TextField
                    sx={{ flex: 1, minWidth: { xs: "100%", sm: 200 } }}
                    label="Date d'émission"
                    type="date"
                    value={data.issueDate || ""}
                    onChange={(e) =>
                      onDataChange({ issueDate: e.target.value })
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    sx={{ flex: 1, minWidth: { xs: "100%", sm: 200 } }}
                    label="Date d'expiration"
                    type="date"
                    value={data.expiryDate || ""}
                    onChange={(e) =>
                      onDataChange({ expiryDate: e.target.value })
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>
              </Box>
            </Box>
          )}

          {/* Errors */}
          {(uploadError || extractionError) && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {uploadError || extractionError}
            </Alert>
          )}

          {/* Navigation Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 4,
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              onClick={onPrev}
              disabled={loading || isUploading || isExtracting}
              sx={{ flex: 1 }}
            >
              Précédent
            </Button>
            <Button
              variant="contained"
              onClick={
                uploadedFile && !extractedData ? handleExtractData : onNext
              }
              disabled={loading || isUploading || isExtracting || !data.type}
              sx={{
                flex: 1,
                backgroundColor: "#000000",
                color: "#FFCC00",
                "&:hover": {
                  backgroundColor: "#1a1a1a",
                },
              }}
            >
              {uploadedFile && !extractedData
                ? "Extraire et Continuer"
                : "Continuer"}
            </Button>
          </Box>
        </CardContent>
      </StyledCard>

      {/* Loading Modal */}
      <ExtractionLoadingModal
        open={isUploading || isExtracting}
        progress={uploadProgress}
        isUploading={isUploading}
        isExtracting={isExtracting}
      />

      {/* Confirmation Modal */}
      <ExtractionConfirmationModal
        open={showConfirmation}
        data={extractedData}
        onConfirm={handleConfirmData}
        onEdit={handleEditData}
      />
    </ContentBox>
  );
};

export default IdCardUploadWithAI;
