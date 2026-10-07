import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import YouTubeIcon from "@mui/icons-material/YouTube";
import XIcon from "@mui/icons-material/X";
import { Box, Container, IconButton, Link, Typography } from "@mui/material";
import React from "react";

const chromeFont = '"Montserrat", sans-serif';
const accent = "#F5A623";

const columns: { title: string; links: string[] }[] = [
  {
    title: "La banque",
    links: [
      "A propos",
      "Gouvernance",
      "Responsabilité Sociétale d’Entreprise",
      "Rapports Annuels",
      "Rapport Pilier III",
      "Trouver une agence",
      "Réseau ATM",
      "Agents Bancaires illicocash",
      "Moneygram",
      "Banque Correspondante",
    ],
  },
  {
    title: "Particuliers",
    links: [
      "Comptes",
      "Cartes",
      "Banque à distance",
      "Packages",
      "Bancassurance",
      "Services",
      "Crédits",
      "Le Programme We Act",
    ],
  },
  {
    title: "Corporate",
    links: [
      "Comptes",
      "Cartes",
      "Crédits",
      "Financement",
      "Services en ligne",
      "Optimus Client",
      "Trésorerie",
      "Salle de marchés",
      "PGS",
      "Lady’s First",
    ],
  },
  {
    title: "Media Room",
    links: [
      "Accueil",
      "Actualités",
      "Communiqué de presse",
      "Nominations",
      "Kit de presse",
    ],
  },
  {
    title: "",
    links: [
      "B.P. Cybersecurite",
      "CGU Rawbot",
      "Charte de modération",
      "FAQ",
      "Tarification standard",
      "RGO",
      "Réclamations",
      "Signalement",
    ],
  },
];

const values = [
  "Ambition",
  "Initiative",
  "Collaboration",
  "Innovation",
  "Rendement",
];

const socials = [
  { label: "Facebook", icon: <FacebookIcon /> },
  { label: "LinkedIn", icon: <LinkedInIcon /> },
  { label: "X", icon: <XIcon /> },
  { label: "Instagram", icon: <InstagramIcon /> },
  { label: "YouTube", icon: <YouTubeIcon /> },
];

const stopNavigation = (event: React.MouseEvent) => {
  event.preventDefault();
};

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#F0F0F0",
        color: "#334155",
        fontFamily: chromeFont,
        pt: { xs: 5, md: 7 },
        pb: 4,
        mt: "auto",
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "flex-start" },
            gap: 3,
            mb: { xs: 4, md: 6 },
          }}
        >
          <Box>
            <img
              src="/rawbank-logo.png"
              alt="Rawbank"
              style={{ height: 48, width: "auto", display: "block" }}
            />
            <Typography
              sx={{
                mt: 2.5,
                fontFamily: chromeFont,
                fontSize: "1rem",
                fontWeight: 500,
                color: "#111111",
              }}
            >
              Une banque portée par des valeurs fortes.
            </Typography>
          </Box>

          <Typography
            sx={{
              fontFamily: chromeFont,
              fontWeight: 700,
              fontSize: { xs: "1.05rem", md: "1.25rem" },
              color: "#111111",
              maxWidth: 480,
              lineHeight: 1.45,
              textAlign: { xs: "left", md: "right" },
            }}
          >
            {values.map((value, index) => (
              <React.Fragment key={value}>
                {index > 0 && (
                  <Box component="span" sx={{ color: accent }}>
                    ,{" "}
                  </Box>
                )}
                {value}
              </React.Fragment>
            ))}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              lg: "repeat(5, minmax(0, 1fr))",
            },
            gap: { xs: 4, md: 3 },
            mb: 5,
          }}
        >
          {columns.map((column) => (
            <Box key={column.title || "legal"}>
              <Typography
                component="h2"
                aria-hidden={!column.title}
                sx={{
                  fontFamily: chromeFont,
                  fontWeight: 700,
                  fontSize: "1.125rem",
                  color: "#111111",
                  mb: 2,
                  minHeight: "1.5rem",
                  visibility: column.title ? "visible" : "hidden",
                }}
              >
                {column.title || "Liens"}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
                {column.links.map((text) => (
                  <Link
                    key={text}
                    href="#"
                    underline="none"
                    onClick={stopNavigation}
                    sx={{
                      color: "#5C6770",
                      fontFamily: chromeFont,
                      fontSize: "0.9375rem",
                      lineHeight: 1.4,
                      width: "fit-content",
                      "&:hover": { color: "#111111" },
                    }}
                  >
                    {text}
                  </Link>
                ))}
              </Box>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            gap: 2,
            pt: 3,
          }}
        >
          <Typography
            sx={{
              fontFamily: chromeFont,
              fontSize: "0.875rem",
              color: "#5C6770",
            }}
          >
            Copyright © {currentYear} Rawbank. Site web conçu par CRACKWITS.
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {["Politique de confidentialité", "Termes et conditions générales"].map(
              (text) => (
                <Link
                  key={text}
                  href="#"
                  underline="none"
                  onClick={stopNavigation}
                  sx={{
                    fontFamily: chromeFont,
                    fontSize: "0.875rem",
                    color: "#5C6770",
                    "&:hover": { color: "#111111" },
                  }}
                >
                  {text}
                </Link>
              )
            )}
          </Box>

          <Box sx={{ display: "flex", gap: 0.5 }}>
            {socials.map((social) => (
              <IconButton
                key={social.label}
                component="a"
                href="#"
                aria-label={social.label}
                onClick={stopNavigation}
                sx={{
                  color: "#111111",
                  "&:hover": { color: accent, backgroundColor: "transparent" },
                }}
              >
                {social.icon}
              </IconButton>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
