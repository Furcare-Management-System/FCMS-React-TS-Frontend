import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";

export default function Diagnosis() {
  const [notification, setNotification] = useState("");
  const [loading, setLoading] = useState(false);

  const {id} = useParams()

  const [services, setServices] = useState([]);

  const getDiagnosis = () => {
    setModalloading(true);
    axiosClient
      .get(`/services`)
      .then(({ data }) => {
        setModalloading(false);
        setServices(data.data);
      })
      .catch(() => {
        setModalloading(false);
      });
  };

  const [petowners, setPetowners] = useState([]);

  const getPetowners = () => {
    setModalloading(true);
    axiosClient
      .get(`/petowners`)
      .then(({ data }) => {
        setModalloading(false);
        setPetowners(data.data);
      })
      .catch(() => {
        setModalloading(false);
      });
  };

  const [pets, setPets] = useState([]);

  const getPets = () => {
    setLoading(true);
    axiosClient
      .get(`/pets/${id}`)
      .then(({ data }) => {
        setLoading(false);
        setPets(data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  //for modal
  const [errors, setErrors] = useState(null);
  const [value, newValue] = useState(null);
  const [modalloading, setModalloading] = useState(false);
  const [diagnosis, setDiagnosis] = useState({
    id: null,
    remarks: "",
    pet_id: null,
  });
  const [open, openchange] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

  const addModal = (ev) => {
    getPetowners();
    setOpenAdd(true);
    setDiagnosis({});
    setErrors(null);
  };

  const closepopup = () => {
    openchange(false);
    setOpenAdd(false);
  };

  const onEdit = (r) => {
    setErrors(null);
    setModalloading(true);
    axiosClient
      .get(`/appointments/${r.id}`)
      .then(({ data }) => {
        setModalloading(false);
        setDiagnosis(data);
      })
      .catch(() => {
        setModalloading(false);
      });
    openchange(true);
  };

  const onSubmit = () => {
    if (diagnosis.id) {
      axiosClient
        .put(`/diagnosis/${diagnosis.id}`, diagnosis)
        .then(() => {
          setNotification("diagnosis was successfully updated");
          openchange(false);
          getPetowners();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post(`/diagnosis`, diagnosis)
        .then(() => {
          setNotification("diagnosis was successfully created");
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  const [date, setDate] = useState(new Date());

  useEffect(() => {
    getDiagnosis();
    getPetowners();
    getPets()
  }, []);

  return (
    <>
      <Paper
        sx={{
          minWidth: "90%",
          padding: "10px",
          margin: "10px",
        }}
      >
        {notification && <Alert severity="success">{notification}</Alert>}

        <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
          <Typography variant="h4">Diagnosis </Typography>

        <Typography variant="h6">Date: {date.toDateString()} </Typography>
        </Box>
        <br></br>

        <Box
            display="flex"
            flexDirection="row"
          >
          <TextField
          id="outlined-multiline-flexible"
          variant="outlined"
          label="Pet Name"
          value={pets.name}
          disabled
        />
        </Box>


<br></br>

<TextField
          id="outlined-multiline-static"
          label="Remarks"
          multiline
          rows={5}
          fullWidth
          placeholder="write your remarks here..."
        />
      
      <br></br>

        <Button color="primary" variant="contained" onClick={onSubmit}>
          Save
        </Button>
      </Paper>
    </>
  );
}
