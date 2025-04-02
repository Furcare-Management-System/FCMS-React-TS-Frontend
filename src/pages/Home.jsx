import React from "react";
import { useStateContext } from "../contexts/ContextProvider";
import AdminHome from "./AdminHome";
import PetownerHome from "./PetownerPages/PetownerHome";
import StaffHome from "./StaffHome";
import CustomHelmet from "../components/CustomHelmet";

export default function Home() {
  const { user } = useStateContext();

  return (
    <>
      <CustomHelmet title="Home" />
      {user.role_id === "1" && <AdminHome />}
      {user.role_id === "2" && <StaffHome />}
      {user.role_id === "3" && <PetownerHome />}
    </>
  );
}
