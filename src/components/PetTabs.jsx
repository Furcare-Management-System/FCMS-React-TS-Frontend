import React, { useState } from "react";
import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Tab } from "@mui/material";
import PetVaccination from "../pages/PetVaccination";
import PetDeworming from "../pages/PetDeworming";
import MedicalRecordTabs from "./MedicalRecordTabs";
import PetServiceAvail from "../pages/PetServiceAvail";

export default function PetTabs() {
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="pet tabs">
            <Tab label="Vaccination Logs" value="1" />
            <Tab label="Deworming Logs" value="2" />
            <Tab label="Medical Records" value="3" />
            <Tab label="Availed Services" value="4" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <PetVaccination />
        </TabPanel>
        <TabPanel value="2">
          <PetDeworming />
        </TabPanel>
        <TabPanel value="3">
        <MedicalRecordTabs/>
        </TabPanel>
        <TabPanel value="4">
          <PetServiceAvail/>
        </TabPanel>
      </TabContext>
    </Box>
  );
}
