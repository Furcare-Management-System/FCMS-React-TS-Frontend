import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import {
  Box,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Add, Archive, Edit, Refresh } from "@mui/icons-material";
import MedicationModal from "../components/modals/MedicationModal";
import { useParams } from "react-router-dom";

export default function PetMedicationAdmission({ pid }) {
  //for table
  const columns = [
    { id: "Medicine", name: "Medicine" },
    { id: "Quantity", name: "Quantity" },
    { id: "Dosage", name: "Dosage" },
    { id: "Description", name: "Description" },
  ];

  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [medications, setMedications] = useState([]);
  const [message, setMessage] = useState("");

  const [open, setOpen] = useState(false);
  const [modalloading, setModalloading] = useState(false);

  const [admission, setAdmission] = useState([]);

  const getCurrentTreatment = () => {
    axiosClient
      .get(`/admissions/treatment/${id}`)
      .then(({ data }) => {
        setAdmission(data.servicesavailed);
      })
      .catch(() => {});
  };

  const getTreatmentPetMedication = () => {
    setMessage("");
    setLoading(true);
    axiosClient
      .get(`/treatments/${id}/medications`)
      .then(({ data }) => {
        setLoading(false);
        setMedications(data.data);
      })
      .catch((mes) => {
        const response = mes.response;
        if (response && response.status == 404) {
          setMessage(response.data.message);
        }
        setLoading(false);
      });
  };

  //for modal
  const [errors, setErrors] = useState(null);
  const [medication, setMedication] = useState({
    id: null,
    medcat_id: null,
    name: "",
    unit_price: null,
    description: "",
    quantity: null,
    dosage: "",
    price: null,
  });
  const [category, setCategory] = useState([]);

  const getCategory = () => {
    axiosClient
      .get(`/medicinescategory`)
      .then(({ data }) => {
        setCategory(data.data);
      })
      .catch(() => {});
  };

  const onEdit = (r) => {
    setErrors(null);
    setOpen(true);
    setModalloading(true);
    axiosClient
      .get(`/medications/${r.id}`)
      .then(({ data }) => {
        setMedication(data);
        setMedication((prev) => ({
          ...prev,
          medcat_id: data.medicine.medcat_id,
          name: data.medicine.name,
          unit_price: data.medicine.price,
        }));
        setModalloading(false);
      })
      .catch(() => {
        setModalloading(false);
      });
  };

  const onArchive = (u) => {
    if (!window.confirm("Are you sure to archive this medication?")) {
      return;
    }

    axiosClient.delete(`/medications/${u.id}/archive`).then(() => {
      getTreatmentPetMedication();
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (medication.id) {
      axiosClient
        .put(`/medications/${medication.id}`, medication)
        .then(() => {
          getTreatmentPetMedication();
          setOpen(false);
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post(`/medications/petowner/${pid}/treatment/${id}`, medication)
        .then(() => {
          getTreatmentPetMedication();
          setOpen(false);
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  const addMedication = () => {
    setOpen(true);
    setErrors(null);
    getCategory();
    setMedication({});
  };

  const closeModal = () => {
    setOpen(false);
  };

  useEffect(() => {
    getTreatmentPetMedication();
    getCurrentTreatment();
  }, []);

  return (
    <>
      <Stack sx={{ margin: "5px", p: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="body1" fontWeight={"bold"}>
            Pet Medication:
          </Typography>
          {admission.status !== "Completed" && (
            <IconButton
              color="success"
              variant="contained"
              onClick={addMedication}
            >
              <Add />
            </IconButton>
          )}
        </Box>

        <MedicationModal
          open={open}
          onClose={closeModal}
          onClick={closeModal}
          onSubmit={onSubmit}
          loading={modalloading}
          errors={errors}
          medication={medication}
          setMedication={setMedication}
          category={category}
          isUpdate={medication.id}
        />
        <TableContainer maxWidth="sm">
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} size="small">
                    {column.name}
                  </TableCell>
                ))}
                {admission.status !== "Completed" && (
                  <TableCell size="small">Actions</TableCell>
                )}
              </TableRow>
            </TableHead>
            {loading && (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={6} style={{ textAlign: "center" }}>
                    Loading...
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
            {!loading && message && (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={6} style={{ textAlign: "center" }}>
                    {message}
                  </TableCell>
                </TableRow>
              </TableBody>
            )}

            {!loading && (
              <TableBody>
                {medications &&
                  medications.map((r) => (
                    <TableRow hover role="checkbox" key={r.id}>
                      <TableCell>{r.medicine.name}</TableCell>
                      <TableCell>{r.quantity}</TableCell>
                      <TableCell>{r.dosage}</TableCell>
                      <TableCell>{r.description}</TableCell>
                      {admission.status !== "Completed" && (
                        <TableCell>
                          <Stack direction="row">
                            <IconButton
                              variant="contained"
                              size="small"
                              color="info"
                              onClick={() => onEdit(r)}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton
                              variant="contained"
                              color="error"
                              size="small"
                              onClick={() => onArchive(r)}
                            >
                              <Archive fontSize="small" />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Stack>
    </>
  );
}
