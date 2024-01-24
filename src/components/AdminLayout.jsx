import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import PetOwnerLayout from "./PetOwnerLayout";

export default function AdminLayout() {
 
  return (
    <div>
    <Outlet/>
</div>
  );
}
