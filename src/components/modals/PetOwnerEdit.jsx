import React from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { Add, Archive, Close, Delete, Edit } from "@mui/icons-material";

export default function PetOwnerEdit(props) {
  const {
    open,
    onClose,
    onClick,
    onSubmit,
    loading,
    petowner,
    setPetowner,
    errors,
    isUpdate,
    zipcode,
    selectedZipcode,
    handleZipcodeChange,
    zipcodeerror,
    zipcodeloading,
  } = props;

  const handleFieldChange = (fieldName, value) => {
    const updatedPetOwner = { ...petowner, [fieldName]: value };
    setPetowner(updatedPetOwner);
  };

  return (
    <>
      {!loading && (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
          <DialogTitle>
            {isUpdate ? "Update " : "Registration"}
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
                <TextField
                  variant="outlined"
                  id="firstname"
                  label="Firstname"
                  value={petowner.firstname || ""}
                  onChange={(ev) =>
                    handleFieldChange("firstname", ev.target.value)
                  }
                  required
                />
                <TextField
                  variant="outlined"
                  id="Lastname"
                  label="Lastname"
                  value={petowner.lastname || ""}
                  onChange={(ev) =>
                    handleFieldChange("lastname", ev.target.value)
                  }
                  required
                />
                <TextField
                  variant="outlined"
                  id="Contact Number"
                  label="Contact Number"
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">+63</InputAdornment>
                    ),
                  }}
                  value={petowner.contact_num || ""}
                  onChange={(ev) => {
                    const input = ev.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10);
                    handleFieldChange("contact_num", input);
                  }}
                  required
                />

                <TextField
                  variant="outlined"
                  id="Zone"
                  label="Zone"
                  value={petowner.zone || ""}
                  onChange={(ev) => handleFieldChange("zone", ev.target.value)}
                />
                <TextField
                  variant="outlined"
                  id="Barangay"
                  label="Barangay"
                  value={petowner.barangay || ""}
                  onChange={(ev) =>
                    handleFieldChange("barangay", ev.target.value)
                  }
                  required
                />

                <Box
                  display={"flex"}
                  flexDirection={"row"}
                  sx={{ width: "100%" }}
                >
                  <TextField
                    id="Zipcode"
                    label="Zipcode"
                    type="number"
                    value={selectedZipcode || ""}
                    onChange={handleZipcodeChange}
                    required
                    error={
                      (errors && errors.zipcode_id) || zipcodeerror
                        ? true
                        : false
                    }
                    helperText={(errors && errors.zipcode_id) || zipcodeerror}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {zipcodeloading && <CircularProgress size={15} />}
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Box>
                    <TextField
                      id="Area"
                      label="Area"
                      value={zipcode.area ? zipcode.area : "..."}
                      required
                      InputProps={{
                        readOnly: true,
                        "aria-readonly": true,
                      }}
                    />
                  </Box>
                  <Box>
                    <TextField
                      id="Province"
                      label="Province"
                      value={zipcode.province ? zipcode.province : "..."}
                      fullWidth
                      required
                      InputProps={{
                        readOnly: true,
                        "aria-readonly": true,
                      }}
                    />
                  </Box>
                </Box>
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
