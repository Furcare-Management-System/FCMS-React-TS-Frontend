import React, { useEffect, useState } from "react";
import {
  Button,
  Alert,
  Backdrop,
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Close } from "@mui/icons-material";

export default function AdmissionModal(props) {
  const {
    open,
    onClose,
    onSubmit,
    petowner,
    clientservice,
    setClientservice,
    errors,
    loading,
  } = props;

  const handleFieldChange = (fieldName, value) => {
    const updatedAdmission = { ...clientservice, [fieldName]: value };
    setClientservice(updatedAdmission);
  };

  return (
    <>
      <Backdrop open={loading} style={{ zIndex: 999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {!loading && (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
          <DialogTitle>
            Client Deposit
            <IconButton onClick={onClose} style={{ float: "right" }}>
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
            <form onSubmit={(e) => onSubmit(e)}>
              <Stack spacing={2} margin={2}>
                <TextField
                  variant="outlined"
                  id="Date"
                  label="Date"
                  value={new Date().toLocaleDateString()}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    readOnly: true,
                    "aria-readonly": true,
                  }}
                  required
                />
                <TextField
                  variant="outlined"
                  id="Pet Owner"
                  label="Pet Owner"
                  value={`${petowner.firstname} ${petowner.lastname}`}
                  InputProps={{
                    readOnly: true,
                    "aria-readonly": true,
                  }}
                  required
                />
                <TextField
                  label="Deposit"
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₱</InputAdornment>
                    ),
                  }}
                  value={clientservice.deposit || ""}
                  onChange={(ev) =>
                    handleFieldChange("deposit", ev.target.value)
                  }
                  required
                />

                <Button color="primary" variant="contained" type="submit">
                  Save
                </Button>
              </Stack>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
