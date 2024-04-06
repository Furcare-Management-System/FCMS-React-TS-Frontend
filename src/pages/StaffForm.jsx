import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
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

export default function StaffForm() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState(null);

  const [selectedZipcode, setSelectedZipcode] = useState(null);
  const [zipcodeerror, setZipcodeerror] = useState(null);
  const [zipcodeloading, setZipcodeloading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [staff, setStaff] = useState({
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
      .post(`/staffs`, staff)
      .then((response) => {
        setLoading(false);
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
    <Paper
      sx={{
        width: "70%",
        margin: "3%",
        padding: "15px",
        border: "2px solid black",
      }}
    >
      <form onSubmit={(e) => onSubmit(e)} style={{ alignItems: "center" }}>
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
            Staff Registration
          </Typography>
          <Box display={"flex"} flexDirection={"row"} sx={{ width: "100%" }}>
            <TextField
              variant="outlined"
              size="small"
              id="firstname"
              label="Firstname"
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
              size="small"
              id="Lastname"
              label="Lastname"
              fullWidth
              value={staff.lastname}
              onChange={(ev) =>
                setStaff({ ...staff, lastname: ev.target.value })
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
            fullWidth
            value={staff.email || ""}
            onChange={(ev) => setStaff({ ...staff, email: ev.target.value })}
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
            value={staff.contact_num}
            onChange={(ev) => {
              const input = ev.target.value.slice(0, 10);
              setStaff({ ...staff, contact_num: input });
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
            value={staff.zone || ""}
            onChange={(ev) => setStaff({ ...staff, zone: ev.target.value })}
            error={errors && errors.zone ? true : false}
            helperText={errors && errors.zone}
          />
          <TextField
            id="Barangay"
            label="Barangay"
            size="small"
            fullWidth
            value={staff.barangay}
            onChange={(ev) => setStaff({ ...staff, barangay: ev.target.value })}
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
  );
}
