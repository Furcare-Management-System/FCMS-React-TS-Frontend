import React, { useEffect, useState } from "react";
import { Box, CssBaseline, Grid } from "@mui/material";
import Navbar from "./Navbar";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import Sidebar from "./Sidebar";
import PetOwnerSidebar from "./PetOwnerSidebar";

export default function MainLayout() {
  const { user, token } = useStateContext();
  const navigate = useNavigate();

  if (!token) {
    return <Navigate to="/login" />;
  }

  let sidebarComponent = null;
  let dashboardComponent = null;

  switch (user.role_id) {
    case "1":
      sidebarComponent = <Sidebar />;
      break;
    case "2":
      sidebarComponent = <Sidebar />;
      break;
    case "3":
      sidebarComponent = <PetOwnerSidebar />;
      break;
    default:
      sidebarComponent = null;
  }

  return (
    <>
      <CssBaseline />
      <Box>
        {token && <Navbar />}
        <Box sx={{marginLeft:{sm:"240px"}}}>
          {sidebarComponent}
          <Box flex={5}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </>
  );
}
