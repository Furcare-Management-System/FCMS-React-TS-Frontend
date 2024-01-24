import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Box, Stack } from "@mui/material";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function StaffLayout() { 



  return (
    <>
    <Box>
      <Navbar />
      <Stack direction="row"  justifyContent="space-between">
        <Sidebar />
        <Box  flex={5} p={2}>
          staff layout
            <Outlet />
        </Box>
      </Stack>
    </Box>
    </>
  );
}
