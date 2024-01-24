import React, { useState } from "react";
import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Tab } from "@mui/material";
import PO_PetVaccination from "./PO_PetVaccination";
import PO_PetDeworming from "./PO_PetDeworming";

export default function PO_PetTabs() {
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
          </TabList>
        </Box>
        <TabPanel value="1">
          <PO_PetVaccination/>
        </TabPanel>
        <TabPanel value="2">
          <PO_PetDeworming />
        </TabPanel>
      </TabContext>
    </Box>
  );
}
