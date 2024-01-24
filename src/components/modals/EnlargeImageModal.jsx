import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";

export default function EnlargeImageModal(props) {
  const { open, onClose, image, title, errors } = props;

  const [rotation, setRotation] = useState(0);

  const rotateImage = () => {
    setRotation((prevRotation) => (prevRotation + 90) % 360);
  };

  return (
    <div style={{ maxWidth: '200%', maxHeight: '100%', overflow: 'auto' }}>
      <Dialog open={open} onClose={onClose} fullWidth >
        <DialogTitle>
          {title}
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
         <Button variant="contained" size="small" onClick={rotateImage}>Rotate 90°</Button>
          <img
            style={{
              top: 0,
              left: 0,
              maxWidth: "100%",
              maxHeight: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transform: `rotate(${rotation}deg)`,
            }}
            src={`http://localhost:8000/` + image}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
