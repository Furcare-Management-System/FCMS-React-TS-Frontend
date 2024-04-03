import React, { useState } from "react";
import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Tab } from "@mui/material";
import PetOwnerArchives from "../pages/PetOwnersArchives";
import PetsArchives from "../pages/PetsArchives";
import Payments from "../pages/Payments";
import Deposits from "../pages/Deposits";

export default function PDTabs() {
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1", padding: "10px" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs">
            <Tab label="Payment Records" value="1" />
            <Tab label="Client Deposits" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Payments />{" "}
        </TabPanel>
        <TabPanel value="2">
          <Deposits />
        </TabPanel>
      </TabContext>
    </Box>
  );
}
