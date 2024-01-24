import React, { useState } from "react";
import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Tab } from "@mui/material";
import Admissions from "../pages/Admissions";
import Treatments from "../pages/Treatments";
import TreatmentForm from "../pages/TreatmentForm";

export default function AdmissionTabs() {
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="pet tabs">
            <Tab label="Admissions" value="1" />
            <Tab label="Treatments" value="2" />
            <Tab label="Treatment Sheet" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Admissions />{" "}
        </TabPanel>
        <TabPanel value="2">
          <Treatments />
        </TabPanel>
        <TabPanel value="3">
          <TreatmentForm />
        </TabPanel>
      </TabContext>
    </Box>
  );
}
