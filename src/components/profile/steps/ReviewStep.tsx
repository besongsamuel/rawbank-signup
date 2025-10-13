import { CheckCircle, Edit, Send } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useUserProfile } from "../../../hooks/useUserProfile";
import { supabase } from "../../../lib/supabase";

const ContentBox = styled(Box)(({ theme }) => ({
  minHeight: "calc(100vh - 160px)",
  background: "#FFFFFF",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 1000,
  width: "100%",
  margin: "0 auto",
  boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
  borderRadius: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    margin: theme.spacing(1),
    borderRadius: theme.spacing(1),
  },
}));

const SectionCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  border: "1px solid #E5E5E5",
  borderRadius: theme.spacing(1.5),
}));

interface ReviewStepProps {
  onPrev: () => void;
  loading?: boolean;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ onPrev, loading = false }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, application, refreshProfile } = useUserProfile(user);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!user?.id || !application?.id) return;

    setSubmitting(true);
    try {
      // Update application status to submitted
      const { error } = await supabase
        .from("applications")
        .update({
          status: "submitted",
          submitted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", application.id);

      if (error) {
        console.error("Error submitting application:", error);
        return;
      }

      // Refresh profile to get updated application status
      await refreshProfile();

      // Close modal and redirect to app
      setShowConfirmModal(false);
      navigate("/app");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setSubmitting(false);
    }
  }, [user?.id, application?.id, refreshProfile, navigate]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const getAccountTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      individual: "Compte Individuel",
      joint: "Compte Joint",
      business: "Compte Professionnel",
      corporate: "Compte Entreprise",
    };
    return types[type] || type;
  };

  const getAgencyName = (agencyId: string) => {
    const agencies: Record<string, string> = {
      kinshasa_center: "Agence Kinshasa Centre",
      kinshasa_gombe: "Agence Kinshasa Gombe",
      kinshasa_limete: "Agence Kinshasa Limete",
      lubumbashi_center: "Agence Lubumbashi Centre",
      lubumbashi_katanga: "Agence Lubumbashi Katanga",
      goma_center: "Agence Goma Centre",
      bukavu_center: "Agence Bukavu Centre",
      matadi_center: "Agence Matadi Centre",
    };
    return agencies[agencyId] || agencyId;
  };

  const getCivilityLabel = (civility: string) => {
    const civilities: Record<string, string> = {
      monsieur: "Monsieur",
      madame: "Madame",
      mademoiselle: "Mademoiselle",
    };
    return civilities[civility] || civility;
  };

  return (
    <ContentBox>
      <StyledCard>
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <CheckCircle sx={{ fontSize: 64, color: "#FFCC00", mb: 1 }} />
            <Typography variant="h4" gutterBottom>
              Révision Finale
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Vérifiez toutes vos informations avant de soumettre votre demande
            </Typography>
          </Box>

          <Stack spacing={3}>
            {/* Application Information */}
            <SectionCard>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Send color="primary" />
                  Informations de la Demande
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={2}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Numéro de demande:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {application?.application_number}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Type de compte:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {application?.account_type
                        ? getAccountTypeLabel(application.account_type)
                        : "Non spécifié"}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Agence:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {application?.agency_id
                        ? getAgencyName(application.agency_id)
                        : "Non spécifiée"}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Statut:
                    </Typography>
                    <Chip
                      label={
                        application?.status === "draft"
                          ? "Brouillon"
                          : application?.status
                      }
                      color={
                        application?.status === "draft" ? "warning" : "success"
                      }
                      size="small"
                    />
                  </Box>
                </Stack>
              </CardContent>
            </SectionCard>

            {/* Personal Information */}
            <SectionCard>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Edit color="primary" />
                  Informations Personnelles
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={2}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Civilité:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {profile?.civility
                        ? getCivilityLabel(profile.civility)
                        : "Non spécifiée"}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Nom complet:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {profile?.first_name && profile?.last_name
                        ? `${profile.first_name} ${
                            profile.middle_name ? profile.middle_name + " " : ""
                          }${profile.last_name}`
                        : "Non spécifié"}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Date de naissance:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {profile?.birth_date
                        ? formatDate(profile.birth_date)
                        : "Non spécifiée"}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Lieu de naissance:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {profile?.birth_place || "Non spécifié"}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Nationalité:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {profile?.nationality || "Non spécifiée"}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </SectionCard>

            {/* Document Information */}
            <SectionCard>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Edit color="primary" />
                  Pièce d'Identité
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={2}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Type de document:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {profile?.id_type || "Non spécifié"}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Numéro:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {profile?.id_number || "Non spécifié"}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Date d'émission:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {profile?.id_issue_date
                        ? formatDate(profile.id_issue_date)
                        : "Non spécifiée"}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Date d'expiration:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {profile?.id_expiry_date
                        ? formatDate(profile.id_expiry_date)
                        : "Non spécifiée"}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </SectionCard>

            {/* Contact Information */}
            <SectionCard>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Edit color="primary" />
                  Informations de Contact
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={2}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Téléphone principal:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {profile?.phone_1 || "Non spécifié"}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Téléphone secondaire:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {profile?.phone_2 || "Non spécifié"}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Email principal:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {profile?.email_1 || "Non spécifié"}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Email secondaire:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {profile?.email_2 || "Non spécifié"}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </SectionCard>

            {/* Professional Information */}
            <SectionCard>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Edit color="primary" />
                  Informations Professionnelles
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={2}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Profession:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {profile?.profession || "Non spécifiée"}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Employeur:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {profile?.employer || "Non spécifié"}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Revenus mensuels:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {profile?.monthly_gross_income
                        ? `${profile.monthly_gross_income.toLocaleString()} CDF`
                        : "Non spécifiés"}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </SectionCard>

            {/* Action Buttons */}
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
                disabled={loading || submitting}
                sx={{ flex: 1 }}
              >
                Précédent
              </Button>
              <Button
                variant="contained"
                onClick={() => setShowConfirmModal(true)}
                disabled={loading || submitting}
                sx={{
                  flex: 1,
                  backgroundColor: "#000000",
                  color: "#FFCC00",
                  "&:hover": {
                    backgroundColor: "#1a1a1a",
                  },
                }}
                startIcon={<Send />}
              >
                Soumettre la Demande
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </StyledCard>

      {/* Confirmation Modal */}
      <Dialog
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <CheckCircle color="primary" />
            Confirmer la Soumission
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Êtes-vous sûr de vouloir soumettre votre demande d'ouverture de
            compte ?
          </DialogContentText>
          <DialogContentText>
            Une fois soumise, votre demande sera transmise à notre équipe pour
            traitement. Vous recevrez une confirmation par email et pourrez
            suivre l'avancement de votre demande.
          </DialogContentText>
          <Box
            sx={{ mt: 2, p: 2, backgroundColor: "#F8F9FA", borderRadius: 1 }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
              Résumé de votre demande :
            </Typography>
            <Typography variant="body2">
              • Numéro : {application?.application_number}
            </Typography>
            <Typography variant="body2">
              • Type :{" "}
              {application?.account_type
                ? getAccountTypeLabel(application.account_type)
                : "Non spécifié"}
            </Typography>
            <Typography variant="body2">
              • Agence :{" "}
              {application?.agency_id
                ? getAgencyName(application.agency_id)
                : "Non spécifiée"}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setShowConfirmModal(false)}
            disabled={submitting}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting}
            sx={{
              backgroundColor: "#000000",
              color: "#FFCC00",
              "&:hover": {
                backgroundColor: "#1a1a1a",
              },
            }}
          >
            {submitting ? "Soumission..." : "Confirmer et Soumettre"}
          </Button>
        </DialogActions>
      </Dialog>
    </ContentBox>
  );
};

export default ReviewStep;
