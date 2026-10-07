import { AppBar, Box, Container } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "#FFFFFF",
        color: "#111111",
        borderBottom: "1px solid #E8E8E8",
        borderRadius: 0,
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            minHeight: { xs: 64, md: 119 },
            display: "flex",
            flexDirection: { xs: "row", md: "column" },
            alignItems: { xs: "center", md: "stretch" },
            justifyContent: { xs: "space-between", md: "flex-start" },
          }}
        >
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              justifyContent: "flex-end",
              alignItems: "center",
              minHeight: 44,
              borderBottom: "1px solid #F0F0F0",
            }}
          >
            <LanguageSwitcher />
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flex: { md: 1 },
              width: { xs: "100%", md: "auto" },
              py: { xs: 1, md: 0 },
            }}
          >
            <Box
              component="button"
              type="button"
              onClick={() => navigate("/")}
              aria-label="Rawbank"
              sx={{
                border: 0,
                background: "none",
                p: 0,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                src="/rawbank-logo.png"
                alt="Rawbank"
                style={{
                  height: 40,
                  width: "auto",
                  display: "block",
                }}
              />
            </Box>

            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <LanguageSwitcher />
            </Box>
          </Box>
        </Box>
      </Container>
    </AppBar>
  );
};

export default Header;
