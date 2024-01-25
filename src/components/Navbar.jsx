import styled from "@emotion/styled";
import { Mail, Notifications } from "@mui/icons-material";
import {
  AppBar,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Profile from "./Profile";
import NotifIcon from "./NotifIcon";
import { useTheme } from "@emotion/react";

export default function Navbar() {
  const StyledToolbar = styled(Toolbar)({
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "#b71c1c",
  });

  const Icons = styled(Box)(({ theme }) => ({
    display: "flex",
    gap: "10px",
    alignItems: "center",
  }));

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <AppBar position="sticky">
      <StyledToolbar>
        <Box display="flex" flexDirection={"row"} alignItems={"center"}>
          <IconButton edge="start" color="inherit" aria-label="menu" 
          >
            <img
              src="/furcare-logo.png"
              height={"50"}
              width={"50"}
            />
          </IconButton>
          <Typography variant="h6" fontWeight="bold" align="center">
            {isMobile ? "Fur Care" : "Fur Care Clinic Management System"}
          </Typography>
        </Box>
        <Icons>
          <NotifIcon />
          <Profile />
        </Icons>
      </StyledToolbar>
    </AppBar>
  );
}
