import { HelpOutline } from "@mui/icons-material";
import {
  IconButton,
  Tooltip,
  TooltipProps,
  styled,
  tooltipClasses,
} from "@mui/material";
import React from "react";

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#000000",
    color: "#FFCC00",
    maxWidth: 300,
    fontSize: theme.typography.pxToRem(13),
    border: "1px solid #FFCC00",
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(1),
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#000000",
    "&::before": {
      border: "1px solid #FFCC00",
    },
  },
}));

interface InfoTooltipProps {
  title: string;
  size?: "small" | "medium";
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ title, size = "small" }) => {
  return (
    <CustomTooltip title={title} arrow placement="top">
      <IconButton
        size={size}
        sx={{
          color: "#FFCC00",
          padding: size === "small" ? 0.5 : 1,
          "&:hover": {
            backgroundColor: "rgba(255, 204, 0, 0.1)",
          },
        }}
      >
        <HelpOutline fontSize={size} />
      </IconButton>
    </CustomTooltip>
  );
};

export default InfoTooltip;
