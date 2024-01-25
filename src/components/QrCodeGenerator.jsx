import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

function QrCodeGenerator(props) {
  const { GenerateQRCode, qr, petname } = props;
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div>
      {qr ? (
        <>
          <Box>
            <Button variant="contained" onClick={handleOpen}>
              View QR code
            </Button>
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>QR Code</DialogTitle>
              <DialogContent>
                <img src={qr} alt="QR Code" style={{ width: "100%" }} />
              </DialogContent>
              <DialogActions>
                <Button
                  variant="contained"
                  href={qr}
                  download={`${petname}-qrcode.png`}
                >
                  Download
                </Button>
                <Button onClick={handleClose}>Close</Button>
              </DialogActions>
            </Dialog>
          </Box>
        </>
      ) : (
        <Button variant="contained" onClick={GenerateQRCode}>
          Generate QR
        </Button>
      )}
    </div>
  );
}

export default QrCodeGenerator;
