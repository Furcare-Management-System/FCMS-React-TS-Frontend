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
import { Close, Delete } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

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
    isUpdate,
    handleAddObject,
    columns,
    objectsData,
    submitloading,
    handleRemoveItem,
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
                <FormControl
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <FormLabel id="unit-radio-btn" sx={{ pr: 2 }}>
                    Intake
                  </FormLabel>
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

                <Stack flexDirection={"row"}>
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
              </Stack>
              <Button
                type="button"
                onClick={handleAddObject}
                color="success"
                fullWidth
                variant="contained"
              >
                Add Medication
              </Button>
              <Table stickyHeader aria-label="sticky table" sx={{ p: 2 }}>
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell key={column.id} size="small">
                        {column.name}
                      </TableCell>
                    ))}
                    <TableCell size="small">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {objectsData &&
                    objectsData.map((r) => (
                      <TableRow hover role="checkbox" key={r.id}>
                        <TableCell>{r.medicine_name}</TableCell>
                        <TableCell>{r.dosage}</TableCell>
                        <TableCell>{r.description}</TableCell>
                        <TableCell>
                          <Checkbox checked={r.am} color="primary" />
                        </TableCell>
                        <TableCell>
                          <Checkbox checked={r.pm} color="primary" />
                        </TableCell>
                        <TableCell>
                          <Stack direction="row">
                            <IconButton
                              variant="contained"
                              color="error"
                              size="small"
                              onClick={() => handleRemoveItem(r.id)}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
              <LoadingButton
                loading={submitloading}
                type="submit"
                variant="contained"
                color="success"
                disabled={objectsData.length === 0}
              >
                Add All
              </LoadingButton>
            </DialogActions>
          </form>
        </Dialog>
      )}
    </>
  );
}
