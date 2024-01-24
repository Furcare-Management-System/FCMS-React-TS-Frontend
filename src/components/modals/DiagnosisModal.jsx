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
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { Close } from "@mui/icons-material";

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
  } = props;

  const handleFieldChange = (fieldName, value) => {
    // Create a copy of the breed object and update the specified field
    const updatedDiagnosis = { ...diagnosis, [fieldName]: value };
    // Update the breed object with the updated value
    setDiagnosis(updatedDiagnosis);
  };

  return (
    <>
      <Backdrop open={loading} style={{ zIndex: 999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {!loading && (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
          <DialogTitle>
            Consultation
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
                    type="number"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₱</InputAdornment>
                      ),
                    }}
                    value={diagnosis.unit_price || ""}
                    onChange={(ev) =>
                      handleFieldChange("unit_price", ev.target.value)
                    }
                  />
                )}
                {isUpdate ? (
                  <TextField
                    variant="outlined"
                    id="Date"
                    label="Date"
                    value={diagnosis.date}
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
                    value={new Date().toLocaleDateString()}
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
