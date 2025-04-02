import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosClient from "../axios-client";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import Swal from "sweetalert2";
import CustomHelmet from "../components/CustomHelmet";

export default function TreatmentFormNew() {
  const { id } = useParams();
  const sid = 20;
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(null);
  const navigate = useNavigate();

  const [treatment, setTreatment] = useState({
    id: null,
    day: null,
    pet_id: null,
    diagnosis: "",
    body_weight: null,
    heart_rate: null,
    mucous_membranes: null,
    pr_prealbumin: null,
    temperature: null,
    respiration_rate: null,
    caspillar_refill_time: null,
    body_condition_score: null,
    fluid_rate: null,
    comments: "",
  });

  const onSubmit = (e) => {
    e.preventDefault();

    axiosClient
      .post(`/treatments/petowner/${id}/service/${sid}`, treatment)
      .then((response) => {
        Swal.fire({
          title: "Treatment saved!",
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            const createdTreatmentid = response.data.id;
            navigate(`/admin/treatment/${createdTreatmentid}`);
          }
        });
      })

      .catch((err) => {
        const response = err.response;
        console.log(response);
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
        if (response && response.status === 403) {
          Swal.fire({
            title: "Error",
            text: response.data.message,
            icon: "error",
          });
        }
      });
  };

  const handleFieldChange = (fieldName, value) => {
    const updatedTreatment = { ...treatment, [fieldName]: value };

    setTreatment(updatedTreatment);
  };

  const [pets, setPets] = useState([]);

  const getPetownerPets = () => {
    axiosClient
      .get(`/petowners/${id}/pets`)
      .then(({ data }) => {
        setPets(data.data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    getPetownerPets();
  }, []);

  return (
    <>
      <CustomHelmet title={`View Treatment Form #${id}`} />

      <Paper
        sx={{
          margin: "30px",
          padding: "15px",
        }}
        elevation={5}
      >
        {/* <Paper> */}
        <Backdrop open={loading} style={{ zIndex: 999 }}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <Stack
          sx={{
            display: "flex",
            textAlign: "center",
          }}
        >
          <form onSubmit={(e) => onSubmit(e)}>
            <Typography variant="h5" fontWeight={"bold"}>
              Treatment Sheet{" "}
            </Typography>

            {errors && (
              <div className="alert">
                {Object.keys(errors).map((key) => (
                  <p key={key}>{errors[key][0]}</p>
                ))}
              </div>
            )}
            <Typography variant="body1">
              Date and Time: {format(new Date(), "MMMM d, yyyy h:mm a")}
            </Typography>
            <TextField
              sx={{ width: "7%", mt: 1 }}
              value={treatment.day}
              onChange={(ev) => handleFieldChange("day", ev.target.value)}
              label="Day"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              size="small"
              required
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                paddingTop: "15px",
              }}
            >
              <TextField
                sx={{ width: "97%" }}
                value={treatment.diagnosis}
                onChange={(ev) =>
                  handleFieldChange("diagnosis", ev.target.value)
                }
                label="Diagnosis/Findings"
                InputLabelProps={{ shrink: true }}
                variant="standard"
                size="small"
                multiline
                required
              />
              <FormControl fullWidth>
                <InputLabel>Pet*</InputLabel>
                <Select
                  label="Pet"
                  sx={{ width: "97%", ml: 1 }}
                  size="small"
                  value={treatment.pet_id || ""}
                  onChange={(ev) =>
                    handleFieldChange("pet_id", ev.target.value)
                  }
                  variant="standard"
                  required
                >
                  {pets.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {`${item.name} (Breed: ${item.breed.breed})`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Stack flexDirection={"row"} justifyContent={"space-between"}>
              <Stack display={"flex"} flexDirection={"column"} padding={"10px"}>
                <TextField
                  value={treatment.body_weight}
                  onChange={(ev) =>
                    handleFieldChange("body_weight", ev.target.value)
                  }
                  label="BW"
                  InputLabelProps={{ shrink: true }}
                  variant="standard"
                  size="small"
                  required
                  type="number"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">kg</InputAdornment>
                    ),
                  }}
                />
                <TextField
                  value={treatment.heart_rate}
                  onChange={(ev) =>
                    handleFieldChange("heart_rate", ev.target.value)
                  }
                  label="HR"
                  InputLabelProps={{ shrink: true }}
                  variant="standard"
                  size="small"
                />
              </Stack>
              <Stack display={"flex"} flexDirection={"column"} padding={"10px"}>
                <TextField
                  value={treatment.mucous_membranes}
                  onChange={(ev) =>
                    handleFieldChange("mucous_membranes", ev.target.value)
                  }
                  label="MM"
                  InputLabelProps={{ shrink: true }}
                  variant="standard"
                  size="small"
                />
                <TextField
                  value={treatment.pr_prealbumin}
                  onChange={(ev) =>
                    handleFieldChange("pr_prealbumin", ev.target.value)
                  }
                  label="PR"
                  InputLabelProps={{ shrink: true }}
                  variant="standard"
                  size="small"
                />
              </Stack>
              <Stack display={"flex"} flexDirection={"column"} padding={"10px"}>
                <TextField
                  value={treatment.temperature}
                  onChange={(ev) =>
                    handleFieldChange("temperature", ev.target.value)
                  }
                  label="Temp"
                  InputLabelProps={{ shrink: true }}
                  variant="standard"
                  size="small"
                />
                <TextField
                  value={treatment.respiration_rate}
                  onChange={(ev) =>
                    handleFieldChange("respiration_rate", ev.target.value)
                  }
                  label="RR"
                  InputLabelProps={{ shrink: true }}
                  variant="standard"
                  size="small"
                />
              </Stack>
              <Stack display={"flex"} flexDirection={"column"} padding={"10px"}>
                <TextField
                  value={treatment.caspillar_refill_time}
                  onChange={(ev) =>
                    handleFieldChange("caspillar_refill_time", ev.target.value)
                  }
                  label="CRT"
                  InputLabelProps={{ shrink: true }}
                  variant="standard"
                  size="small"
                />
                <TextField
                  value={treatment.body_condition_score}
                  onChange={(ev) =>
                    handleFieldChange("body_condition_score", ev.target.value)
                  }
                  label="BCS"
                  InputLabelProps={{ shrink: true }}
                  variant="standard"
                  size="small"
                />
              </Stack>
            </Stack>
            <TextField
              value={treatment.fluid_rate}
              onChange={(ev) =>
                handleFieldChange("fluid_rate", ev.target.value)
              }
              label="Fluid/Rate"
              InputLabelProps={{ shrink: true }}
              variant="standard"
              size="small"
              sx={{ width: "98%", pb: 5 }}
            />
            <TextField
              sx={{ width: "98%", pt: 1 }}
              value={treatment.comments}
              onChange={(ev) => handleFieldChange("comments", ev.target.value)}
              label="Comments"
              InputLabelProps={{ shrink: true }}
              variant="standard"
              size="small"
              type="text"
              multiline
              fullWidth
            />
            <Box display="flex" justifyContent={"right"}>
              <Button
                type="submit"
                variant="contained"
                color="success"
                size="small"
                sx={{ mt: 1 }}
              >
                Save
              </Button>
            </Box>
          </form>
        </Stack>
      </Paper>
    </>
  );
}
