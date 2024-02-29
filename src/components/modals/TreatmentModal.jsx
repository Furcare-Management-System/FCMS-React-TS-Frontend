import React, { useEffect, useState } from "react";
import {
  Button,
  Alert,
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
import { format } from 'date-fns';

export default function TreatmentModal(props) {
  const {
    open,
    onClose,
    onSubmit,
    treatment,
    setTreatment,
    errors,
    pets,
    isUpdate,
  } = props;

  const handleFieldChange = (fieldName, value) => {
    const updatedTreatment = { ...treatment, [fieldName]: value };

    setTreatment(updatedTreatment);
  };

  const [date, setDate] = useState(new Date());
  const formattedDate = format(date, "MMMM d, yyyy h:mm a");

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
        <DialogTitle>
          Treatment Sheet
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
              {/* {!isUpdate && (
                <TextField
                  label="Treatment Cost"
                  type="number"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₱</InputAdornment>
                    ),
                  }}
                  value={treatment.unit_price || ""}
                  onChange={(ev) =>
                    handleFieldChange("unit_price", ev.target.value)
                  }
                  required
                  fullWidth
                />
              )} */}
              <TextField
                value={formattedDate}
                label="Date"
                variant="outlined"
                size="small"
                required
                fullWidth
                InputProps={{
                  readOnly: true,
                  "aria-readonly": true,
                }}
              />
              <TextField
                value={treatment.day || ""}
                onChange={(ev) => handleFieldChange("day", ev.target.value)}
                label="Day"
                variant="outlined"
                size="small"
                type="number"
                required
                fullWidth
              />
              <TextField
                value={treatment.diagnosis || ""}
                onChange={(ev) =>
                  handleFieldChange("diagnosis", ev.target.value)
                }
                label="Diagnosis/Findings"
                variant="outlined"
                fullWidth
                multiline
                required
                rows={2}
                size="small"
              />
              <FormControl fullWidth>
                <InputLabel>Pet*</InputLabel>
                <Select
                  label="Pet"
                  size="small"
                  value={treatment.pet_id || ""}
                  onChange={(ev) =>
                    handleFieldChange("pet_id", ev.target.value)
                  }
                  required
                >
                  {pets.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {`${item.name} (Breed: ${item.breed.breed})`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Stack flexDirection={"row"}>
                <Stack
                  display={"flex"}
                  flexDirection={"column"}
                  padding={"5px"}
                >
                  <TextField
                    value={treatment.body_weight || ""}
                    onChange={(ev) =>
                      handleFieldChange("body_weight", ev.target.value)
                    }
                    label="BW"
                    variant="standard"
                    size="small"
                    type="number"
                    required
                  />
                  <TextField
                    value={treatment.heart_rate || ""}
                    onChange={(ev) =>
                      handleFieldChange("heart_rate", ev.target.value)
                    }
                    label="HR"
                    variant="standard"
                    size="small"
                  />
                  <TextField
                    value={treatment.mucous_membranes || ""}
                    onChange={(ev) =>
                      handleFieldChange("mucous_membranes", ev.target.value)
                    }
                    label="MM"
                    variant="standard"
                    size="small"
                  />
                  <TextField
                    value={treatment.pr_prealbumin || ""}
                    onChange={(ev) =>
                      handleFieldChange("pr_prealbumin", ev.target.value)
                    }
                    label="PR"
                    variant="standard"
                    size="small"
                  />
                  <TextField
                    value={treatment.temperature || ""}
                    onChange={(ev) =>
                      handleFieldChange("temperature", ev.target.value)
                    }
                    label="Temp"
                    variant="standard"
                    size="small"
                  />
                </Stack>
                <Stack
                  display={"flex"}
                  flexDirection={"column"}
                  padding={"10px"}
                >
                  <TextField
                    value={treatment.respiration_rate || ""}
                    onChange={(ev) =>
                      handleFieldChange("respiration_rate", ev.target.value)
                    }
                    label="RR"
                    variant="standard"
                    size="small"
                  />
                  <TextField
                    value={treatment.caspillar_refill_time || ""}
                    onChange={(ev) =>
                      handleFieldChange(
                        "caspillar_refill_time",
                        ev.target.value
                      )
                    }
                    label="CRT"
                    variant="standard"
                    size="small"
                  />
                  <TextField
                    value={treatment.body_condition_score || ""}
                    onChange={(ev) =>
                      handleFieldChange("body_condition_score", ev.target.value)
                    }
                    label="BCS"
                    variant="standard"
                    size="small"
                  />
                  <TextField
                    value={treatment.fluid_rate || ""}
                    onChange={(ev) =>
                      handleFieldChange("fluid_rate", ev.target.value)
                    }
                    label="FR"
                    variant="standard"
                    size="small"
                  />
                </Stack>
              </Stack>
              <TextField
                value={treatment.comments || ""}
                onChange={(ev) =>
                  handleFieldChange("comments", ev.target.value)
                }
                label="Comments"
                variant="outlined"
                size="small"
                type="text"
                multiline
                rows={3}
                fullWidth
              />
              <br></br>
              <Button
                color="primary"
                variant="contained"
                type="submit"
                sx={{ marginTop: "15px" }}
                fullWidth
              >
                Save
              </Button>
            </Stack>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
