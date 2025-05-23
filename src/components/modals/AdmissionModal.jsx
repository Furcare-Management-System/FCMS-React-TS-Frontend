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
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { format } from "date-fns";

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
    isUpdate,
  } = props;

  const handleFieldChange = (fieldName, value) => {
    const updatedAdmission = { ...clientservice, [fieldName]: value };
    setClientservice(updatedAdmission);
  };

  const [date, setDate] = useState(new Date());
  const dateToday = format(date, "MMMM d, yyyy h:mm a");

  return (
    <>
      <Backdrop open={loading} style={{ zIndex: 999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {!loading && (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
          <DialogTitle
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography variant="h5">Client Deposit</Typography>
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
                {isUpdate && clientservice.date ? (
                  <TextField
                    variant="outlined"
                    id="Date and Time"
                    label="Date and Time"
                    value={format(
                      new Date(clientservice.date),
                      "MMMM d, yyyy h:mm a"
                    )}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      readOnly: true,
                      "aria-readonly": true,
                    }}
                    required
                  />
                ) : (
                  <TextField
                    variant="outlined"
                    id="Date and Time"
                    label="Date and Time"
                    value={dateToday}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      readOnly: true,
                      "aria-readonly": true,
                    }}
                    required
                  />
                )}
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
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₱</InputAdornment>
                    ),
                  }}
                  inputProps={{ min: "1" }}
                  value={
                    typeof clientservice.deposit === "number"
                      ? clientservice.deposit.toLocaleString()
                      : ""
                  }
                  onChange={(ev) => {
                    const value = parseFloat(ev.target.value.replace(/,/g, ""));
                    handleFieldChange("deposit", isNaN(value) ? 0 : value);
                  }}
                  required
                />

                <Button
                  color="primary"
                  variant="contained"
                  type="submit"
                  target="_blank"
                >
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
