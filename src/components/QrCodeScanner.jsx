import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import CryptoJS from 'crypto-js';
import { Box, Typography } from '@mui/material';

const QrCodeScanner = () => {
  const navigate = useNavigate();
  const [qrresult, setQrresult] = useState(null);
  let scanner; 

  useEffect(() => {
    function success(result) {
      const secretPass = 'XkhZG4fW2t2W';
      const decryptedData = decryptData(result, secretPass);
      setQrresult(decryptedData);
    }

    function error(err) {
      console.warn(err);
    }

    const decryptData = (encryptedData, secretPass) => {
      const bytes = CryptoJS.AES.decrypt(encryptedData, secretPass);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return decryptedData;
    };

    try {
      scanner = new Html5QrcodeScanner('reader', {
        fps: 5,
        qrbox: 250,
      });
      scanner.render(success, error);
    } catch (err) {
      console.error('Error rendering scanner:', err);
    }

    return () => {
      
      if (scanner) {
        scanner.clear();
      }
   
    };
  }, []);

  useEffect(() => {
    if (qrresult) {
      if (scanner) {
        scanner.clear();
      }
      navigate(`/admin/pets/${qrresult}/view`);
      location.reload()

    }
  }, [qrresult, navigate]);

  return (
    <Box>
      <Typography variant='h5' align='center' fontWeight={"bold"}>Scan QR Code</Typography>
      <Box id="reader" style={{ width: '250px', height: '250px' }}/>
    </Box>
  );
};

export default QrCodeScanner;
