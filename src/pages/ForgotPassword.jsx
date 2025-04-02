import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../axios-client";
import {
  TextField,
  Box,
  Button,
  Typography,
  Paper,
  Container,
  CssBaseline,
  Grid,
  useTheme,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import Swal from "sweetalert2";
import useMediaQuery from "@mui/material/useMediaQuery";
import { LoadingButton } from "@mui/lab";
import CustomHelmet from "../components/CustomHelmet";

export default function ForgotPassword() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const navigate = useNavigate();
  const [errors, setErrors] = useState(null);

  const [code, setCode] = useState(null);
  const [entercode, setEnterCode] = useState(null);
  const [loading, setLoading] = useState(null);

  const [user, setUser] = useState({
    id: null,
    email: "",
    password: "",
    password_confirmation: "",
  });
  const imageURL = "furcarebg.jpg";

  const [activeStep, setActiveStep] = useState(0);

  const steps = ["Verify Email", "Verification Code", "Reset Password"];

  const verifyEmail = (ev) => {
    ev.preventDefault();
    setErrors(null);
    setLoading(true);
    setCode(null);
    setEnterCode(null);
    axiosClient
      .get(`/forgotpassword/${user.email}`)
      .then(({ data }) => {
        if (data.code) {
          setCode(data.code);
          setUser((prev) => ({ ...prev, id: data.id }));
          setLoading(false);
          setActiveStep(1);
        } else {
          setErrors(data.message);
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        const response = err.response;
        if (response && response.status == 422) {
          setErrors(response.data.errors);
        }
      });
  };

  const handleCode = (e) => {
    e.preventDefault();
    setLoading(true);

    if (code === entercode) {
      setActiveStep(2);
      setLoading(false);
    } else {
      Swal.fire({
        text: "You have entered wrong verification code.",
        icon: "error",
        allowOutsideClick: false,
      });
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    axiosClient
      .patch(`/users/${user.id}`, user)
      .then((response) => {
        setLoading(false);
        if (response) {
          Swal.fire({
            title: "Success",
            text: "You have successfully change your password.",
            icon: "success",
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isConfirmed) {
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
        setLoading(false);
      });
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (activeStep === 0) {
      verifyEmail(e);
      return true;
    }
    if (activeStep === 1) {
      handleCode(e);
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
  const handleFieldChange = (fieldName, value) => {
    const updatedUser = { ...user, [fieldName]: value };
    setUser(updatedUser);
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleCheckboxChange = () => {
    setShowPassword(!showPassword);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box p={isMobile ? 1 : 2}>
            <Typography align="center" pb={2}>
              Please enter your email address.
            </Typography>
            <Grid item xs={12}>
              <TextField
                id="Email"
                label="Email"
                size="small"
                type="email"
                fullWidth
                value={user.email || ""}
                onChange={(ev) => handleFieldChange("email", ev.target.value)}
                required
                error={errors ? errors : null}
                helperText={errors}
                autoFocus
              />
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Grid container spacing={2} sx={{ textAlign: "center" }}>
              <Grid item xs={12}>
                <Typography align="center" pt={3}>
                  We have sent a code to your email address.
                </Typography>
                <Typography p={1} fontWeight={"bold"}>
                  {user.email}{" "}
                  <Button
                    sx={{ fontSize: "10px", color: "blue" }}
                    onClick={verifyEmail}
                  >
                    resend
                  </Button>
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
            <TextField
              margin="normal"
              fullWidth
              id="Email"
              label="Email"
              name="Email"
              size="small"
              required
              InputProps={{
                readOnly: true,
                "aria-readonly": true,
              }}
              value={user.email || ""}
              onChange={(ev) => handleFieldChange("password", ev.target.value)}
            />
            <TextField
              margin="normal"
              fullWidth
              id="Reset Password"
              label="Reset Password"
              name="Reset Password"
              size="small"
              required
              error={errors && errors.password ? true : false}
              helperText={
                errors && errors.password
                  ? errors && errors.password
                  : "Your password must be at least 8 characters long and contain numbers and letters."
              }
              type={showPassword ? "text" : "password"}
              value={user.password || ""}
              onChange={(ev) => handleFieldChange("password", ev.target.value)}
            />
            <TextField
              margin="normal"
              fullWidth
              size="small"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              id="Password Confirmation"
              label="Password Confirmation"
              value={user.password_confirmation || ""}
              onChange={(ev) =>
                handleFieldChange("password_confirmation", ev.target.value)
              }
              error={errors && errors.password ? true : false}
              helperText={errors && errors.password}
              required
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={showPassword}
                  onChange={handleCheckboxChange}
                  color="primary"
                />
              }
              label="Show Password"
            />
          </Box>
        );

      default:
        return "Unknown step";
    }
  };

  return (
    <>
      <CustomHelmet title="Forgot-Password" />

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
            p: 2, // Remove padding for mobile
            mt: isMobile ? "45%" : "10%",
          }}
          component="main"
          maxWidth="xs"
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              variant={isMobile ? "body1" : "h6"}
              fontWeight={"bold"}
              p={2}
            >
              Forgot Password
            </Typography>
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
                          <LoadingButton
                            size="small"
                            loading={loading}
                            color="primary"
                            type="submit"
                            variant="contained"
                          >
                            Verify
                          </LoadingButton>
                        </>
                      )}
                      {activeStep === 2 && (
                        <>
                          <LoadingButton
                            size="small"
                            loading={loading}
                            color="primary"
                            type="submit"
                            variant="contained"
                          >
                            Reset
                          </LoadingButton>
                        </>
                      )}
                    </Box>
                  </form>
                </div>
              )}
            </div>
          </Box>
        </Container>
      </Paper>
    </>
  );
}
