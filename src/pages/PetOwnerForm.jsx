import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../axios-client";
import {
  TextField,
  Box,
  Typography,
  InputAdornment,
  Paper,
  CircularProgress,
} from "@mui/material";
import Swal from "sweetalert2";
import { LoadingButton } from "@mui/lab";
import CustomHelmet from "../components/CustomHelmet";

export default function PetOwnerForm() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState(null);

  const [selectedZipcode, setSelectedZipcode] = useState(null);
  const [zipcodeerror, setZipcodeerror] = useState(null);
  const [zipcodeloading, setZipcodeloading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [petowner, setPetowner] = useState({
    id: null,
    firstname: "",
    lastname: "",
    contact_num: "",
    zipcode_id: null,
    barangay: "",
    zone: "",
    email: "",
  });

  const [zipcode, setZipcode] = useState({
    id: null,
    area: "",
    province: "",
    zipcode: "",
  });

  const onSubmit = (ev) => {
    ev.preventDefault();
    setErrors(null);
    setLoading(true);
    axiosClient
      .post(`/petowners`, petowner)
      .then((response) => {
        setLoading(false);
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
        setLoading(false);
      });
  };

  const handleErrors = (err) => {
    const response = err.response;
    if (response && response.status === 422) {
      setErrors(response.data.errors);
    }
  };

  useEffect(() => {
    if (selectedZipcode) {
      let timerId;
      setZipcodeloading(true);

      clearTimeout(timerId);
      timerId = setTimeout(() => {
        setZipcode({});
        setZipcodeerror(null);
        getZipcodeDetails(selectedZipcode);
        // setZipcodeloading(false);
      }, 1000);

      return () => {
        clearTimeout(timerId);
        setZipcodeloading(false);
      };
    }
  }, [selectedZipcode]);

  const getZipcodeDetails = (query) => {
    // console.log("Fetch Query");

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
          setZipcodeloading(false);
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

  return (
    <>
      <CustomHelmet title="Add Pet Owner" />

      <Paper
        sx={{
          width: "70%",
          margin: "3%",
          padding: "15px",
          border: "2px solid black",
        }}
      >
        <form onSubmit={(e) => onSubmit(e)}>
          <Box
            sx={{
              width: "90%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              "& > :not(style)": { m: 1 },
              margin: "auto",
            }}
          >
            <Typography variant="h5" padding={1} align="center">
              Pet Owner Registration
            </Typography>
            <Box display={"flex"} flexDirection={"row"} sx={{ width: "100%" }}>
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
            </Box>
            <TextField
              id="Email"
              label="Email"
              size="small"
              type="email"
              required
              fullWidth
              value={petowner.email || ""}
              onChange={(ev) =>
                setPetowner({ ...petowner, email: ev.target.value })
              }
              // required
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
              value={petowner.zone || ""}
              onChange={(ev) =>
                setPetowner({ ...petowner, zone: ev.target.value })
              }
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {zipcodeloading && <CircularProgress size={15} />}
                    </InputAdornment>
                  ),
                }}
              />
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
            </Box>
            <LoadingButton
              loading={loading}
              type="submit"
              variant="contained"
              disabled={zipcodeloading}
              fullWidth
            >
              Save
            </LoadingButton>
          </Box>
        </form>
      </Paper>
    </>
  );
}
