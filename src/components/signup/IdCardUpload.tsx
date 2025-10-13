import { CloudUpload, Delete, Visibility } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { IdCardInfo } from "../../types/signup";

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

const UploadArea = styled(Paper)(({ theme }) => ({
  border: "2px dashed",
  borderColor: theme.palette.primary.main,
  borderRadius: 12,
  padding: theme.spacing(4),
  textAlign: "center",
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    borderColor: theme.palette.primary.dark,
    backgroundColor: theme.palette.primary.light + "10",
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

const IdCardUpload: React.FC<IdCardUploadProps> = ({
  data,
  onDataChange,
  onNext,
  onPrev,
  loading = false,
}) => {
  const { t } = useTranslation();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

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

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("Fichier trop volumineux. Taille maximale: 5MB.");
        return;
      }

      setUploadedFile(file);
      setUploadError(null);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    },
    []
  );

  const handleRemoveFile = useCallback(() => {
    setUploadedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setUploadError(null);
  }, [previewUrl]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onDataChange({ [name]: value });
  };

  const handleSelectChange = (event: any) => {
    const { name, value } = event.target;
    onDataChange({ [name]: value });
  };

  const handleNext = () => {
    if (!uploadedFile) {
      setUploadError("Veuillez télécharger votre pièce d'identité.");
      return;
    }
    onNext();
  };

  const idCardTypes = [
    { value: "carte_electeur", label: "Carte d'électeur" },
    { value: "carte_identite", label: "Carte d'identité nationale" },
    { value: "permis_conduire", label: "Permis de conduire" },
    { value: "passeport", label: "Passeport" },
    { value: "autre", label: "Autre (précisez)" },
  ];

  return (
    <GradientBox>
      <StyledCard>
        <CardContent sx={{ p: 4 }}>
          {/* Progress Stepper */}
          <Box sx={{ mb: 4 }}>
            <Stepper activeStep={1} alternativeLabel>
              <Step>
                <StepLabel>Connexion</StepLabel>
              </Step>
              <Step>
                <StepLabel>Pièce d'identité</StepLabel>
              </Step>
              <Step>
                <StepLabel>Profil</StepLabel>
              </Step>
            </Stepper>
          </Box>

          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h2" gutterBottom>
              Pièce d'identité
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Téléchargez votre pièce d'identité pour vérification
            </Typography>
          </Box>

          {/* Form */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* ID Card Type */}
            <FormControl fullWidth required>
              <InputLabel>Type de pièce d'identité</InputLabel>
              <Select
                name="type"
                value={data.type}
                onChange={handleSelectChange}
                label="Type de pièce d'identité"
              >
                {idCardTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Other Type Specification */}
            {data.type === "autre" && (
              <TextField
                fullWidth
                label="Précisez le type"
                name="otherType"
                value={data.otherType || ""}
                onChange={handleInputChange}
                placeholder="Ex: Carte de séjour, etc."
              />
            )}

            {/* File Upload */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Télécharger la pièce d'identité *
              </Typography>

              {!uploadedFile ? (
                <UploadArea
                  onClick={() =>
                    document.getElementById("file-upload")?.click()
                  }
                >
                  <CloudUpload
                    sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
                  />
                  <Typography variant="h6" gutterBottom>
                    Cliquez pour télécharger
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Formats acceptés: JPG, PNG, WebP (max 5MB)
                  </Typography>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                  />
                </UploadArea>
              ) : (
                <Box sx={{ position: "relative" }}>
                  <PreviewImage src={previewUrl!} alt="Pièce d'identité" />
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
                      size="small"
                      onClick={() => window.open(previewUrl!, "_blank")}
                      sx={{ backgroundColor: "rgba(255,255,255,0.8)" }}
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={handleRemoveFile}
                      sx={{ backgroundColor: "rgba(255,255,255,0.8)" }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              )}
            </Box>

            {/* ID Card Details */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <TextField
                fullWidth
                label="Numéro de la pièce"
                name="number"
                value={data.number}
                onChange={handleInputChange}
                required
                placeholder="Numéro de la pièce d'identité"
              />
              <TextField
                fullWidth
                label="Date de délivrance"
                name="issueDate"
                type="date"
                value={data.issueDate}
                onChange={handleInputChange}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            <TextField
              fullWidth
              label="Date d'expiration"
              name="expiryDate"
              type="date"
              value={data.expiryDate}
              onChange={handleInputChange}
              required
              InputLabelProps={{ shrink: true }}
            />

            {/* Error Display */}
            {uploadError && <Alert severity="error">{uploadError}</Alert>}

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <Button
                variant="outlined"
                onClick={onPrev}
                disabled={loading}
                sx={{ flex: 1 }}
              >
                Précédent
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={loading || !uploadedFile}
                sx={{ flex: 1 }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Continuer"
                )}
              </Button>
            </Box>
          </Box>

          {/* Info */}
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Votre pièce d'identité sera utilisée pour vérifier votre identité
              et pré-remplir vos informations personnelles.
            </Typography>
          </Box>
        </CardContent>
      </StyledCard>
    </GradientBox>
  );
};

export default IdCardUpload;
