import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Alert, Link, Paper, Stack, useMediaQuery } from "@mui/material";

import { useEffect, useRef, useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { user, updateUser, setToken, updateStaff, token, updatePetowner } =
    useStateContext();
  const isMobile = useMediaQuery("(max-width:600px)");
  const navigate = useNavigate();

  const redirectToHome = () => {
    navigate("/home");
    window.location.reload();
  };

  const emailRef = useRef();
  const passwordRef = useRef();

  const [errors, setErrors] = useState(null);

  const onSubmit = (ev) => {
    ev.preventDefault();
    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    setErrors(null);

    axiosClient
      .post("/login", payload)
      .then(({ data }) => {
        updateStaff(data.staff);
        updatePetowner(data.petowner);
        updateUser(data.user);
        setToken(data.token);
        redirectToHome();
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          if (response.data.errors) {
            setErrors(response.data.errors);
          } else {
            setErrors({
              email: [response.data.message],
            });
          }
        }
      });
  };

  const imageURL = "furcarebg.jpg";

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
        position: "fixed",
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(0,0,30,0.4)",
      }}
    >
      <CssBaseline />
      <Container
        sx={{ backgroundColor: "white", borderRadius: "5%" }}
        component="main"
        maxWidth="xs"
      >
        <Box
          sx={{
            marginTop: 15,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          p={2}
        >
          <img src="furcare-logo.png" height={"70"} width={"70"} />
          <Typography variant={isMobile ? "body1" : "h6"} fontWeight={"bold"}>
            FUR CARE VETERINARY CLINIC
          </Typography>
          <Box component="form" onSubmit={onSubmit}>
            {errors && (
              <Box p={1}>
                {Object.keys(errors).map((key) => (
                  <Alert severity="error" key={key}>
                    {errors[key][0]}
                  </Alert>
                ))}
              </Box>
            )}
            <TextField
              inputRef={emailRef}
              margin="normal"
              fullWidth
              id="Email Address"
              label="Email Address"
              type="email"
              name="Email Address"
              size="small"
              autoFocus
              required
            />
            <TextField
              inputRef={passwordRef}
              margin="normal"
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              size="small"
              required
            />
            <Box textAlign={"right"}>
              <Typography
              variant="body2"
              onClick={() => navigate("/forgotpassword")}
              component={Button}
              sx={{fontSize:"10px", alignSelf:"right"}}
            >
              Forgot Password?
            </Typography>
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 2 }}
            >
              Login
            </Button>
          </Box>
           <Box textAlign="center" display="flex" flexDirection={"row"}>
            <Typography variant="body1" p={1}>
              Don't have an account?{" "}
            </Typography>
            <Typography
              variant="body2"
              color={"blue"}
              onClick={() => navigate("/signup")}
              component={Button}
              size="small"
            >
              Sign Up
            </Typography>
          </Box>
        </Box>
      </Container>
    </Paper>
  );
}
