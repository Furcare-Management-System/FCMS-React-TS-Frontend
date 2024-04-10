import React, { useState } from "react";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { format } from "date-fns";
import { LoadingButton } from "@mui/lab";

export default function DiagnosisModal(props) {
  const {
    open,
    onClose,
    onSubmit,
    loading,
    diagnosis,
    setDiagnosis,
    errors,
    pets,
    isUpdate,
    submitloading,
  } = props;

  const handleFieldChange = (fieldName, value) => {
    const updatedDiagnosis = { ...diagnosis, [fieldName]: value };
    setDiagnosis(updatedDiagnosis);
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
            <Typography variant="h5">Consultation</Typography>
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
                {!isUpdate && (
                  <TextField
                    label="Consultation Price"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₱</InputAdornment>
                      ),
                    }}
                    value={
                      typeof diagnosis.unit_price === "number"
                        ? diagnosis.unit_price.toLocaleString()
                        : ""
                    }
                    onChange={(ev) => {
                      const value = parseFloat(ev.target.value.replace(/,/g, ""));
                      handleFieldChange("unit_price", isNaN(value) ? 0 : value);
                    }}
                    required
                    inputProps={{ min: "1" }}
                  />
                )}
                {isUpdate ? (
                  <TextField
                    variant="outlined"
                    id="Date and Time"
                    label="Date and Time"
                    value={format(
                      new Date(diagnosis.date),
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

                <FormControl>
                  <InputLabel>Pet</InputLabel>
                  <Select
                    label="Pet"
                    value={diagnosis.pet_id || ""}
                    onChange={(ev) =>
                      handleFieldChange("pet_id", ev.target.value)
                    }
                    readOnly={isUpdate ? true : false}
                    required
                  >
                    {pets.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  id="outlined-multiline-static"
                  label="Diagnosis"
                  multiline
                  rows={5}
                  fullWidth
                  placeholder="write your diagnosis here..."
                  value={diagnosis.remarks || ""}
                  onChange={(ev) =>
                    handleFieldChange("remarks", ev.target.value)
                  }
                  autoFocus
                  required
                />
                <TextField
                  label="Follow Up"
                  variant="outlined"
                  id="Follow Up"
                  type="date"
                  value={diagnosis.followup || ``}
                  onChange={(ev) =>
                    handleFieldChange("followup", ev.target.value)
                  }
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    min: new Date().toISOString().split("T")[0],
                  }} // Set minimum date to today
                  required
                />
                <LoadingButton
                  loading={submitloading}
                  type="submit"
                  variant="contained"
                >
                  Save
                </LoadingButton>
              </Stack>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
