import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosClient from "../axios-client";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PetConditionAdmission from "./PetConditionAdmission";
import PetMedicationAdmission from "./PetMedicationAdmission";
import { format } from "date-fns";
import CustomHelmet from "../components/CustomHelmet";

export default function TreatmentForm() {
  const { id } = useParams();
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(null);

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

  const [pet, setPet] = useState([]);
  const [breed, setBreed] = useState([]);
  const [edittreatment, setEdittreatment] = useState(false);
  const [printing, setPrinting] = useState(false);

  const getCurrentTreatment = () => {
    setErrors(null);
    setLoading(true);
    axiosClient
      .get(`/treatments/${id}`)
      .then(({ data }) => {
        setTreatment(data);
        setPet(data.pet);
        setBreed(data.pet.breed);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const [admission, setAdmission] = useState([]);

  const getAdmission = () => {
    axiosClient
      .get(`/admissions/treatment/${id}`)
      .then(({ data }) => {
        setAdmission(data.servicesavailed);
      })
      .catch(() => {});
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (edittreatment) {
      axiosClient
        .put(`/treatments/${treatment.id}`, treatment)
        .then(() => {
          setEdittreatment(false);
          getCurrentTreatment();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  const handleFieldChange = (fieldName, value) => {
    const updatedTreatment = { ...treatment, [fieldName]: value };

    setTreatment(updatedTreatment);
  };

  const onEdit = () => {
    setEdittreatment(true);
  };

  const onCancel = () => {
    setEdittreatment(false);
    getCurrentTreatment();
  };

  const treatmentPDF = async () => {
    setPrinting(true);
    try {
      // Fetch PDF content
      const response = await axiosClient.get(`/treatments/${id}/generatePDF`, {
        responseType: "blob",
        headers: {
          "Content-Type": "application/pdf",
        },
      });

      const pdfBlob = response.data;

      const url = window.URL.createObjectURL(new Blob([pdfBlob]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Treatment-${treatment.date}-${pet.name}.pdf`
      );
      document.body.appendChild(link);

      // Trigger the download
      link.click();
      document.body.removeChild(link);
      setPrinting(false);
    } catch (error) {
      alert("Error fetching PDF:", error);
      setPrinting(false);
    }
  };

  useEffect(() => {
    getCurrentTreatment();
    getAdmission();
  }, []);

  return (
    <>
      <CustomHelmet title="Treatment Form" />

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
        <Backdrop open={printing} style={{ zIndex: 999 }}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <Stack
          sx={{
            display: "flex",
            textAlign: "center",
          }}
        >
          <Box flexDirection={"row"} justifyContent={"right"} display={"flex"}>
            <Button variant="contained" onClick={treatmentPDF} color="success">
              print
            </Button>
          </Box>
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
            {treatment.date && (
              <Typography variant="body1">
                Date and Time:{" "}
                {format(new Date(treatment.date), "MMMM d, yyyy h:mm a")}
              </Typography>
            )}
            <TextField
              sx={{ width: "7%", mt: 1 }}
              value={treatment.day}
              onChange={(ev) => handleFieldChange("day", ev.target.value)}
              label="Day"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              size="small"
              required
              InputProps={{
                readOnly: edittreatment ? false : true,
              }}
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
                sx={{ width: "48%" }}
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
                InputProps={{
                  readOnly: edittreatment ? false : true,
                }}
              />
              <TextField
                variant="standard"
                sx={{ width: "48%" }}
                value={`${pet.name} (Breed: ${breed.breed})`}
                onChange={(ev) =>
                  handleFieldChange("body_weight", ev.target.value)
                }
                label="Pet"
                InputLabelProps={{ shrink: true }}
                size="small"
                required
                InputProps={{
                  readOnly: true,
                }}
              />
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
                    readOnly: edittreatment ? false : true,
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
                  InputProps={{
                    readOnly: edittreatment ? false : true,
                  }}
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
                  InputProps={{
                    readOnly: edittreatment ? false : true,
                  }}
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
                  InputProps={{
                    readOnly: edittreatment ? false : true,
                  }}
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
                  InputProps={{
                    readOnly: edittreatment ? false : true,
                  }}
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
                  InputProps={{
                    readOnly: edittreatment ? false : true,
                  }}
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
                  InputProps={{
                    readOnly: edittreatment ? false : true,
                  }}
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
                  InputProps={{
                    readOnly: edittreatment ? false : true,
                  }}
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
              InputProps={{
                readOnly: edittreatment ? false : true,
              }}
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
              InputProps={{
                readOnly: edittreatment ? false : true,
              }}
              multiline
              fullWidth
            />
            {/* {admission.status !== "Completed" && ( */}
            <Box display="flex" justifyContent={"right"}>
              {edittreatment && (
                <>
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    size="small"
                    sx={{ mt: 1 }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    sx={{ mt: 1, ml: 1 }}
                    onClick={onCancel}
                  >
                    cancel
                  </Button>
                </>
              )}
              {!edittreatment && (
                <Button
                  onClick={onEdit}
                  variant="contained"
                  color="info"
                  size="small"
                  sx={{ mt: 1 }}
                >
                  Edit
                </Button>
              )}{" "}
            </Box>
            {/* )} */}
          </form>
        </Stack>
      </Paper>

      {/* <Divider sx={{ mt: 1 }} /> */}
      <PetConditionAdmission />
      {/* <Divider /> */}
      <PetMedicationAdmission pid={pet.petowner_id} />
      {/* <PetProductAdmission pid={pet.petowner_id} /> */}
    </>
  );
}
