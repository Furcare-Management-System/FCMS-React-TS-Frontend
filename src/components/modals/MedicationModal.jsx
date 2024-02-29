import React from "react";
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
  MenuItem,
  Select,
  Stack,
  TextField,
  DialogActions,
  FormControl,
  InputLabel,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { Close } from "@mui/icons-material";

export default function MedicationModal(props) {
  const {
    open,
    onClose,
    onClick,
    onSubmit,
    loading,
    medication,
    setMedication,
    errors,
    category,
    isUpdate,
    medicine,
  } = props;

  const handleFieldChange = (fieldName, value) => {
    const updatedMedication = { ...medication, [fieldName]: value };
    setMedication(updatedMedication);
  };

  const handleUnitPriceChange = (newUnitPrice) => {
    setMedication((prevMedication) => ({
      ...prevMedication,
      unit_price: newUnitPrice,
      price: newUnitPrice, // Keep price in sync with unit_price
    }));
  };

  return (
    <>
      <Backdrop open={loading} style={{ zIndex: 999 }}>
        <CircularProgress />
      </Backdrop>
      {!loading && (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
          <DialogTitle>
            Medication
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
            <Stack spacing={2} margin={2}>
             {!isUpdate && <FormControl>
                <InputLabel>Medicine Category</InputLabel>
                <Select
                  label="Medicine Category"
                  value={medication.medcat_id || ""}
                  onChange={(ev) =>
                    handleFieldChange("medcat_id", ev.target.value)
                  }
                  required
                  fullWidth
                >
                  {category.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>}

              <TextField
                value={medication.medicine_name || ""}
                onChange={(ev) => handleFieldChange("medicine_name", ev.target.value)}
                label="Medicine Name"
                required
              />
              {/* <TextField
                value={medication.unit_price || ""}
                onChange={(ev) => handleFieldChange("unit_price", ev.target.value)}
                label="Medicine Price"
                type="number"
                required
              /> */}
             {!isUpdate && <TextField
                value={medication.unit_price || ""}
                onChange={(ev) => handleUnitPriceChange(ev.target.value)}
                label="Medicine Price"
                type="number"
                required
              />}
              <TextField
                value={medication.quantity || ""}
                onChange={(ev) =>
                  handleFieldChange("quantity", ev.target.value)
                }
                label="Quantity"
                type="number"
                required
              />
                  <FormControl>
                    <FormLabel id="unit-radio-btn">
                      Unit
                    </FormLabel>
                    <RadioGroup
                      row
                      value={medication.unit || ``}
                      onChange={(ev) =>
                        handleFieldChange("unit", ev.target.value)
                      }
                      // required
                    >
                      <FormControlLabel
                        value="Shot"
                        control={<Radio />}
                        label="Shot"
                      />
                      <FormControlLabel
                        value="Piece"
                        control={<Radio />}
                        label="Piece"
                      />
                      <FormControlLabel
                        value="Set"
                        control={<Radio />}
                        label="Set"
                      />
                    </RadioGroup>
                  </FormControl>

              <TextField
                value={medication.dosage || ""}
                onChange={(ev) => handleFieldChange("dosage", ev.target.value)}
                label="Dosage"
                required
              />

              <TextField
                value={medication.description || ""}
                onChange={(ev) =>
                  handleFieldChange("description", ev.target.value)
                }
                multiline
                rows={2}
                label="Description"
              />
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button variant="contained" onClick={onSubmit} color="success">
              {isUpdate ? "save" : "add"}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
