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
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { format } from "date-fns";
import { LoadingButton } from "@mui/lab";

export default function TestResultModal(props) {
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
    handleImage,
    error,
    servicename,
    errormessage,
    othertests,
    submitloading,
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
              <Typography variant="h5">Test Result</Typography>
              <IconButton onClick={onClick} style={{ float: "right" }}>
                <Close color="primary"></Close>
              </IconButton>
            </DialogTitle>
            {/* <DialogTitle>
              {isUpdate ? "Update Test Result" : "Add Test Result"}
              <IconButton onClick={onClick} style={{ float: "right" }}>
                <Close color="primary"></Close>
              </IconButton>
            </DialogTitle> */}
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
                    {!isUpdate && othertests && (
                    <FormControl>
                      <InputLabel>Type</InputLabel>
                      <Select
                        label="Type"
                        value={testresult.service_id || ""}
                        onChange={(ev) =>
                          handleFieldChange("service_id", ev.target.value)
                        }
                        // readOnly={isUpdate ? true : false}
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
                  {!isUpdate && othertests && (
                    <TextField
                      label={`Test Price`}
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
                      inputProps={{ min: "1" }}
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
                  {!isUpdate && (
                    <FormControl>
                      <TextField
                        accept="image/*"
                        variant="outlined"
                        id="Attachment"
                        label="Attachment"
                        type="file"
                        onChange={handleImage}
                        defaultValue={null}
                        InputLabelProps={{ shrink: true }}
                        required
                      />
                      {error && <p style={{ color: "red" }}>{error}</p>}
                    </FormControl>
                  )}

                  <TextField
                    variant="outlined"
                    id="Description"
                    label="Description"
                    value={testresult.description || ""}
                    onChange={(ev) =>
                      handleFieldChange("description", ev.target.value)
                    }
                  />

                  {/* <Button color="primary" type="submit" variant="contained">
                    Save
                  </Button> */}
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
    </>
  );
}
