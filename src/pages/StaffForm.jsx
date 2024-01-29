import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosClient from "../axios-client";
import {
  TextField,
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  InputAdornment,
  Paper,
  CircularProgress,
} from "@mui/material";
import Swal from "sweetalert2";

export default function StaffForm() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState(null);

  const [selectedZipcode, setSelectedZipcode] = useState(null);
  const [zipcodeerror, setZipcodeerror] = useState(null);
  const [zipcodeloading, setZipcodeloading] = useState(false);

  const [staff, setStaff] = useState({
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
      .post(`/staffs`, staff)
      .then((response) => {
        Swal.fire({
          text: "Staff registration has been saved!",
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            const createdStaffId = response.data.id;
            navigate(`/admin/staffs/${createdStaffId}/view`);
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
      if (errors.email || errors.password) setActiveStep(0);
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

  const steps = ["Create a User Account", "Staff Registration"];

  useEffect(() => {
    let timerId;
    setZipcodeloading(true);

    clearTimeout(timerId);

    timerId = setTimeout(() => {
      setZipcode({});
      setZipcodeerror(null);
      getZipcodeDetails(selectedZipcode);
      setZipcodeloading(false);
    }, 1000);

    return () => {
      clearTimeout(timerId);
      setZipcodeloading(false);
    };
  }, [selectedZipcode]);

  const getZipcodeDetails = (query) => {
    if (query) {
      setZipcode({});
      setZipcodeerror(null);

      axiosClient
        .get(`/zipcodedetails/${query}`)
        .then(({ data }) => {
          setZipcode(data.data);
          setStaff((prevStaff) => ({ ...prevStaff, zipcode_id: data.data.id }));
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
              alignItems: "center",
              "& > :not(style)": { m: 1 },
              margin: "auto",
            }}
          >
            <Typography variant="h5" padding={1}>
              Create an Account
            </Typography>

            <TextField
              id="Email"
              label="Email"
              size="small"
              type="email"
              value={staff.email}
              onChange={(ev) => setStaff({ ...staff, email: ev.target.value })}
              fullWidth
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
              value={staff.password}
              onChange={(ev) =>
                setStaff({ ...staff, password: ev.target.value })
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
              value={staff.password_confirmation}
              onChange={(ev) =>
                setStaff({
                  ...staff,
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
              width: "70%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              "& > :not(style)": { m: 1 },
              margin: "auto",
            }}
          >
            <Typography variant="h5" padding={1}>
              Staff Registration
            </Typography>

            <TextField
              variant="outlined"
              id="firstname"
              label="Firstname"
              size="small"
              value={staff.firstname}
              onChange={(ev) =>
                setStaff({ ...staff, firstname: ev.target.value })
              }
              fullWidth
              required
              error={errors && errors.firstname ? true : false}
              helperText={errors && errors.firstname}
            />
            <TextField
              variant="outlined"
              id="Lastname"
              label="Lastname"
              size="small"
              value={staff.lastname}
              onChange={(ev) =>
                setStaff({ ...staff, lastname: ev.target.value })
              }
              fullWidth
              required
              error={errors && errors.lastname ? true : false}
              helperText={errors && errors.lastname}
            />
            <TextField
              variant="outlined"
              id="Contact Number"
              label="Contact Number"
              size="small"
              type="number"
              inputProps={{
                minLength: 10,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">+63</InputAdornment>
                ),
              }}
              value={staff.contact_num}
              onChange={(ev) => {
                const input = ev.target.value.slice(0, 10);
                setStaff({ ...staff, contact_num: input });
              }}
              fullWidth
              required
              error={errors && errors.contact_num ? true : false}
              helperText={errors && errors.contact_num}
            />
            <TextField
              id="Zone"
              label="Zone/Block/Street"
              size="small"
              value={staff.zone}
              onChange={(ev) => setStaff({ ...staff, zone: ev.target.value })}
              fullWidth
              required
              error={errors && errors.zone ? true : false}
              helperText={errors && errors.zone}
            />
            <TextField
              id="Barangay"
              label="Barangay"
              size="small"
              value={staff.barangay}
              onChange={(ev) =>
                setStaff({ ...staff, barangay: ev.target.value })
              }
              fullWidth
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {zipcodeloading && <CircularProgress size={15} />}
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                id="Area"
                label="Area"
                size="small"
                value={zipcode.area || ""}
                fullWidth
                required
                InputProps={{
                  readOnly: true,
                  "aria-readonly": true,
                }}
                error={errors && errors.zipcode_id ? true : false}
              />
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
                error={errors && errors.zipcode_id ? true : false}
              />
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
        marginTop: "3%",
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
      <div>
        {activeStep === steps.length ? (
          <div>
            <p>All steps completed</p>
          </div>
        ) : (
          <div>
            <form
              onSubmit={(e) => handleNext(e)}
              style={{ alignItems: "center" }}
            >
              {getStepContent(activeStep)}
              <Box  sx={{
                  padding: "10px",
                  display: "flex",
                  justifyContent: "center",
                }}>
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
