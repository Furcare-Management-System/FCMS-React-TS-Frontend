import React, { useEffect, useState } from "react";
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
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { Close } from "@mui/icons-material";

export default function BreedsModal(props) {
  const {
    open,
    onClose,
    onClick,
    onSubmit,
    loading,
    species,
    breed,
    setBreed,
    errors,
    isUpdate,
  } = props;

  const handleFieldChange = (fieldName, value) => {
    // Create a copy of the breed object and update the specified field
    const updatedBreed = { ...breed, [fieldName]: value };
    // Update the breed object with the updated value
    setBreed(updatedBreed);
  };

  return (
    <>
      <Backdrop open={loading} style={{ zIndex: 999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {!loading && (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
          <DialogTitle>
            {isUpdate ? "Update Breed" : "Add Breed"}
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
                <FormControl>
                  <InputLabel>Specie</InputLabel>
                  <Select
                    label="Specie"
                    value={breed.specie_id || ""}
                    onChange={(ev) =>
                      handleFieldChange("specie_id", ev.target.value)
                    }
                    required
                  >
                    {species.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.specie}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  variant="outlined"
                  id="Breed"
                  label="Breed"
                  value={breed.breed}
                  onChange={(ev) => handleFieldChange("breed", ev.target.value)}
                  required
                />
                <TextField
                  variant="outlined"
                  id="Description"
                  label="Description"
                  value={breed.description}
                  onChange={(ev) =>
                    handleFieldChange("description", ev.target.value)
                  }
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
