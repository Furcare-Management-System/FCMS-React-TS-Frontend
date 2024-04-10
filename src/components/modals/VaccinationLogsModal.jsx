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
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { format } from "date-fns";
import { LoadingButton } from "@mui/lab";

export default function VaccinationLogsModal(props) {
  const {
    open,
    onClose,
    onClick,
    onSubmit,
    loading,
    pets,
    vaccination,
    setVaccination,
    vets,
    errors,
    pet,
    isUpdate,
    servicename,
    submitloading,
  } = props;

  const handleFieldChange = (fieldName, value) => {
    const updatedLogs = { ...vaccination, [fieldName]: value };
    setVaccination(updatedLogs);
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
            <Typography variant="h5">Vaccination</Typography>
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
            <form onSubmit={(e) => onSubmit(e)}>
              <Stack spacing={2} margin={2}>
                {!isUpdate && (
                  <TextField
                    label={`${servicename} Price`}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₱</InputAdornment>
                      ),
                    }}
                    value={
                      typeof vaccination.unit_price === "number"
                        ? vaccination.unit_price.toLocaleString()
                        : ""
                    }
                    onChange={(ev) => {
                      const value = parseFloat(
                        ev.target.value.replace(/,/g, "")
                      );
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
                      new Date(vaccination.date),
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

                {isUpdate ? (
                  <TextField
                    variant="outlined"
                    id="Pet"
                    label="Pet"
                    value={pet.name}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      readOnly: true,
                      "aria-readonly": true,
                    }}
                    required
                  />
                ) : (
                  <FormControl>
                    <InputLabel>Pet</InputLabel>
                    <Select
                      label="Pet"
                      value={vaccination.pet_id || ""}
                      onChange={(ev) =>
                        handleFieldChange("pet_id", ev.target.value)
                      }
                      required
                    >
                      {pets.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                <TextField
                  variant="outlined"
                  id="Weight"
                  label="Weight"
                  type="number"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">kg</InputAdornment>
                    ),
                  }}
                  value={vaccination.weight || ""}
                  onChange={(ev) =>
                    handleFieldChange("weight", ev.target.value)
                  }
                  required
                />

                <TextField
                  variant="outlined"
                  id="Against"
                  label="Against"
                  value={vaccination.va_againsts || ""}
                  onChange={(ev) =>
                    handleFieldChange("va_againsts", ev.target.value)
                  }
                  fullWidth
                />

                <TextField
                  variant="outlined"
                  id="Description"
                  label="Description"
                  multiline
                  value={vaccination.description || ""}
                  onChange={(ev) =>
                    handleFieldChange("description", ev.target.value)
                  }
                />

                <FormControl>
                  <InputLabel>Veterinarian</InputLabel>
                  <Select
                    label="Veterinarian"
                    value={vaccination.vet_id || ""}
                    onChange={(ev) =>
                      handleFieldChange("vet_id", ev.target.value)
                    }
                    required
                  >
                    {vets.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.fullname}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Return Date"
                  variant="outlined"
                  id="Return Date"
                  type="date"
                  value={vaccination.return || ``}
                  onChange={(ev) =>
                    handleFieldChange("return", ev.target.value)
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
