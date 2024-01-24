import styled from "@emotion/styled";
import {
  Home,
  ListAlt,
  ListRounded,
  People,
  Pets,
  Settings,
  Vaccines,
} from "@mui/icons-material";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";

const StyledList = styled(List)(({ theme }) => ({
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
}));

export default function Sidebar() {
  const [selectedIndex, setSelectedIndex] = useState(
    parseInt(localStorage.getItem("selectedIndex")) || 0
  );

  const handleListItemClick = (index) => {
    setSelectedIndex(index);
    localStorage.setItem("selectedIndex", index);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const [open, setOpen] = useState(!isMobile);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <>
    
      <Drawer
        sx={{
          // width: "240px",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: "240px",
            boxSizing: "border-box",
            marginTop: "75px",
          },
          display: { xs: 'none',sm:'block', md: 'block' },
          width: 240,
          zIndex: 999,
        }}
        variant="permanent"
        anchor="left"
        // hideBackdrop={true}
        // open={isMobile ? false : true}
        // variant={isMobile ? 'temporary' : 'persistent'}
      >
        <StyledList>
          <ListItem>
            <ListItemButton
              selected={selectedIndex === 6}
              onClick={() => handleListItemClick(6)}
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
              selected={selectedIndex === 7}
              onClick={() => handleListItemClick(7)}
              component={Link}
              to="/admin/appointments"
            >
              <ListItemText primary="Appointments"></ListItemText>
              <ListItemIcon>
                <ListRounded />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              selected={selectedIndex === 4}
              onClick={() => handleListItemClick(4)}
              component={Link}
              to="/admin/petowners"
            >
              <ListItemText primary="Pet Owners"></ListItemText>
              <ListItemIcon>
                <People />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              selected={selectedIndex === 9}
              onClick={() => handleListItemClick(9)}
              component={Link}
              to="/admin/pets"
            >
              <ListItemText primary="Pets"></ListItemText>
              <ListItemIcon>
                <Pets />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              selected={selectedIndex === 10}
              onClick={() => handleListItemClick(10)}
              component={Link}
              to="/admin/availed-services"
            >
              <ListItemText primary="Services Logs"></ListItemText>
              <ListItemIcon>
                <ListAlt />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              selected={selectedIndex === 11}
              onClick={() => handleListItemClick(11)}
              component={Link}
              to="/admin/vaccinations"
            >
              <ListItemText primary="Vaccination Records"></ListItemText>
              <ListItemIcon>
                <Vaccines />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        </StyledList>
      </Drawer>
    </>
  );
}
