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
  DialogActions,
  FormControlLabel,
  Checkbox,
  FormControl,
  FormLabel,
  RadioGroup,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

export default function EditMedicationModal(props) {
  const {
    openedit,
    onClose,
    onClick,
    onSubmit,
    loading,
    medication,
    setMedication,
    errors,
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
        <Dialog open={openedit} onClose={onClose} fullWidth maxWidth="sm">
          <form onSubmit={(e) => onSubmit(e)}>
            <DialogTitle
              display="flex"
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Typography variant="h4">Medication</Typography>
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
                <FormControl>
                  <FormLabel id="unit-radio-btn">Intake</FormLabel>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={medication.am || null}
                        onChange={(ev) =>
                          handleFieldChange("am", ev.target.checked)
                        }
                        color="primary"
                      />
                    }
                    label="AM"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={medication.pm || null}
                        onChange={(ev) =>
                          handleFieldChange("pm", ev.target.checked)
                        }
                        color="primary"
                      />
                    }
                    label="PM"
                  />
                </FormControl>

                <TextField
                  value={medication.medicine_name || ""}
                  onChange={(ev) =>
                    handleFieldChange("medicine_name", ev.target.value)
                  }
                  label="Medicine Name"
                  multiline
                />
                <TextField
                  value={medication.dosage || ""}
                  onChange={(ev) =>
                    handleFieldChange("dosage", ev.target.value)
                  }
                  label="Dosage"
                  multiline
                />

                <TextField
                  value={medication.description || ""}
                  onChange={(ev) =>
                    handleFieldChange("description", ev.target.value)
                  }
                  multiline
                  label="Description"
                />
              </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
              <LoadingButton
                loading={submitloading}
                type="submit"
                variant="contained"
                color="success"
              >
                {isUpdate ? "save" : "add"}
              </LoadingButton>
            </DialogActions>
          </form>
        </Dialog>
      )}
    </>
  );
}
