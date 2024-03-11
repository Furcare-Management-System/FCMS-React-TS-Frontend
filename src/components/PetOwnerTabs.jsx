import React, { useState } from "react";
import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Tab } from "@mui/material";
import PetOwnerPets from "../pages/PetOwnerPets";
import PetOwnerAppointments from "../pages/PetOwnerAppointments";
import PetOwnerPayments from "../pages/PetOwnerPayments";
import ServiceCatBtns from "./ServiceCatTabs";
import AllServicesAvailed from "../pages/AllServicesAvailed";
import ToPayServices from "../pages/ToPayServices";
import Admissions from "../pages/Admissions";
import PetOwnerPaymentRecords from "../pages/PetOwnerPaymentRecords";

export default function PetOWnerTabs({ petowner }) {
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        width: "100%",
        typography: "body1",
        // height: "600px",
      }}
    >
      <TabContext value={value}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "gray",
            width: "100%",
          }}
        >
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Pets" value="1" />
            <Tab label="Services" value="6" />
            <Tab label="Admission" value="7" />
            <Tab label="Appointments" value="2" />
            <Tab label="To Pay Services" value="3" />
            <Tab label="Payables" value="4" />
            <Tab label="Payment History" value="8" />
            <Tab label="Availed Services" value="5" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <PetOwnerPets />
        </TabPanel>
        <TabPanel value="2">
          <PetOwnerAppointments petowner={petowner} />
        </TabPanel>
        <TabPanel value="3">
          <ToPayServices />
        </TabPanel>
        <TabPanel value="4">
          <PetOwnerPayments />
        </TabPanel>
        <TabPanel value="5">
          <AllServicesAvailed />{" "}
        </TabPanel>
        <TabPanel value="6">
          <ServiceCatBtns />{" "}
        </TabPanel>
        <TabPanel value="7">
          <Admissions />{" "}
        </TabPanel>
        <TabPanel value="8">
          <PetOwnerPaymentRecords />{" "}
        </TabPanel>
      </TabContext>
    </Box>
  );
}
