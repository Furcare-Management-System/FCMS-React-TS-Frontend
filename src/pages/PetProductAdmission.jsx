import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Add, Archive, Delete, Edit, Refresh } from "@mui/icons-material";
import MedicationModal from "../components/modals/MedicationModal";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import ProductModal from "../components/modals/ProductModal";

export default function PetProductAdmission({ pid }) {
  //for table
  const columns = [
    { id: "Product", name: "Product" },
    { id: "Quantity", name: "Quantity" },
    { id: "Unit", name: "Unit" },
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
    setMedications([]);
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
    medicine_name: "",
    unit_price: null,
    description: "",
    quantity: null,
    unit: "",
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
    // if (!window.confirm("Are you sure to delete this medication?")) {
    //   return;
    // }

    // axiosClient.delete(`/medications/${u.id}/archive`).then(() => {
    //   getTreatmentPetMedication();
    // });

    Swal.fire({
      title: "Are you sure to delete this medication?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosClient.delete(`/medications/${u.id}/archive`).then(() => {
          Swal.fire({
            text: "Medication was deleted.",
            icon: "success",
          }).then(() => {
            getTreatmentPetMedication();
          });
        });
      }
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
    <Paper
      sx={{
        margin: "30px",
        padding: "15px",
      }}
      elevation={5}
    >
      <Stack sx={{ margin: "5px", p: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="body1" fontWeight={"bold"}>
            Other Product/s:
          </Typography>
          {/* {admission.status !== "Completed" && (
            <IconButton
              color="success"
              variant="contained"
              onClick={addMedication}
            >
              <Add />
            </IconButton>
          )} */}
          <Button
            color="success"
            variant="contained"
            onClick={addMedication}
            size="small"
          >
            Add
          </Button>
        </Box>

        <ProductModal
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
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} size="small">
                    {column.name}
                  </TableCell>
                ))}
                {/* {admission.status !== "Completed" && (
                  <TableCell size="small">Actions</TableCell>
                )} */}
                <TableCell size="small">Actions</TableCell>
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
                      <TableCell>{r.medicine_name}</TableCell>
                      <TableCell>{r.quantity}</TableCell>
                      <TableCell>{r.quantity}</TableCell>
                      {/* <TableCell>{r.unit}</TableCell> */}
                      {/* {admission.status !== "Completed" && ( */}
                      <TableCell>
                        <Stack direction="row">
                          {/* <IconButton
                              variant="contained"
                              size="small"
                              color="info"
                              onClick={() => onEdit(r)}
                            >
                              <Edit fontSize="small" />
                            </IconButton> */}
                          <IconButton
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => onArchive(r)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                      {/* )} */}
                    </TableRow>
                  ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Stack>
    </Paper>
  );
}
