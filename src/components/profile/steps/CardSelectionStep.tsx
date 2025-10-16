import { CreditCard, Info, Store } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useCallback, useEffect, useState } from "react";
import { useApplicationContext } from "../../../contexts/ApplicationContext";
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

const CardOptionBox = styled(Box)<{ selected: boolean }>(
  ({ theme, selected }) => ({
    border: selected ? "3px solid #FFCC00" : "2px solid #E0E0E0",
    borderRadius: theme.spacing(2),
    padding: theme.spacing(3),
    cursor: "pointer",
    transition: "all 0.3s ease",
    backgroundColor: selected ? "rgba(255, 204, 0, 0.05)" : "#FFFFFF",
    position: "relative",
    "&:hover": {
      borderColor: "#FFCC00",
      transform: "translateY(-4px)",
      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    },
  })
);

interface CardSelectionStepProps {
  cardType?: string;
  onDataChange: (cardType: string) => void;
  onNext: () => void;
  onPrev: () => void;
  loading?: boolean;
}

interface CardOption {
  id: string;
  name: string;
  description: string;
  features: string[];
  recommended?: boolean;
  badge?: string;
}

const CardSelectionStep: React.FC<CardSelectionStepProps> = ({
  cardType,
  onDataChange,
  onNext,
  onPrev,
  loading = false,
}) => {
  const { user, application, updateApplication } = useApplicationContext();
  const [selectedCard, setSelectedCard] = useState<string>(
    cardType || "carte_fidelite_usd"
  );
  const [agencyName, setAgencyName] = useState<string>("");
  const [loadingAgency, setLoadingAgency] = useState(true);

  // Fetch the selected agency
  useEffect(() => {
    const fetchAgency = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from("applications")
          .select("agency_id")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (!error && data?.agency_id) {
          // Map agency ID to name
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
          setAgencyName(agencies[data.agency_id] || data.agency_id);
        }
      } catch (error) {
        console.error("Error fetching agency:", error);
      } finally {
        setLoadingAgency(false);
      }
    };

    fetchAgency();
  }, [user?.id]);

  const cardOptions: CardOption[] = [
    {
      id: "carte_fidelite_usd",
      name: "La carte Fidelité",
      description:
        "La carte Fidélité USD est une carte de retrait locale liée au compte épargne Fidélité USD, utilisable en RDC uniquement à travers le réseau Multipay.",
      features: [
        "utilisable en RDC et dans tout les ATM du réseau Multipay",
        "Aucun frais de demande de solde",
      ],
      recommended: true,
      badge: "Recommandée",
    },
    {
      id: "carte_mosolo_cdf",
      name: "La carte Mosolo CDF",
      description:
        "La carte Mosolo CDF est une carte de retrait locale liée au compte épargne Fidélité CDF, utilisable en RDC uniquement à travers le réseau Mosolo.",
      features: [
        "utilisable en RDC dans tout le réseau Mosolo",
        "aucun frais de demande de solde",
      ],
    },
    {
      id: "visa_debit_cdf",
      name: "La carte de débit Visa CDF",
      description:
        "La carte VISA CDF est une carte de débit liée à un compte courant en Franc Congolais (CDF), utilisable en RDC uniquement à travers le réseau Multipay. Elle permet d'effectuer retraits de fonds et paiements en toute sécurité.",
      features: [
        "une carte de débit",
        "utilisable en RDC et à l'international",
      ],
    },
    {
      id: "visa_infinite",
      name: "La carte de débit Visa Infinite",
      description:
        "La carte Visa Infinite est destinée aux clients Privilege HNWI (High Net Worth Individuel), détenant des actifs et investissements substantiels qui s'élèvent à plusieurs Rands.",
      features: [
        "Destinée aux clients Privilege HNWI",
        "Services exclusifs et personnalisés",
        "Limites de transaction élevées",
      ],
    },
    {
      id: "visa_academia",
      name: "La carte Visa Academia",
      description:
        "La carte Academia est une carte de débit VISA Contactless liée au compte jeune Academia, utilisable en RDC et à l'international vous permettant de retirer des fonds et d'effectuer des paiements en toute sécurité.",
      features: [
        "carte de débit Visa Contactless",
        "utilisable en RDC et à l'international",
      ],
      badge: "Compte Jeune",
    },
    {
      id: "visa_debit_euro",
      name: "La carte de débit Visa EURO",
      description:
        "La carte VISA Euro est une carte de débit liée à un compte courant en Euro (EUR), qui permet d'effectuer des retrait des fonds, des paiements et des avances des opérations de cash advance en toute sécurité. La carte est utilisable en RDC et à l'international à travers le réseau Visa.",
      features: [
        "carte de débit",
        "service assurance travelia liée à la carte",
      ],
    },
    {
      id: "mastercard_travelers",
      name: "La Mastercard Traveler's",
      description:
        "La Mastercard Traveler's est une carte prépayée internationale en USD qui permet d'effectuer les retraits de fonds, les paiements et vos avances de fonds en toute sécurité. La carte est utilisée en RDC et à l'international.",
      features: [
        "carte de paiement international",
        "paiements et opérations d'avance de fonds sur le terminal TPE",
      ],
    },
    {
      id: "carte_virtuelle",
      name: "La carte virtuelle prépayée",
      description:
        "La carte virtuelle prépayée, en anglais Virtual Card est une carte électronique à utiliser pour des besoins de paiement et achats en ligne.",
      features: [
        "pas de cas de perte ou de vol de la carte",
        "liée à aucun compte bancaire",
      ],
    },
    {
      id: "visa_debit_upi",
      name: "La carte de débit UPI",
      description:
        "La carte de débit UPI est une carte internationale liée à un compte en Dollar Américain (USD), permettant les retraits, paiements et avances de fonds en toute sécurité.",
      features: [
        "carte de débit internationale",
        "utilisable en RDC et à l'international",
      ],
    },
  ];

  const handleCardSelect = (cardId: string) => {
    setSelectedCard(cardId);
    onDataChange(cardId);
  };

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      if (!user?.id) return;

      try {
        // Update the application with selected card type
        const { error } = await supabase
          .from("applications")
          .update({
            card_type: selectedCard,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1);

        if (error) {
          console.error("Error saving card type:", error);
          return;
        }

        onNext();
      } catch (error) {
        console.error("Error in card selection:", error);
      }
    },
    [selectedCard, user?.id, onNext]
  );

  return (
    <ContentBox>
      <StyledCard>
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <CreditCard sx={{ fontSize: 80, color: "#FFCC00", mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Choisissez votre carte bancaire
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sélectionnez la carte qui correspond le mieux à vos besoins
            </Typography>
          </Box>

          {/* Agency Note */}
          {agencyName && (
            <Alert
              severity="info"
              icon={<Store />}
              sx={{
                mb: 4,
                backgroundColor: "rgba(255, 204, 0, 0.1)",
                border: "1px solid #FFCC00",
                "& .MuiAlert-icon": {
                  color: "#000000",
                },
              }}
            >
              <Typography variant="body2">
                <strong>
                  <Info
                    sx={{ fontSize: 16, verticalAlign: "middle", mr: 0.5 }}
                  />
                  Note importante :
                </strong>{" "}
                Votre carte sera disponible pour retrait à l'
                <strong>{agencyName}</strong> que vous avez sélectionnée lors de
                votre inscription.
              </Typography>
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {/* Card Options Grid */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                  },
                  gap: 3,
                }}
              >
                {cardOptions.map((card) => (
                  <CardOptionBox
                    key={card.id}
                    selected={selectedCard === card.id}
                    onClick={() => handleCardSelect(card.id)}
                  >
                    {/* Badge */}
                    {card.badge && (
                      <Chip
                        label={card.badge}
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          backgroundColor: "#FFCC00",
                          color: "#000000",
                          fontWeight: 600,
                        }}
                      />
                    )}

                    {/* Card Icon */}
                    <Box sx={{ textAlign: "center", mb: 2 }}>
                      <CreditCard
                        sx={{
                          fontSize: 48,
                          color:
                            selectedCard === card.id ? "#FFCC00" : "#757575",
                        }}
                      />
                    </Box>

                    {/* Card Name */}
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        fontWeight: 600,
                        textAlign: "center",
                        color: selectedCard === card.id ? "#000000" : "#424242",
                      }}
                    >
                      {card.name}
                    </Typography>

                    {/* Card Description */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2, textAlign: "center", minHeight: 40 }}
                    >
                      {card.description}
                    </Typography>

                    {/* Features List */}
                    <Box sx={{ mt: 2 }}>
                      {card.features.map((feature, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            mb: 1,
                          }}
                        >
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              backgroundColor:
                                selectedCard === card.id
                                  ? "#FFCC00"
                                  : "#BDBDBD",
                              mt: 0.75,
                              mr: 1,
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: "0.8rem", lineHeight: 1.5 }}
                          >
                            {feature}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    {/* Selected Indicator */}
                    {selectedCard === card.id && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          borderRadius: 2,
                          pointerEvents: "none",
                          "&::before": {
                            content: '"✓"',
                            position: "absolute",
                            top: 12,
                            left: 12,
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            backgroundColor: "#FFCC00",
                            color: "#000000",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "bold",
                            fontSize: "1.2rem",
                          },
                        }}
                      />
                    )}
                  </CardOptionBox>
                ))}
              </Box>

              {/* Additional Information */}
              <Box
                sx={{
                  p: 3,
                  backgroundColor: "#F5F5F5",
                  borderRadius: 2,
                  mt: 3,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  <strong>💡 Bon à savoir :</strong> Vous pourrez modifier votre
                  choix de carte ultérieurement en contactant votre agence.
                  Toutes nos cartes sont sécurisées avec la technologie de puce
                  et PIN.
                </Typography>
              </Box>

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
                  disabled={loading}
                  sx={{ flex: 1 }}
                >
                  Précédent
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || !selectedCard}
                  sx={{
                    flex: 1,
                    backgroundColor: "#000000",
                    color: "#FFCC00",
                    "&:hover": {
                      backgroundColor: "#1a1a1a",
                    },
                  }}
                >
                  {loading ? "Enregistrement..." : "Sauvegarder et continuer"}
                </Button>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </StyledCard>
    </ContentBox>
  );
};

export default CardSelectionStep;
