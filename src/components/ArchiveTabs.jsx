import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Tab } from '@mui/material';
import UserArchives from '../pages/UserArchives';
import PetOwnerArchives from '../pages/PetOwnersArchives';
import PetsArchives from '../pages/PetsArchives';
import StaffsArchives from '../pages/StaffsArchives';
import VetArchives from '../pages/VetArchives';

export default function ArchiveTabs() {
  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs">
            <Tab label="Users" value="1" />
            <Tab label="Petowners" value="2" />
            <Tab label="Pets" value="3" />
            <Tab label="Staffs" value="4" />
            <Tab label="Veterinarians" value="5" />
          </TabList>
        </Box>
        <TabPanel value="1"><UserArchives/> </TabPanel>
        <TabPanel value="2"><PetOwnerArchives/></TabPanel>
        <TabPanel value="3"><PetsArchives/></TabPanel>
        <TabPanel value="4"><StaffsArchives/></TabPanel>
        <TabPanel value="5"><VetArchives/></TabPanel>
      </TabContext>
    </Box>
  );
}
