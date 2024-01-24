import styled from "@emotion/styled";
import {
  Archive,
  Home,
  ListRounded,
  MedicalServices,
  MiscellaneousServices,
  People,
  Person,
  Person2,
  Pets,
} from "@mui/icons-material";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@mui/material";
import { useState } from "react";
import SettingsTabs from "../components/SettingsTabs";

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

export default function Settings() {

  return (
    <>
      <SettingsTabs />
    </>
  );
}
