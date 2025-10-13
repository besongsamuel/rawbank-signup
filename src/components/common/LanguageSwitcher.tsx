import { Language } from "@mui/icons-material";
import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    handleClose();
  };

  const getCurrentLanguage = () => {
    return i18n.language === "en" ? "English" : "Français";
  };

  return (
    <>
      <Tooltip title={t("language.switch")}>
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{
            color: "white",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <Language />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem
          onClick={() => handleLanguageChange("fr")}
          selected={i18n.language === "fr"}
        >
          🇫🇷 {t("language.french")}
        </MenuItem>
        <MenuItem
          onClick={() => handleLanguageChange("en")}
          selected={i18n.language === "en"}
        >
          🇺🇸 {t("language.english")}
        </MenuItem>
      </Menu>
    </>
  );
};

export default LanguageSwitcher;
