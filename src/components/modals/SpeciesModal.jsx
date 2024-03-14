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
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";

export default function SpeciesModal(props) {
  const {
    open,
    onClose,
    onClick,
    onSubmit,
    loading,
    specie,
    setSpecie,
    errors,
    isUpdate,
  } = props;

  const handleFieldChange = (fieldName, value) => {
    // Create a copy of the specie object and update the specified field
    const updatedSpecie = { ...specie, [fieldName]: value };
    // Update the specie object with the updated value
    setSpecie(updatedSpecie);
  };

  return (
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
            <Typography variant="h5">
              {" "}
              {isUpdate ? "Update Specie" : "Add Specie"}
            </Typography>
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
                  id="specie"
                  label="Specie"
                  value={specie.specie || ""}
                  onChange={(ev) =>
                    handleFieldChange("specie", ev.target.value)
                  }
                  required
                />
                <TextField
                  variant="outlined"
                  id="Description"
                  label="Description"
                  value={specie.description || ""}
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
