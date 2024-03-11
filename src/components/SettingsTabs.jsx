import React, { useState } from "react";
import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Tab } from "@mui/material";
import Roles from "../pages/Roles";
import Users from "../pages/Users";
import Staffs from "../pages/Staffs";
import Species from "../pages/Species";
import Breeds from "../pages/Breeds";
import Vets from "../pages/Vets";
import ArchiveTabs from "./ArchiveTabs";
import Payments from "../pages/Payments";
import ServiceAvaileble from "../pages/ServiceAvailable";

export default function SettingsTabs() {
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1", p: 2 }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs">
            <Tab label="Roles" value="1" />
            <Tab label="Users" value="2" />
            <Tab label="Staffs" value="3" />
            <Tab label="Veterinarians" value="4" />
            <Tab label="Species" value="5" />
            <Tab label="Breeds" value="6" />
            <Tab label="Archives" value="10" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Roles />{" "}
        </TabPanel>
        <TabPanel value="2">
          <Users />
        </TabPanel>
        <TabPanel value="3">
          <Staffs />
        </TabPanel>
        <TabPanel value="4">
          <Vets />
        </TabPanel>
        <TabPanel value="5">
          <Species />
        </TabPanel>
        <TabPanel value="6">
          <Breeds />
        </TabPanel>
        <TabPanel value="10">
          <ArchiveTabs />
        </TabPanel>
      </TabContext>
    </Box>
  );
}
