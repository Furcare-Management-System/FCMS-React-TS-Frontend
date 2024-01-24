import styled from "@emotion/styled";
import {
  Add,
  Archive,
  Home,
  ListAlt,
  PaymentOutlined,
  People,
  Person,
  Person2,
  Pets,
  Reorder,
  Settings,
} from "@mui/icons-material";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";

const StyledList = styled(List)({
  // selected and (selected + hover) states
  "&& .Mui-selected, && .Mui-selected:hover": {
    backgroundColor: "black",
    "&, & .MuiListItemIcon-root": {
      color: "white",
    },
  },
  // hover states
  "& .MuiListItemButton-root:hover": {
    backgroundColor: "black",
    "&, & .MuiListItemIcon-root": {
      color: "white",
    },
  },
});

export default function PetOwnerSidebar() {
  const [selectedIndex, setSelectedIndex] = useState(
    parseInt(localStorage.getItem("selectedIndex")) || 0
  );

  // Update selectedIndex and store it in localStorage
  const handleListItemClick = (index) => {
    setSelectedIndex(index);
    localStorage.setItem("selectedIndex", index);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:600px)");

  const [open, setOpen] = useState(!isMobile);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        id="sidebar-button"
        onClick={handleDrawerOpen}
        edge="start"
        sx={{
          display: { xs: "block", sm: "none" },
          width: 50,mb:-3
        }}
      >
        <Reorder sx={{ width: 40, height: 40 }} />
      </IconButton>
      <Drawer
        sx={{
          width: "240px",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: "240px",
            boxSizing: "border-box",
            marginTop: "70px",
          },
          display: { xs: "block", sm: "block" },
          zIndex: 2,
        }}
        variant={isMobile ? "temporary" : "permanent"}
        anchor="left"
        open={open}
        onClose={handleDrawerClose}
      >
        <StyledList>
          <ListItem>
            <ListItemButton
              selected={selectedIndex === 0}
              onClick={() => handleListItemClick(0)}
              component={Link}
              to="/home"
            >
              <ListItemText primary="Home"></ListItemText>
              <ListItemIcon>
                <Home />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              selected={selectedIndex === 2}
              onClick={() => handleListItemClick(2)}
              component={Link}
              to="/petowner/appointments"
            >
              <ListItemText primary="Appointments"></ListItemText>
              <ListItemIcon>
                <ListAlt />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              selected={selectedIndex === 1}
              onClick={() => handleListItemClick(1)}
              component={Link}
              to="/petowner/pets"
            >
              <ListItemText primary="Pets"></ListItemText>
              <ListItemIcon>
                <Pets />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              selected={selectedIndex === 3}
              onClick={() => handleListItemClick(3)}
              component={Link}
              to="/petowner/availed"
            >
              <ListItemText primary="Availed Services"></ListItemText>
              <ListItemIcon>
                <ListAlt />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              selected={selectedIndex === 4}
              onClick={() => handleListItemClick(4)}
              component={Link}
              to="/petowner/payments"
            >
              <ListItemText primary="Payments History"></ListItemText>
              <ListItemIcon>
                <PaymentOutlined />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        </StyledList>
      </Drawer>
    </>
  );
}
