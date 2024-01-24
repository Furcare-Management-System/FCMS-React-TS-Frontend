import React, { useState } from 'react';
import Box from '@mui/material/Box';
// import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Appointments from '../pages/Appointments';
import AppointmentsConfirmed from '../pages/AppointmentsConfirmed';
import { Tab } from '@mui/material';

export default function AppointmentTabs() {
  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Scheduled" value="1" />
            <Tab label="Pending" value="2" />
            <Tab label="Item Three" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1"><Appointments/> </TabPanel>
        <TabPanel value="2"><AppointmentsConfirmed/> </TabPanel>
        <TabPanel value="3">Item Three</TabPanel>
      </TabContext>
    </Box>
  );
}
