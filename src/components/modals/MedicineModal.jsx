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

export default function MedicineModal(props) {
  const {
    open,
    onClose,
    onClick,
    onSubmit,
    loading,
    medication,
    setMedication,
    errors,
    pets,
    isUpdate,
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
          <Typography variant="h5">Medicine</Typography>
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
                {/* {!isUpdate && (
                <FormControl>
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
                </FormControl>
              )} */}
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
                {!isUpdate && (
                  <TextField
                    value={medication.unit_price || ""}
                    onChange={(ev) =>
                      handleFieldChange("unit_price", ev.target.value)
                    }
                    label="Medicine Price"
                    type="number"
                    required
                    inputProps={{ min: "1" }}
                  />
                )}
                <TextField
                  value={medication.quantity || ""}
                  onChange={(ev) =>
                    handleFieldChange("quantity", ev.target.value)
                  }
                  label="Quantity"
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
                      value="Shot"
                      control={<Radio />}
                      label="Shot"
                    />
                    <FormControlLabel
                      value="Tablet"
                      control={<Radio />}
                      label="Tablet"
                    />
                    <FormControlLabel
                      value="Capsule"
                      control={<Radio />}
                      label="Capsule"
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
                    <FormControlLabel
                      value="Bottle"
                      control={<Radio />}
                      label="Bottle"
                    />
                  </RadioGroup>
                </FormControl>
                <LoadingButton
                  loading={submitloading}
                  type="submit"
                  variant="contained"
                >
                  Add
                </LoadingButton>
              </Stack>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
