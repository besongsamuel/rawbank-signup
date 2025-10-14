import { Lock, Security, VerifiedUser } from "@mui/icons-material";
import { Box, Chip, Stack, Typography } from "@mui/material";
import React from "react";

const TrustSignals: React.FC = () => {
  return (
    <Box
      sx={{
        py: 2,
        px: 3,
        backgroundColor: "rgba(0, 0, 0, 0.02)",
        borderRadius: 2,
        border: "1px solid rgba(0, 0, 0, 0.05)",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        justifyContent="center"
        alignItems="center"
        flexWrap="wrap"
      >
        <Chip
          icon={<Lock sx={{ fontSize: 16 }} />}
          label="Chiffrement bancaire"
          size="small"
          sx={{
            backgroundColor: "rgba(255, 204, 0, 0.1)",
            color: "#000",
            fontWeight: 500,
            border: "1px solid rgba(255, 204, 0, 0.3)",
          }}
        />
        <Chip
          icon={<Security sx={{ fontSize: 16 }} />}
          label="Données sécurisées"
          size="small"
          sx={{
            backgroundColor: "rgba(255, 204, 0, 0.1)",
            color: "#000",
            fontWeight: 500,
            border: "1px solid rgba(255, 204, 0, 0.3)",
          }}
        />
        <Chip
          icon={<VerifiedUser sx={{ fontSize: 16 }} />}
          label="Rawbank officiel"
          size="small"
          sx={{
            backgroundColor: "rgba(255, 204, 0, 0.1)",
            color: "#000",
            fontWeight: 500,
            border: "1px solid rgba(255, 204, 0, 0.3)",
          }}
        />
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          🎉 <strong>10,000+</strong> clients satisfaits
        </Typography>
      </Stack>
    </Box>
  );
};

export default TrustSignals;
