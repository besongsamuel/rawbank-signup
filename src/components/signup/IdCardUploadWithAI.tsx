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
import React, { useCallback, useEffect, useState } from "react";
import { useApplicationContext } from "../../contexts/ApplicationContext";
import { useIdExtraction } from "../../hooks/useIdExtraction";
import { supabase } from "../../lib/supabase";
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
  const { user } = useApplicationContext();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [existingFiles, setExistingFiles] = useState<any[]>([]);
  const [selectedExistingFile, setSelectedExistingFile] = useState<any | null>(
    null
  );
  const [loadingExistingFiles, setLoadingExistingFiles] = useState(false);

  const {
    uploadAndExtract,
    isUploading,
    isExtracting,
    uploadProgress,
    error: extractionError,
    extractedData,
  } = useIdExtraction();

  // Fetch existing uploaded files from Supabase storage based on ID card type
  useEffect(() => {
    const fetchExistingFiles = async () => {
      if (!user?.id || !data.type) return;

      setLoadingExistingFiles(true);
      try {
        // Query files for the specific ID card type
        const { data: files, error } = await supabase.storage
          .from("ids")
          .list(`${user.id}/${data.type}`, {
            limit: 1, // Only get the last uploaded file
            sortBy: { column: "created_at", order: "desc" },
          });

        if (error) {
          console.error("Error fetching existing files:", error);
          setExistingFiles([]);
          return;
        }

        // Filter for image files and get signed URLs
        const imageFiles = files.filter((file) =>
          file.name.match(/\.(jpg|jpeg|png|webp)$/i)
        );

        if (imageFiles.length === 0) {
          setExistingFiles([]);
          return;
        }

        // Get signed URL for the most recent file
        const latestFile = imageFiles[0];
        const { data: urlData } = await supabase.storage
          .from("ids")
          .createSignedUrl(`${user.id}/${data.type}/${latestFile.name}`, 3600);

        if (urlData?.signedUrl) {
          const existingFile = {
            ...latestFile,
            signedUrl: urlData.signedUrl,
            type: data.type,
          };
          setExistingFiles([existingFile]);
          // Auto-select the existing file
          setSelectedExistingFile(existingFile);
          setPreviewUrl(urlData.signedUrl);
        } else {
          setExistingFiles([]);
        }
      } catch (error) {
        console.error("Error fetching existing files:", error);
        setExistingFiles([]);
      } finally {
        setLoadingExistingFiles(false);
      }
    };

    fetchExistingFiles();
  }, [user?.id, data.type]);

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
    if ((!uploadedFile && !selectedExistingFile) || !data.type) {
      setUploadError("Veuillez sélectionner un type de document et une image.");
      return;
    }

    try {
      if (uploadedFile) {
        // Extract from newly uploaded file
        const extracted = await uploadAndExtract(uploadedFile, data.type);
        setShowConfirmation(true);
      } else if (selectedExistingFile) {
        // For existing files, extraction is optional
        // User can manually fill the form or skip extraction
        console.log("Extraction from existing file is optional");
      }
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
    // Stay on current page for any revisions - do not automatically move to next step
    // User can manually proceed when ready
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setPreviewUrl(null);
    setUploadError(null);
    setSelectedExistingFile(null);
  };

  const handleSelectExistingFile = (file: any) => {
    setSelectedExistingFile(file);
    setPreviewUrl(file.signedUrl);
    setUploadedFile(null); // Clear new file selection
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

          {/* Existing Files Section */}
          {existingFiles.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Fichier précédemment téléchargé
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Vous pouvez utiliser votre dernier fichier téléchargé pour ce
                type de document ou en télécharger un nouveau
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                {existingFiles.map((file, index) => (
                  <Box
                    key={index}
                    sx={{
                      position: "relative",
                      cursor: "pointer",
                      border:
                        selectedExistingFile?.name === file.name
                          ? "2px solid #FFCC00"
                          : "2px solid transparent",
                      borderRadius: 2,
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        borderColor: "#FFCC00",
                        transform: "scale(1.02)",
                      },
                    }}
                    onClick={() => handleSelectExistingFile(file)}
                  >
                    <img
                      src={file.signedUrl}
                      alt={`Document ${index + 1}`}
                      style={{
                        width: 120,
                        height: 80,
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background:
                          "linear-gradient(transparent, rgba(0,0,0,0.7))",
                        color: "white",
                        p: 1,
                      }}
                    >
                      <Typography variant="caption" sx={{ fontSize: "0.7rem" }}>
                        {new Date(file.created_at).toLocaleDateString()}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ fontSize: "0.6rem", display: "block" }}
                      >
                        {file.type === "passeport"
                          ? "Passeport"
                          : file.type === "permis_conduire"
                          ? "Permis de conduire"
                          : file.type === "carte_identite"
                          ? "Carte d'identité"
                          : file.type === "carte_electeur"
                          ? "Carte d'électeur"
                          : file.type}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Upload Area */}
          {!uploadedFile && !selectedExistingFile ? (
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
                {selectedExistingFile && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      backgroundColor: "rgba(255, 204, 0, 0.9)",
                      color: "#000",
                      px: 2,
                      py: 1,
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      Fichier existant
                    </Typography>
                  </Box>
                )}
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
                  📄{" "}
                  {uploadedFile?.name ||
                    selectedExistingFile?.name ||
                    "Document"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {uploadedFile
                    ? `${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB`
                    : selectedExistingFile
                    ? `${(
                        selectedExistingFile.metadata?.size /
                        1024 /
                        1024
                      ).toFixed(2)} MB`
                    : "Taille inconnue"}
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
                {isExtracting
                  ? "Extraction en cours..."
                  : isUploading
                  ? "Téléchargement..."
                  : "Extraire automatiquement (optionnel)"}
              </Button>
            </Box>
          )}

          {/* Manual Entry Fields - Always Visible */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
              Informations du document
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2, textAlign: "center" }}
            >
              {uploadedFile || selectedExistingFile
                ? "Vous pouvez extraire automatiquement les données ou les saisir manuellement"
                : "Remplissez manuellement les informations du document"}
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
                  onChange={(e) => onDataChange({ issueDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  sx={{ flex: 1, minWidth: { xs: "100%", sm: 200 } }}
                  label="Date d'expiration"
                  type="date"
                  value={data.expiryDate || ""}
                  onChange={(e) => onDataChange({ expiryDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            </Box>
          </Box>

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
              onClick={onNext}
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
              Sauvegarder et continuer
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
        onClose={handleConfirmData}
      />
    </ContentBox>
  );
};

export default IdCardUploadWithAI;
