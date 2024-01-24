import React, { useEffect, useState } from "react";
import {
  Alert,
  Backdrop,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { Link } from "react-router-dom";

export default function AvailService(props) {
  const {
    open,
    onClose,
    onClick,
    onSubmit,
    loading,
    services,
    addModal,
    checkedItems,
    setCheckedItems,
    uniqueCategories,
    errors,
  } = props;

 
  const [date, setDate] = useState(new Date());

  return (
    <>
      <Backdrop open={loading} style={{ zIndex: 999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {!loading && (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
          <DialogTitle>
            Services
            <IconButton onClick={onClick} style={{ float: "right" }}>
              <Close color="primary"></Close>
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {errors && (
              <Box>
                {Object.keys(errors).map((key) => (
                  <Alert severity="error" key={key}>
                    {errors[key][0]}
                  </Alert>
                ))}
              </Box>
            )}
             <Box 
          p={2}
        sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={{ xs: 2, sm: 2, md: 4 }}
            columns={{ xs: 4, sm: 4, md: 16, lg: 20 }}
          >
            {uniqueCategories.map((category, index) => (
              <Grid item key={index} xs={2} sm={5} md={16} lg={20}>
                <Typography variant="h6">{category}</Typography>
                <Stack direction="column" spacing={2}>
                  {services
                    .filter((service) => service.category.category === category)
                    .map((service, serviceIndex) => (
                      
                      <Button
                        key={serviceIndex}
                        // component={Link}
                        onClick={() => addModal(category)}
                        // to={service.route}
                        variant="contained"
                        size="small"
                        sx={{ height: 50, width: 250 }}
                      >
                      
                        <Typography>{service.service}</Typography>
                      </Button>
                      
                    ))}
                </Stack>
              </Grid>
            ))}



          </Grid>
        </Box>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
