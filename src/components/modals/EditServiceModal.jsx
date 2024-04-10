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
import { format } from "date-fns";

export default function EditServiceModal(props) {
  const {
    open,
    onClose,
    onClick,
    onSubmit,
    loading,
    service,
    setService,
    errors,
    pets,
    isUpdate,
    submitloading,
    servicename,
  } = props;

  const handleFieldChange = (fieldName, value) => {
    const updatedservice = { ...service, [fieldName]: value };
    setService(updatedservice);
  };

  const [date, setDate] = useState(new Date());
  const dateToday = format(date, "MMMM d, yyyy h:mm a");

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
            <Typography variant="h5">Service</Typography>
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
                {isUpdate ? (
                  <TextField
                    variant="outlined"
                    id="Date and Time"
                    label="Date and Time"
                    value={format(
                      new Date(service.date),
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
                    value={service.pet_id || ""}
                    onChange={(ev) =>
                      handleFieldChange("pet_id", ev.target.value)
                    }
                    readOnly={true}
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
                  value={servicename}
                  label="Service/Product"
                  readOnly={true}
                  required
                />
                <TextField
                  value={service.quantity || ""}
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
                    value={service.unit || ``}
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
                      value="Head"
                      control={<Radio />}
                      label="Head"
                    />
                    <FormControlLabel
                      value="Day/s"
                      control={<Radio />}
                      label="Day/s"
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
                <TextField
                  value={service.unit_price || ""}
                  onChange={(ev) =>
                    handleFieldChange("unit_price", ev.target.value)
                  }
                  label="Unit Price"
                  type="text"
                  required
                  inputProps={{ min: "1" }}
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
