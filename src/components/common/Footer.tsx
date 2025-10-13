import {
  Box,
  Container,
  Divider,
  IconButton,
  Link,
  Typography,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import React from "react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "La banque",
      links: [
        { text: "A propos", href: "#" },
        { text: "Gouvernance", href: "#" },
        { text: "RSE", href: "#" },
        { text: "Rapports Annuels", href: "#" },
        { text: "Actualités", href: "#" },
      ],
    },
    {
      title: "Particuliers",
      links: [
        { text: "Comptes", href: "#" },
        { text: "Cartes", href: "#" },
        { text: "Banque à distance", href: "#" },
        { text: "Packages", href: "#" },
        { text: "Services", href: "#" },
      ],
    },
    {
      title: "Corporate",
      links: [
        { text: "Comptes", href: "#" },
        { text: "Cartes", href: "#" },
        { text: "Crédits", href: "#" },
        { text: "Financement", href: "#" },
        { text: "Services en ligne", href: "#" },
      ],
    },
    {
      title: "Assistance",
      links: [
        { text: "FAQ", href: "#" },
        { text: "Réclamations", href: "#" },
        { text: "Contactez-nous", href: "#" },
        { text: "Trouver une agence", href: "#" },
        { text: "Réseau ATM", href: "#" },
      ],
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#000000",
        color: "#FFFFFF",
        pt: { xs: 4, md: 6 },
        pb: 3,
        mt: "auto",
      }}
    >
      <Container maxWidth="xl">
        {/* Footer Content */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 4,
            mb: 4,
          }}
        >
          {footerSections.map((section, index) => (
            <Box key={index}>
              <Typography
                variant="h6"
                sx={{
                  color: "#FFCC00",
                  fontSize: "1rem",
                  fontWeight: 600,
                  mb: 2,
                }}
              >
                {section.title}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {section.links.map((link, linkIndex) => (
                  <Link
                    key={linkIndex}
                    href={link.href}
                    underline="none"
                    sx={{
                      color: "#FFFFFF",
                      fontSize: "0.875rem",
                      transition: "color 0.2s ease",
                      "&:hover": {
                        color: "#FFCC00",
                      },
                    }}
                  >
                    {link.text}
                  </Link>
                ))}
              </Box>
            </Box>
          ))}
        </Box>

        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", mb: 3 }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "center", md: "center" },
            gap: 2,
          }}
        >
          {/* Copyright */}
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: "0.875rem",
            }}
          >
            Copyright © {currentYear} Rawbank
          </Typography>

          {/* Social Media Icons */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              href="https://www.facebook.com/rawbank"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "#FFFFFF",
                "&:hover": {
                  color: "#FFCC00",
                  backgroundColor: "rgba(255, 204, 0, 0.1)",
                },
              }}
            >
              <FacebookIcon />
            </IconButton>
            <IconButton
              href="https://www.linkedin.com/company/rawbank"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "#FFFFFF",
                "&:hover": {
                  color: "#FFCC00",
                  backgroundColor: "rgba(255, 204, 0, 0.1)",
                },
              }}
            >
              <LinkedInIcon />
            </IconButton>
            <IconButton
              href="https://twitter.com/rawbank"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "#FFFFFF",
                "&:hover": {
                  color: "#FFCC00",
                  backgroundColor: "rgba(255, 204, 0, 0.1)",
                },
              }}
            >
              <TwitterIcon />
            </IconButton>
            <IconButton
              href="https://www.instagram.com/rawbank"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "#FFFFFF",
                "&:hover": {
                  color: "#FFCC00",
                  backgroundColor: "rgba(255, 204, 0, 0.1)",
                },
              }}
            >
              <InstagramIcon />
            </IconButton>
            <IconButton
              href="https://www.youtube.com/rawbank"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "#FFFFFF",
                "&:hover": {
                  color: "#FFCC00",
                  backgroundColor: "rgba(255, 204, 0, 0.1)",
                },
              }}
            >
              <YouTubeIcon />
            </IconButton>
          </Box>

          {/* Legal Links */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Link
              href="#"
              underline="none"
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "0.875rem",
                "&:hover": {
                  color: "#FFCC00",
                },
              }}
            >
              Politique de confidentialité
            </Link>
            <Link
              href="#"
              underline="none"
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "0.875rem",
                "&:hover": {
                  color: "#FFCC00",
                },
              }}
            >
              Termes et conditions générales
            </Link>
          </Box>
        </Box>

        {/* Ethics Notice */}
        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            textAlign: "center",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: "0.75rem",
              lineHeight: 1.6,
              display: "block",
            }}
          >
            En cas de constatation d'une tentative de corruption ou d'une
            activité suspecte contraire à l'éthique, merci de signaler
            immédiatement l'incident à l'adresse{" "}
            <Link
              href="mailto:signalements@rawbank.cd"
              sx={{
                color: "#FFCC00",
                textDecoration: "underline",
              }}
            >
              signalements@rawbank.cd
            </Link>
            .
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: "0.75rem",
              lineHeight: 1.6,
              display: "block",
              mt: 1,
            }}
          >
            Tout signalement doit être fait de bonne foi et sera traité de
            manière confidentielle. Aucune forme de représailles ne sera
            tolérée à l'encontre de ceux qui rapportent des incidents d'éthique.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

