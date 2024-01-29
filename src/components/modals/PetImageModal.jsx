import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

export default function PetImageModal(props) {
  const {
    open,
    onClose,
    onClick,
    handleImage,
    submitImage,
    uploadError,
    uploadloading,
  } = props;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Upload Pet Photo
        <IconButton
          onClick={onClick}
          style={{ position: "absolute", top: 8, right: 8 }}
        >
          <Close color="primary" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={submitImage}>
          <Stack spacing={2} margin={2}>
            <TextField
              accept="image/*"
              variant="outlined"
              id="photo"
              label="Photo"
              type="file"
              onChange={handleImage}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
            {uploadError && <p style={{ color: "red" }}>{uploadError}</p>}
            <LoadingButton
              loading={uploadloading}
              type="submit"
              variant="contained"
            >
              Upload
            </LoadingButton>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  );
}
