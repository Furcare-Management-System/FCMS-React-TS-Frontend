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
    againsts,
    vets,
    errors,
    pet,
    isUpdate,
    servicename
  } = props;

  const handleFieldChange = (fieldName, value) => {
    const updatedLogs = { ...vaccination, [fieldName]: value };
    setVaccination(updatedLogs);
  };
  const [date, setDate] = useState(new Date());

  return (
    <>
      <Backdrop open={loading} style={{ zIndex: 999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {!loading && (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
          <DialogTitle>
            {isUpdate ? "Update Vaccination" : "Add Vaccination"}
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
                      type="number"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₱</InputAdornment>
                        ),
                      }}
                      value={vaccination.unit_price || ""}
                      onChange={(ev) =>
                        handleFieldChange("unit_price", ev.target.value)
                      }
                      required
                    />
                  )}
                {isUpdate ? (
                  <TextField
                    variant="outlined"
                    id="Date"
                    label="Date"
                    value={vaccination.date}
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
                    id="Date"
                    label="Date"
                    value={vaccination.date}
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
                  // type="number"
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

                <Box border={1} p={1}>
                  <Table>
                    <TableBody>
                      {againsts.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.acronym}</TableCell>
                          <TableCell>{item.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>

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
                  label="Return"
                  variant="outlined"
                  id="Return"
                  type="date"
                  value={vaccination.return || ``}
                  onChange={(ev) =>
                    handleFieldChange("return", ev.target.value)
                  }
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    min: new Date().toISOString().split("T")[0] + "T00:00",
                  }} // Set minimum date to today
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
