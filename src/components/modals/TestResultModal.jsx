import React from "react";
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
} from "@mui/material";
import { Close } from "@mui/icons-material";

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
  } = props;

  const handleFieldChange = (fieldName, value) => {
    const updatedTestresult = { ...testresult, [fieldName]: value };
    setTestresult(updatedTestresult);
  };

  return (
    <>
      <>
        <Backdrop open={loading} style={{ zIndex: 999 }}>
          <CircularProgress color="inherit" />
        </Backdrop>

        {!loading && (
          <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
              {isUpdate ? "Update Test Result" : "Add Test Result"}
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
                      type="number"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₱</InputAdornment>
                        ),
                      }}
                      value={testresult.unit_price || ""}
                      onChange={(ev) =>
                        handleFieldChange("unit_price", ev.target.value)
                      }
                    />
                  )}
                  {othertests && (
                    <FormControl>
                      <InputLabel>Type</InputLabel>
                      <Select
                        label="Type"
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
                  {!isUpdate && othertests && (
                    <TextField
                      label={`Test Price`}
                      type="number"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₱</InputAdornment>
                        ),
                      }}
                      value={testresult.unit_price || ""}
                      onChange={(ev) =>
                        handleFieldChange("unit_price", ev.target.value)
                      }
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
