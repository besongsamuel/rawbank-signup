import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { User } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  accountType: string;
  occupation: string;
  monthlyIncome: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}

const GradientBox = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
}));

const LogoSection = styled(Paper)(({ theme }) => ({
  background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
  color: "white",
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  minHeight: "600px",
  borderRadius: "20px 0 0 20px",
}));

const FormSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: "white",
  borderRadius: "0 20px 20px 0",
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 20,
  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
  overflow: "hidden",
}));

function App(): React.JSX.Element {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    accountType: "",
    occupation: "",
    monthlyIncome: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is already signed in
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSelectChange = (event: any) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignUp = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    if (!formData.termsAccepted) {
      setMessage("Veuillez accepter les conditions d'utilisation");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            account_type: formData.accountType,
            occupation: formData.occupation,
            monthly_income: formData.monthlyIncome,
          },
        },
      });

      if (error) {
        setMessage(`Erreur: ${error.message}`);
      } else {
        setMessage(
          "Votre demande d'ouverture de compte a été envoyée avec succès! Vérifiez votre email pour la confirmation."
        );
      }
    } catch (error) {
      setMessage(
        `Erreur: ${
          error instanceof Error
            ? error.message
            : "Une erreur inconnue s'est produite"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async (): Promise<void> => {
    await supabase.auth.signOut();
    setUser(null);
    setMessage("");
  };

  if (user) {
    return (
      <GradientBox>
        <Container maxWidth="sm">
          <StyledCard>
            <CardContent sx={{ textAlign: "center", p: 4 }}>
              <Typography variant="h2" gutterBottom>
                Bienvenue chez Rawbank!
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Vous êtes connecté en tant que: {user.email}
              </Typography>
              <Button
                variant="contained"
                color="error"
                onClick={handleSignOut}
                size="large"
              >
                Se déconnecter
              </Button>
            </CardContent>
          </StyledCard>
        </Container>
      </GradientBox>
    );
  }

  return (
    <GradientBox>
      <Container maxWidth="lg">
        <StyledCard>
          <Box
            sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}
          >
            <Box sx={{ flex: { xs: "none", md: "0 0 33.333%" } }}>
              <LogoSection elevation={0}>
                <Typography variant="h1" gutterBottom>
                  Rawbank
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 300 }}>
                  Une banque portée par des valeurs fortes
                </Typography>
              </LogoSection>
            </Box>
            <Box sx={{ flex: { xs: "none", md: "0 0 66.667%" } }}>
              <FormSection>
                <Box sx={{ mb: 3, textAlign: "center" }}>
                  <Typography variant="h2" gutterBottom>
                    Ouvrir un compte
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    Formulaire d'enregistrement pour la demande d'ouverture d'un
                    compte bancaire
                  </Typography>
                  <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                    Renseignez les champs suivants afin d'envoyer votre demande
                    d'ouverture de compte
                  </Typography>
                </Box>

                <Box component="form" onSubmit={handleSignUp}>
                  <Stack spacing={3}>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        flexDirection: { xs: "column", sm: "row" },
                      }}
                    >
                      <TextField
                        fullWidth
                        label="Prénom"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        placeholder="Votre prénom"
                      />
                      <TextField
                        fullWidth
                        label="Nom"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        placeholder="Votre nom"
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        flexDirection: { xs: "column", sm: "row" },
                      }}
                    >
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="votre.email@exemple.com"
                      />
                      <TextField
                        fullWidth
                        label="Téléphone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="+243 XXX XXX XXX"
                      />
                    </Box>

                    <TextField
                      fullWidth
                      label="Adresse"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      placeholder="Votre adresse complète"
                    />

                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        flexDirection: { xs: "column", sm: "row" },
                      }}
                    >
                      <TextField
                        fullWidth
                        label="Ville"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        placeholder="Votre ville"
                      />
                      <FormControl fullWidth required>
                        <InputLabel>Type de compte</InputLabel>
                        <Select
                          name="accountType"
                          value={formData.accountType}
                          onChange={handleSelectChange}
                          label="Type de compte"
                        >
                          <MenuItem value="">
                            Sélectionnez un type de compte
                          </MenuItem>
                          <MenuItem value="particulier">
                            Compte Particulier
                          </MenuItem>
                          <MenuItem value="professionnel">
                            Compte Professionnel
                          </MenuItem>
                          <MenuItem value="entreprise">
                            Compte Entreprise
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        flexDirection: { xs: "column", sm: "row" },
                      }}
                    >
                      <TextField
                        fullWidth
                        label="Profession"
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleInputChange}
                        required
                        placeholder="Votre profession"
                      />
                      <FormControl fullWidth>
                        <InputLabel>Revenus mensuels</InputLabel>
                        <Select
                          name="monthlyIncome"
                          value={formData.monthlyIncome}
                          onChange={handleSelectChange}
                          label="Revenus mensuels"
                        >
                          <MenuItem value="">Sélectionnez une tranche</MenuItem>
                          <MenuItem value="0-500">0 - 500 USD</MenuItem>
                          <MenuItem value="500-1000">500 - 1,000 USD</MenuItem>
                          <MenuItem value="1000-2500">
                            1,000 - 2,500 USD
                          </MenuItem>
                          <MenuItem value="2500-5000">
                            2,500 - 5,000 USD
                          </MenuItem>
                          <MenuItem value="5000+">Plus de 5,000 USD</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        flexDirection: { xs: "column", sm: "row" },
                      }}
                    >
                      <TextField
                        fullWidth
                        label="Mot de passe"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        placeholder="Minimum 8 caractères"
                      />
                      <TextField
                        fullWidth
                        label="Confirmer le mot de passe"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        placeholder="Confirmez votre mot de passe"
                      />
                    </Box>

                    <FormControlLabel
                      control={
                        <Checkbox
                          name="termsAccepted"
                          checked={formData.termsAccepted}
                          onChange={handleInputChange}
                          required
                        />
                      }
                      label={
                        <Typography variant="body2">
                          J'accepte les{" "}
                          <Button
                            variant="text"
                            size="small"
                            onClick={() =>
                              alert("Conditions d'ouverture de compte")
                            }
                            sx={{
                              p: 0,
                              minWidth: "auto",
                              textDecoration: "underline",
                            }}
                          >
                            conditions d'ouverture de compte
                          </Button>{" "}
                          et la{" "}
                          <Button
                            variant="text"
                            size="small"
                            onClick={() =>
                              alert("Politique de confidentialité")
                            }
                            sx={{
                              p: 0,
                              minWidth: "auto",
                              textDecoration: "underline",
                            }}
                          >
                            politique de confidentialité
                          </Button>{" "}
                          *
                        </Typography>
                      }
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading}
                      fullWidth
                      sx={{ mt: 2 }}
                    >
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Envoyer la demande"
                      )}
                    </Button>
                  </Stack>
                </Box>

                {message && (
                  <Alert
                    severity={message.includes("Erreur") ? "error" : "success"}
                    sx={{ mt: 2 }}
                  >
                    {message}
                  </Alert>
                )}
              </FormSection>
            </Box>
          </Box>
        </StyledCard>
      </Container>
    </GradientBox>
  );
}

export default App;
