import React, { useEffect, useState } from "react";
import {
  Button,
  Alert,
  Backdrop,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { format } from "date-fns";
import { LoadingButton } from "@mui/lab";

export default function ServiceAvailModal(props) {
  const {
    open,
    onClose,
    onSubmit,
    title,
    serviceavail,
    setServiceavail,
    errors,
    pets,
    sid,
    submitloading,
  } = props;

  const handleFieldChange = (fieldName, value) => {
    const updatedServiceAvail = { ...serviceavail, [fieldName]: value };
    setServiceavail(updatedServiceAvail);
  };
  const [date, setDate] = useState(new Date());
  const dateToday = format(date, "MMMM d, yyyy h:mm a");

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography variant="h5">{title}</Typography>
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
                label={`${title} Price`}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₱</InputAdornment>
                  ),
                }}
                value={
                  typeof serviceavail.unit_price === "number"
                    ? serviceavail.unit_price.toLocaleString()
                    : ""
                }
                onChange={(ev) => {
                  const value = parseFloat(ev.target.value.replace(/,/g, ""));
                  handleFieldChange("unit_price", isNaN(value) ? 0 : value);
                }}
                required
                inputProps={{ min: "1" }}
              />
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
              <FormControl>
                <InputLabel>Pet</InputLabel>
                <Select
                  label="Pet"
                  value={serviceavail.pet_id || ""}
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

              {sid === 3 && [
                <TextField
                  label={`Days`}
                  type="number"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">day/s</InputAdornment>
                    ),
                  }}
                  inputProps={{ min: "1" }}
                  value={serviceavail.quantity || ""}
                  onChange={(ev) =>
                    handleFieldChange("quantity", ev.target.value)
                  }
                />,
              ]}

              <LoadingButton
                loading={submitloading}
                type="submit"
                variant="contained"
              >
                Avail
              </LoadingButton>
            </Stack>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
