import React, { useState } from "react";
import {
  Alert,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { format } from "date-fns";

export default function OthersModal(props) {
  const {
    open,
    onClose,
    onClick,
    onSubmit,
    loading,
    testresult,
    setTestresult,
    pets,
    errors,
    isUpdate,
    servicename,
    errormessage,
    othertests,
  } = props;

  const handleFieldChange = (fieldName, value) => {
    const updatedTestresult = { ...testresult, [fieldName]: value };
    setTestresult(updatedTestresult);
  };

  const [date, setDate] = useState(new Date());
  const dateToday = format(date, "MMMM d, yyyy h:mm a");

  return (
    <>
      <>
        <Backdrop open={loading} style={{ zIndex: 999 }}>
          <CircularProgress color="inherit" />
        </Backdrop>

        {!loading && (
          <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography variant="h5">Other Services</Typography>
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
              {errormessage && (
                <Box>
                  <Alert severity="error">{errormessage}</Alert>
                </Box>
              )}
              <form onSubmit={(e) => onSubmit(e)}>
                <Stack spacing={2} margin={2}>
                  {!isUpdate && !othertests && (
                    <TextField
                      label={`${servicename} Price`}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₱</InputAdornment>
                        ),
                      }}
                      value={
                        typeof testresult.unit_price === "number"
                          ? testresult.unit_price.toLocaleString()
                          : ""
                      }
                      onChange={(ev) => {
                        const value = parseFloat(ev.target.value.replace(/,/g, ""));
                        handleFieldChange("unit_price", isNaN(value) ? 0 : value);
                      }}
                      required
                      inputProps={{ min: "1" }}
                    />
                  )}
                  {isUpdate ? (
                    <TextField
                      variant="outlined"
                      id="Date and Time"
                    label="Date and Time"
                      value={format(
                        new Date(testresult.date),
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
                      value={testresult.pet_id || ""}
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
                  {othertests && (
                    <FormControl>
                      <InputLabel>Other Services</InputLabel>
                      <Select
                        label="Other Services"
                        value={testresult.service_id || ""}
                        onChange={(ev) =>
                          handleFieldChange("service_id", ev.target.value)
                        }
                        readOnly={isUpdate ? true : false}
                        required
                      >
                        {othertests.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.service}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}

                  {testresult.service_id === 21 && (
                    <TextField
                      variant="outlined"
                      id="Product Name"
                      label="Product Name"
                      value={testresult.description || ""}
                      onChange={(ev) =>
                        handleFieldChange("description", ev.target.value)
                      }
                    />
                  )}

                  {!isUpdate && othertests && (
                    <TextField
                      label={`Price`}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₱</InputAdornment>
                        ),
                      }}
                      inputProps={{ min: "1" }}
                      value={
                        typeof testresult.unit_price === "number"
                          ? testresult.unit_price.toLocaleString()
                          : ""
                      }
                      onChange={(ev) => {
                        const value = parseFloat(ev.target.value.replace(/,/g, ""));
                        handleFieldChange("unit_price", isNaN(value) ? 0 : value);
                      }}
                    />
                  )}
                  <FormControl>
                    <FormLabel id="unit-radio-btn">Unit</FormLabel>
                    <RadioGroup
                      row
                      value={testresult.unit || ``}
                      onChange={(ev) =>
                        handleFieldChange("unit", ev.target.value)
                      }
                      defaultValue={"Head"}
                      // required
                    >
                      <FormControlLabel
                        value="Head"
                        control={<Radio />}
                        label="Head"
                      />
                    </RadioGroup>
                  </FormControl>
                  <Button color="primary" type="submit" variant="contained">
                    Save
                  </Button>
                </Stack>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </>
    </>
  );
}
