import React, { useState } from "react";
import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Tab } from "@mui/material";
import PetAdmissions from "../pages/PetAdmissions";
import PetConsultations from "../pages/PetConsultations";
import PetTestResults from "../pages/PetTestResults";

export default function OtherServicesTabs() {
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="pet tabs">
            <Tab label="Home Service" value="1" />
            <Tab label="Grooming" value="2" />
            <Tab label="Boarding" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">
        <PetAdmissions />
        </TabPanel>
        <TabPanel value="2">
         <PetConsultations/>
        </TabPanel>
        <TabPanel value="3">
          <PetTestResults/>
        </TabPanel>
      </TabContext>
    </Box>
  );
}
