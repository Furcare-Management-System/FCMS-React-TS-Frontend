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
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

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
    isUpdate,
    pets,
    submitloading,
  } = props;

  const handleFieldChange = (fieldName, value) => {
    const updatedMedication = { ...medication, [fieldName]: value };
    setMedication(updatedMedication);
  };

  return (
    <>
      <Backdrop open={loading} style={{ zIndex: 999 }}>
        <CircularProgress />
      </Backdrop>
      {!loading && (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
          <DialogTitle
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography variant="h5">Product</Typography>
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
                <FormControl>
                  <InputLabel>Pet</InputLabel>
                  <Select
                    label="Pet"
                    value={medication.pet_id || ""}
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
                  value={medication.service || ""}
                  onChange={(ev) =>
                    handleFieldChange("service", ev.target.value)
                  }
                  label="Product Name"
                  required
                />
                {!isUpdate && (
                  <TextField
                  value={
                    typeof medication.unit_price === "number"
                      ? medication.unit_price.toLocaleString()
                      : ""
                  }
                  onChange={(ev) => {
                    const value = parseFloat(ev.target.value.replace(/,/g, ""));
                    handleFieldChange("unit_price", isNaN(value) ? 0 : value);
                  }}
                    label="Product Price"
                    required
                    inputProps={{ min: "1" }}
                  />
                )}
                <TextField
                  value={medication.quantity || ""}
                  onChange={(ev) =>
                    handleFieldChange("quantity", ev.target.value)
                  }
                  label="Quantity/Dosage"
                  type="text"
                  required
                  inputProps={{ min: "1" }}
                />
                <FormControl>
                  <FormLabel id="unit-radio-btn">Unit</FormLabel>
                  <RadioGroup
                    row
                    value={medication.unit || ``}
                    onChange={(ev) =>
                      handleFieldChange("unit", ev.target.value)
                    }
                    // required
                  >
                    <FormControlLabel
                      value=""
                      control={<Radio />}
                      label="N/A"
                    />
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
                      value="Bottle"
                      control={<Radio />}
                      label="Bottle"
                    />
                    <FormControlLabel
                      value="Set"
                      control={<Radio />}
                      label="Set"
                    />
                  </RadioGroup>
                </FormControl>
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
