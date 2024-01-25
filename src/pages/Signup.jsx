import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../axios-client";
import {
  Autocomplete,
  TextField,
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  InputAdornment,
  Paper,
  Container,
  CssBaseline,
  Avatar,
  Grid,
  useTheme,
} from "@mui/material";
import Swal from "sweetalert2";
import useMediaQuery from "@mui/material/useMediaQuery";
import { LoadingButton } from "@mui/lab";

export default function Signup() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const navigate = useNavigate();
  const [errors, setErrors] = useState(null);

  const [selectedZipcode, setSelectedZipcode] = useState(null);
  const [zipcodeerror, setZipcodeerror] = useState(null);
  const [code, setCode] = useState(null);
  const [entercode, setEnterCode] = useState(null);
  const [loading, setLoading] = useState(null);

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

  const imageURL = "/furcarebg.jpg";

  const [activeStep, setActiveStep] = useState(0);
  const [zipcodeloading, setzipcodeLoading] = useState(0);

  const steps = [
    "Create a User Account",
    "Verify Email",
    "Pet Owner Registration",
  ];

  const onSubmit = (ev) => {
    ev.preventDefault();
    setErrors(null);
    setLoading(true);

    axiosClient
      .post("/signup", petowner)
      .then(({ data }) => {
        if (data?.status === 204) {
          Swal.fire({
            title: "Success",
            text: "You have been successfully registered!",
            icon: "success",
          }).then((result) => {
            if (result.isConfirmed) {
              setLoading(false);
              navigate("/login");
            }
          });
        }
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status == 422) {
          setErrors(response.data.errors);
        }
        if (errors.email || errors.password) {
          setActiveStep(0);
        }
        setLoading(false);
      });
  };

  const verifyEmail = (ev) => {
    ev.preventDefault();
    setErrors(null);
    setLoading(true);
    setCode(null);
    setEnterCode(null);
    axiosClient
      .post("/verifyemail", petowner)
      .then(({ data }) => {
        setCode(data.code);
        setActiveStep(1);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);

        const response = err.response;
        if (response && response.status == 422) {
          setErrors(response.data.errors);
        }
        if (errors.email || errors.password) {
          setActiveStep(0);
        }
      });
  };

  const handlePetowner = (e) => {
    e.preventDefault();
    if (code === entercode) {
      setActiveStep(2);
    } else {
      Swal.fire({
        // title: "Error",
        text: "You have entered wrong verification code.",
        icon: "error",
      });
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (activeStep === 0) {
      verifyEmail(e);
      return true;
    }
    if (activeStep === 1) {
      handlePetowner(e);
      return true;
    }
    if (activeStep === 2) {
      onSubmit(e);
      return true;
    }

    setActiveStep((prevStep) => prevStep + 1);
  };

  const handlePrev = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  useEffect(() => {
    let timerId;

    clearTimeout(timerId);

    timerId = setTimeout(() => {
      setZipcode({});
      setZipcodeerror(null);
      setErrors(null);
      getZipcodeDetails(selectedZipcode);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [selectedZipcode]);

  const getZipcodeDetails = (query) => {
    if (query) {
      setZipcode({});
      setZipcodeerror(null);
      setzipcodeLoading(true);
      axiosClient
        .get(`/zipcodedetails/${query}`)
        .then(({ data }) => {
          setZipcode(data.data);
          setPetowner((prevStaff) => ({
            ...prevStaff,
            zipcode_id: data.data.id,
          }));
          setzipcodeLoading(false);
        })
        .catch((error) => {
          const response = error.response;
          if (response && response.status === 404) {
            setZipcodeerror(response.data.message);
          }
          setzipcodeLoading(false);
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
          <Box p={isMobile ? 1 : 2}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
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
              </Grid>
              <Grid item xs={12}>
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
              </Grid>
              <Grid item xs={12}>
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
                  error={errors && errors.password_confirmation ? true : false}
                  helperText={errors && errors.password_confirmation}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box p={isMobile ? 1 : 2}>
            <Grid container spacing={2} sx={{ textAlign: "center" }}>
              <Grid item xs={12}>
                <Typography align="center" pt={3}>
                  We have sent a verification code to your email address.
                </Typography>
                <Typography p={1} fontWeight={"bold"}>
                  {petowner.email}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  id="Code"
                  size="small"
                  label="Code"
                  required
                  value={entercode || ""}
                  onChange={(ev) => setEnterCode(ev.target.value)}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box p={2}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
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
              </Grid>
              <Grid item xs={12}>
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
              </Grid>
              <Grid item xs={12}>
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
              </Grid>
              <Grid item xs={12}>
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
              </Grid>
              <Grid item xs={12}>
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
              </Grid>
              <Grid item xs={12} display="flex" flexDirection={"row"}>
                <TextField
                  id="Zipcode"
                  label="Zipcode"
                  size="small"
                  type="number"
                  fullWidth={!zipcode.area}
                  value={selectedZipcode}
                  onChange={handleZipcodeChange}
                  disabled={zipcodeloading}
                  required
                  error={
                    (errors && errors.zipcode_id) || zipcodeerror ? true : false
                  }
                  helperText={(errors && errors.zipcode_id) || zipcodeerror}
                />
                {zipcode.area && (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        id="Area"
                        label="Area"
                        size="small"
                        value={zipcode.area || ""}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        id="Province"
                        label="Province"
                        size="small"
                        value={zipcode.province || ""}
                        required
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return "Unknown step";
    }
  };

  return (
    <Paper
      sx={{
        width: "100%",
        height: "100%",
        justifyContent: "center",
        backgroundImage: `url(${imageURL})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundBlendMode: "soft-light",
        position: "absolute",
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(0,0,30,0.4)",
      }}
    >
      <CssBaseline />
      <Container
        sx={{
          backgroundColor: "white",
          borderRadius: "5%", // Adjust radius for mobile
          p: 1, // Remove padding for mobile
          mt: isMobile ? "20%" : "3%",
        }}
        component="main"
        maxWidth="sm"
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              pb: 1,
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }} />
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
          </Box>
          <Stepper activeStep={activeStep} sx={{ mb: 1 }}>
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
                        <LoadingButton
                          size="small"
                          loading={loading}
                          color="primary"
                          type="submit"
                          variant="contained"
                        >
                          Next
                        </LoadingButton>
                      </>
                    )}
                    {activeStep === 1 && (
                      <>
                        <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                        >
                          Verify
                        </Button>
                      </>
                    )}
                    {activeStep === 2 && (
                      <>
                        <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                        >
                          Register
                        </Button>
                      </>
                    )}
                  </Box>
                </form>
              </div>
            )}
          </div>
          <Box textAlign="center">
            <Typography variant="body1">
              Already have an account?{" "}
              <Link to="/login" variant="body1">
                Login
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Paper>
  );
}
