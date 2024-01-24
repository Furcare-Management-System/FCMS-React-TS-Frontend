import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { TextField, Button, Stack, DialogContent, IconButton, DialogTitle, Dialog } from "@mui/material";
import { Close } from "@mui/icons-material";

const UploadImage = (props) => {

  const {
    onClick,
    onClose,
    open
  } = props;

  const [image, setImage] = useState({
    name: null,
  });

  const [error, setError] = useState(null);

  const handleImage = (e) => {
    const selectedFile = e.currentTarget.files?.[0] || null;

    if (selectedFile) {
      // Validate the file type
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/svg+xml"];
      if (allowedTypes.includes(selectedFile.type)) {
        setImage((prevImage) => ({
          ...prevImage,
          name: selectedFile,
        }));
        setError(null);
      } else {
        setError("The selected file must be of type: jpg, png, jpeg, gif, svg.");
      }
    }
  };

  const submitImage = (e) => {
    e.preventDefault();

    if (!image.name) {
      setError("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("photo", image.name);

    axiosClient
      .post(`/pet/upload-image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        // Clear the input after successful submission
        setImage({ name: null });
        setError(null);
      })
      .catch((error) => {
        console.error(error);
      });

  };

  useEffect(() => {
  }, []);


  return (
    <div>
      <>
      {/* {!loading && ( */}
          <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
              Upload Image
              <IconButton onClick={onClick} style={{ float: "right" }}>
                <Close color="primary"></Close>
              </IconButton>
            </DialogTitle>
            <DialogContent>
             
              <Stack spacing={2} margin={2}>
      {/* <form onSubmit={submitImage} encType="multipart/form-data"> */}
        <TextField
          variant="outlined"
          id="photo"
          label="Photo"
          type="file"
          onChange={handleImage}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        {/* <Button type="submit" variant="contained" color="primary">
          Upload
        </Button> */}
      {/* </form> */}
                <Button color="primary" variant="contained" onClick={submitImage}>
                  Save
                </Button>
              </Stack>
            </DialogContent>
          </Dialog>
        {/* )} */}
      </>
     
    </div>
  );
};

export default UploadImage;
