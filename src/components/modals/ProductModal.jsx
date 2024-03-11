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

export default function ProductModal(props) {
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
            Other Product/s
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
              <TextField
                value={medication.medicine_name || ""}
                onChange={(ev) =>
                  handleFieldChange("medicine_name", ev.target.value)
                }
                label="Product Name"
                required
              />
              {/* <TextField
                value={medication.unit_price || ""}
                onChange={(ev) => handleFieldChange("unit_price", ev.target.value)}
                label="Medicine Price"
                type="number"
                required
              /> */}
              {!isUpdate && (
                <TextField
                  value={medication.unit_price || ""}
                  onChange={(ev) => handleUnitPriceChange(ev.target.value)}
                  label="Product Price"
                  type="number"
                  required
                />
              )}
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
                <FormLabel id="unit-radio-btn">Unit</FormLabel>
                <RadioGroup
                  row
                  value={medication.unit || ``}
                  onChange={(ev) => handleFieldChange("unit", ev.target.value)}
                  // required
                >
                  <FormControlLabel value="" control={<Radio />} label="N/A" />
                  <FormControlLabel
                    value="Piece"
                    control={<Radio />}
                    label="Piece"
                  />
                  <FormControlLabel
                    value="Pack"
                    control={<Radio />}
                    label="Pack"
                  />
                  <FormControlLabel
                    value="Can"
                    control={<Radio />}
                    label="Can"
                  />
                  <FormControlLabel
                    value="Pouch"
                    control={<Radio />}
                    label="Pouch"
                  />
                  <FormControlLabel
                    value="Kilo"
                    control={<Radio />}
                    label="Kilo"
                  />
                  <FormControlLabel
                    value="Bot"
                    control={<Radio />}
                    label="Bot"
                  />
                </RadioGroup>
              </FormControl>
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
