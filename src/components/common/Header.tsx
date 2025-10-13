import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import LanguageSwitcher from "./LanguageSwitcher";

const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    handleMenuClose();
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
    handleMenuClose();
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "#000000",
        borderBottom: "1px solid rgba(255, 204, 0, 0.2)",
        borderRadius: 0,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 64, md: 80 },
            py: 1,
          }}
        >
          {/* Logo */}
          <Box
            onClick={() => navigate("/")}
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              mr: 4,
            }}
          >
            <img
              src="/rawbank-logo.png"
              alt="Rawbank"
              style={{
                height: isMobile ? "32px" : "40px",
                width: "auto",
              }}
            />
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              {!user ? (
                <>
                  <Button
                    onClick={() => navigate("/signup")}
                    sx={{
                      color: "#FFFFFF",
                      fontWeight: 500,
                      fontSize: "1rem",
                      "&:hover": {
                        backgroundColor: "rgba(255, 204, 0, 0.1)",
                        color: "#FFCC00",
                      },
                    }}
                  >
                    Ouvrir un compte
                  </Button>
                  <Button
                    onClick={() => navigate("/login")}
                    sx={{
                      color: "#FFFFFF",
                      fontWeight: 500,
                      fontSize: "1rem",
                      "&:hover": {
                        backgroundColor: "rgba(255, 204, 0, 0.1)",
                        color: "#FFCC00",
                      },
                    }}
                  >
                    Connexion
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => navigate("/app")}
                    sx={{
                      color: "#FFFFFF",
                      fontWeight: 500,
                      fontSize: "1rem",
                      "&:hover": {
                        backgroundColor: "rgba(255, 204, 0, 0.1)",
                        color: "#FFCC00",
                      },
                    }}
                  >
                    Mon Compte
                  </Button>
                  <Button
                    onClick={handleSignOut}
                    sx={{
                      color: "#FFFFFF",
                      fontWeight: 500,
                      fontSize: "1rem",
                      "&:hover": {
                        backgroundColor: "rgba(255, 204, 0, 0.1)",
                        color: "#FFCC00",
                      },
                    }}
                  >
                    Déconnexion
                  </Button>
                </>
              )}
            </Box>
          )}

          {/* Right side - Language Switcher */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <LanguageSwitcher />

            {/* Mobile Menu */}
            {isMobile && (
              <>
                <IconButton
                  size="large"
                  edge="end"
                  color="inherit"
                  aria-label="menu"
                  onClick={handleMenuOpen}
                  sx={{
                    color: "#FFFFFF",
                    "&:hover": {
                      backgroundColor: "rgba(255, 204, 0, 0.1)",
                    },
                  }}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  {!user
                    ? [
                        <MenuItem
                          key="signup"
                          onClick={() => handleNavigation("/signup")}
                        >
                          Ouvrir un compte
                        </MenuItem>,
                        <MenuItem
                          key="login"
                          onClick={() => handleNavigation("/login")}
                        >
                          Connexion
                        </MenuItem>,
                      ]
                    : [
                        <MenuItem
                          key="account"
                          onClick={() => handleNavigation("/app")}
                        >
                          Mon Compte
                        </MenuItem>,
                        <MenuItem key="signout" onClick={handleSignOut}>
                          Déconnexion
                        </MenuItem>,
                      ]}
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
