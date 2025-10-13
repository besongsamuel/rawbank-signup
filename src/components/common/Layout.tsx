import { Alert, Box } from "@mui/material";
import React from "react";
import Footer from "./Footer";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  showHeader = true,
  showFooter = true,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* Demo Disclaimer Banner */}
      <Alert
        severity="warning"
        sx={{
          borderRadius: 0,
          backgroundColor: "#FFF3CD",
          borderBottom: "1px solid #FFEAA7",
          "& .MuiAlert-message": {
            width: "100%",
            textAlign: "center",
            fontWeight: 500,
          },
        }}
      >
        <strong>⚠️ DISCLAIMER:</strong> This is NOT an official Rawbank website.
        This application was created solely for demonstration purposes. Please
        visit{" "}
        <a
          href="https://rawbank.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#000000", textDecoration: "underline" }}
        >
          rawbank.com
        </a>{" "}
        for official banking services.
      </Alert>

      {showHeader && <Header />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </Box>
      {showFooter && <Footer />}
    </Box>
  );
};

export default Layout;
