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
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { Close } from "@mui/icons-material";

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
  } = props;

  const handleFieldChange = (fieldName, value) => {
    // Create a copy of the breed object and update the specified field
    const updatedServiceAvail = { ...serviceavail, [fieldName]: value };
    // Update the breed object with the updated value
    setServiceavail(updatedServiceAvail);
  };

  const [date, setDate] = useState(new Date());

  return (
    <>
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
          <DialogTitle>
            {title}
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
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₱</InputAdornment>
                    ),
                  }}
                  value={serviceavail.unit_price || ""}
                  onChange={(ev) =>
                    handleFieldChange("unit_price", ev.target.value)
                  }
                />
                <TextField
                  variant="outlined"
                  id="Date"
                  label="Date"
                  value={new Date().toLocaleDateString()}
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

                <Button color="primary" variant="contained" type="submit">
                  Avail
                </Button>
              </Stack>
            </form>
          </DialogContent>
        </Dialog>
    </>
  );
}
