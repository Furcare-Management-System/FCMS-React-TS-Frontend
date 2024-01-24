import React, { useState } from "react";
import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Tab } from "@mui/material";
import PetAdmissions from "../pages/PetAdmissions";
import PetConsultations from "../pages/PetConsultations";
import PetTestResults from "../pages/PetTestResults";

export default function MedicalRecordTabs() {
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="pet tabs">
            <Tab label="Treatments" value="1" />
            <Tab label="Consultations" value="2" />
            <Tab label="Tests" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <PetAdmissions />
        </TabPanel>
        <TabPanel value="2">
          <PetConsultations />
        </TabPanel>
        <TabPanel value="3">
          <PetTestResults />
        </TabPanel>
      </TabContext>
    </Box>
  );
}
