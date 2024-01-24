import React from "react";
import { useStateContext } from "../contexts/ContextProvider";
import AdminHome from "./AdminHome";
import PetownerHome from "./PetownerPages/PetownerHome";
import StaffHome from "./StaffHome";

export default function Home() {
  const { user } = useStateContext();

  return (
    <>
      {user.role_id === "1" && <AdminHome />}
      {user.role_id === "2" && <StaffHome />}
      {user.role_id === "3" && <PetownerHome />}
    </>
  );
}
