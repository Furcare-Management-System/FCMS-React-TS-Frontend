import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider";
import { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import Navbar from "../Navbar";
import { Box, CssBaseline, Stack } from "@mui/material";
import Roles from "../../pages/Roles";
import Sidebar from "../PetOwnerSidebar";

export default function PetOwnerLayout() {
  return (
    <Box>
      <CssBaseline />
      <Navbar />
      <Stack direction="row" justifyContent="space-between">
        <Sidebar />
        <Box flex={5}>
          petowner layout
          <Outlet />
        </Box>
      </Stack>
    </Box>
  );
}
