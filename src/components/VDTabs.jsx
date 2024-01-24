import React, { useState } from "react";
import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Tab } from "@mui/material";
import PetDeworming from "../pages/PetDeworming";
import VaccinationReturn from "../pages/VaccinationReturn";
import DewormingReturn from "../pages/DewormingReturn";

export default function VDTabs() {
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1", p:2 }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="pet tabs">
            <Tab label="Vaccination" value="1" />
            <Tab label="Deworming" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <VaccinationReturn />
        </TabPanel>
        <TabPanel value="2">
          <DewormingReturn />
        </TabPanel>
      </TabContext>
    </Box>
  );
}
