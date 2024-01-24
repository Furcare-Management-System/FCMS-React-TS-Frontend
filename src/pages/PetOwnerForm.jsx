import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../axios-client";
import {
  TextField,
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Alert,
  InputAdornment,
  Paper,
} from "@mui/material";
import Swal from "sweetalert2";

export default function PetOwnerForm() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState(null);

  const [selectedZipcode, setSelectedZipcode] = useState(null);
  const [zipcodeerror, setZipcodeerror] = useState(null);

  const [petowner, setPetowner] = useState({
    id: null,
    firstname: "",
    lastname: "",
    contact_num: "",
    zipcode_id: null,
    barangay: "",
    zone: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [zipcode, setZipcode] = useState({
    id: null,
    area: "",
    province: "",
    zipcode: "",
  });

  const [activeStep, setActiveStep] = useState(0);

  const onSubmit = (ev) => {
    ev.preventDefault();
    setErrors(null);

    axiosClient
      .post(`/petowners`, petowner)
      .then((response) => {
        Swal.fire({
          text: "Petowner registration has been saved!",
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            const createdPetownerId = response.data.id;
            navigate(`/admin/petowners/${createdPetownerId}/view`);
          }
        });
      })
      .catch((err) => {
        handleErrors(err);
      });
  };

  const handleErrors = (err) => {
    const response = err.response;
    if (response && response.status === 422) {
      setErrors(response.data.errors);
      if (response.data.errors.email || response.data.errors.password) {
        handlePrev();
      }
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (activeStep === 1) {
      onSubmit(e);
      return true;
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handlePrev = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const steps = ["Create a User Account", "Pet Owner Registration"];

  useEffect(() => {
    let timerId;

    clearTimeout(timerId);

    timerId = setTimeout(() => {
      setZipcode({});
      setZipcodeerror(null);
      getZipcodeDetails(selectedZipcode);
    }, 4000);

    return () => clearTimeout(timerId);
  }, [selectedZipcode]);

  const getZipcodeDetails = (query) => {
    if (query) {
      setZipcode({});
      setZipcodeerror(null);

      axiosClient
        .get(`/zipcodedetails/${query}`)
        .then(({ data }) => {
          setZipcode(data.data);
          setPetowner((prevStaff) => ({
            ...prevStaff,
            zipcode_id: data.data.id,
          }));
        })
        .catch((error) => {
          const response = error.response;
          if (response && response.status === 404) {
            setZipcodeerror(response.data.message);
          }
        });
    }
  };

  const handleZipcodeChange = (event) => {
    setSelectedZipcode(event.target.value);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box
            sx={{
              width: "70%",
              display: "flex",
              flexDirection: "column",
              "& > :not(style)": { m: 1 },
              margin: "auto",
            }}
          >
            <Typography variant="h5" padding={1} align="center">
              Create an Account
            </Typography>
            <TextField
              id="Email"
              label="Email"
              size="small"
              type="email"
              fullWidth
              value={petowner.email}
              onChange={(ev) =>
                setPetowner({ ...petowner, email: ev.target.value })
              }
              required
              error={errors && errors.email ? true : false}
              helperText={
                errors && errors.email
                  ? errors && errors.email
                  : "Please input a valid email address."
              }
              autoFocus
            />
            <TextField
              variant="outlined"
              id="Password"
              size="small"
              label="Password"
              type="password"
              required
              fullWidth
              value={petowner.password}
              onChange={(ev) =>
                setPetowner({ ...petowner, password: ev.target.value })
              }
              error={errors && errors.password ? true : false}
              helperText={
                errors && errors.password
                  ? errors && errors.password
                  : "Your password must be at least 8 characters long and contain numbers and letters."
              }
            />
            <TextField
              variant="outlined"
              id="Password Confirmation"
              label="Password Confirmation"
              size="small"
              fullWidth
              required
              type="password"
              value={petowner.password_confirmation}
              onChange={(ev) =>
                setPetowner({
                  ...petowner,
                  password_confirmation: ev.target.value,
                })
              }
              error={errors && errors.password ? true : false}
            />
          </Box>
        );
      case 1:
        return (
          <Box
            sx={{
              width: "90%",
              display: "flex",
              flexDirection: "column",
              "& > :not(style)": { m: 1 },
              margin: "auto",
            }}
          >
            <Typography variant="h5" padding={1} align="center">
              Pet Owner Registration
            </Typography>

            <TextField
              variant="outlined"
              size="small"
              id="firstname"
              label="Firstname"
              value={petowner.firstname}
              onChange={(ev) =>
                setPetowner({ ...petowner, firstname: ev.target.value })
              }
              fullWidth
              required
              error={errors && errors.firstname ? true : false}
              helperText={errors && errors.firstname}
            />
            <TextField
              variant="outlined"
              size="small"
              id="Lastname"
              label="Lastname"
              fullWidth
              value={petowner.lastname}
              onChange={(ev) =>
                setPetowner({ ...petowner, lastname: ev.target.value })
              }
              required
              error={errors && errors.lastname ? true : false}
              helperText={errors && errors.lastname}
            />
            <TextField
              variant="outlined"
              size="small"
              id="Contact Number"
              label="Contact Number"
              type="number"
              fullWidth
              inputProps={{
                minLength: 10,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">+63</InputAdornment>
                ),
              }}
              value={petowner.contact_num}
              onChange={(ev) => {
                const input = ev.target.value.slice(0, 10);
                setPetowner({ ...petowner, contact_num: input });
              }}
              required
              error={errors && errors.contact_num ? true : false}
              helperText={errors && errors.contact_num}
            />

            <TextField
              id="Zone"
              size="small"
              label="Zone/Block/Street"
              fullWidth
              value={petowner.zone}
              onChange={(ev) =>
                setPetowner({ ...petowner, zone: ev.target.value })
              }
              required
              error={errors && errors.zone ? true : false}
              helperText={errors && errors.zone}
            />
            <TextField
              id="Barangay"
              label="Barangay"
              size="small"
              fullWidth
              value={petowner.barangay}
              onChange={(ev) =>
                setPetowner({ ...petowner, barangay: ev.target.value })
              }
              required
              error={errors && errors.barangay ? true : false}
              helperText={errors && errors.barangay}
            />

            <Box display={"flex"} flexDirection={"row"} sx={{ width: "100%" }}>
              <TextField
                id="Zipcode"
                label="Zipcode"
                size="small"
                type="number"
                value={selectedZipcode}
                onChange={handleZipcodeChange}
                fullWidth={!zipcode.area}
                required
                error={
                  (errors && errors.zipcode_id) || zipcodeerror ? true : false
                }
                helperText={(errors && errors.zipcode_id) || zipcodeerror}
              />

              {zipcode.area && (
                <>
                  <Box>
                    <TextField
                      id="Area"
                      label="Area"
                      size="small"
                      value={zipcode.area || ""}
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
                      size="small"
                      value={zipcode.province || ""}
                      fullWidth
                      required
                      InputProps={{
                        readOnly: true,
                        "aria-readonly": true,
                      }}
                    />
                  </Box>
                </>
              )}
            </Box>
          </Box>
        );

      default:
        return "Unknown step";
    }
  };

  return (
    <Paper
      sx={{
        width: "60%",
        margin: "auto",
        marginTop: "50px",
        padding: "20px",
        border: "1px solid black",
      }}
    >
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div margin="auto">
        {activeStep === steps.length ? (
          <div>
            <p>All steps completed</p>
          </div>
        ) : (
          <div>
            <form onSubmit={(e) => handleNext(e)}>
              {getStepContent(activeStep)}
              <Box
                sx={{
                  padding: "10px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button disabled={activeStep === 0} onClick={handlePrev}>
                  Back
                </Button>
                {activeStep === 0 && (
                  <>
                    <Button variant="contained" color="primary" type="submit">
                      Next
                    </Button>
                  </>
                )}
                {activeStep === 1 && (
                  <>
                    <Button variant="contained" color="primary" type="submit">
                      Save
                    </Button>
                  </>
                )}
              </Box>
            </form>
          </div>
        )}
      </div>
    </Paper>
  );
}
