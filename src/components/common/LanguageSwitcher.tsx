import { Box, Button } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

const chromeFont = '"Montserrat", sans-serif';
const accent = "#F5A623";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const current = i18n.language?.toLowerCase().startsWith("en") ? "en" : "fr";

  const renderOption = (code: "fr" | "en", label: string) => {
    const active = current === code;
    return (
      <Button
        onClick={() => i18n.changeLanguage(code)}
        aria-pressed={active}
        disableRipple
        sx={{
          minWidth: 0,
          px: 0.5,
          py: 0.25,
          color: active ? "#111111" : "#64748B",
          fontFamily: chromeFont,
          fontWeight: active ? 700 : 500,
          fontSize: "0.8125rem",
          letterSpacing: "0.06em",
          lineHeight: 1.2,
          borderRadius: 0,
          borderBottom: active ? `2px solid ${accent}` : "2px solid transparent",
          "&:hover": {
            backgroundColor: "transparent",
            color: "#111111",
          },
        }}
      >
        {label}
      </Button>
    );
  };

  return (
    <Box
      role="group"
      aria-label="Language"
      sx={{ display: "flex", alignItems: "center", gap: 0.75 }}
    >
      {renderOption("fr", "FR")}
      <Box
        component="span"
        aria-hidden
        sx={{ color: "#CBD5E1", fontSize: "0.75rem", lineHeight: 1 }}
      >
        |
      </Box>
      {renderOption("en", "EN")}
    </Box>
  );
};

export default LanguageSwitcher;
