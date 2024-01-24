import React, { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import { Link, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { Add, Archive, Edit } from "@mui/icons-material";
import { useStateContext } from "../../contexts/ContextProvider";
import MedicationModal from "../../components/modals/MedicationModal";

export default function Medicines({ sid }) {
  const { notification, setNotification } = useStateContext();

  const columns = [
    { id: "date", name: "Date" },
    { id: "Category", name: "Category" },
    { id: "Medicine", name: "Medicine" },
    { id: "Price", name: "Price" },
    { id: "Dosage", name: "Dosage" },
    { id: "Description", name: "Description" },
    { id: "Status", name: "Status" },
    { id: "Actions", name: "Actions" },
  ];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState(null);
  const [medications, setMedications] = useState([]);
  const [medication, setMedication] = useState({
    id: null,
    medcat_id: null,
    name: "",
    price: null,
    description: "",
    quantity: null,
    dosage: "",
  });
  const [category, setCategory] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [modalloading, setModalloading] = useState(false);

  const { id } = useParams();

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getMedications = () => {
    setMedications([]);
    setMessage(null);
    setLoading(true);
    axiosClient
      .get(`/medications/petowner/${id}/service/${sid}`)
      .then(({ data }) => {
        setLoading(false);
        setMedications(data.data);
      })
      .catch((error) => {
        const response = error.response;
        if (response && response.status === 404) {
          setMessage(response.data.message);
        }
        setLoading(false);
      });
  };

  const getCategory = () => {
    axiosClient
      .get(`/medicinescategory`)
      .then(({ data }) => {
        setCategory(data.data);
      })
      .catch(() => {});
  };

  const handleOpenAddModal = () => {
    setOpenAdd(true);
    setMedication({});
    setErrors(null);
  };

  const handleCloseModal = () => {
    setOpenAdd(false);
  };

  const handleArchive = (record) => {
    if (!window.confirm("Are you sure to archive this?")) {
      return;
    }

    axiosClient.delete(`/medications/${record.id}/archive`).then(() => {
      setNotification("Vaccination was archived");
      getMedications();
    });
  };

  const handleEdit = (record) => {
    getCategory();
    setErrors(null);
    setModalloading(true);

    axiosClient
      .get(`/medications/${record.id}`)
      .then(({ data }) => {
        setModalloading(false);
        setMedication(data);
        setMedication((prev) => ({
          ...prev,
          medcat_id:data.medicine.medcat_id,
          name: data.medicine.name,
          price: data.medicine.price,
        }));
      })
      .catch(() => {
        setModalloading(false);
      });

    setOpenAdd(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (medication.id) {
      axiosClient
        .put(`/medications/${medication.id}`, medication)
        .then(() => {
          setOpenAdd(false);
          getMedications();
        })
        .catch((error) => {
          const response = error.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post(`/medications/petowner/${id}/service/${sid}`, medication)
        .then(() => {
          setOpenAdd(false);
          getMedications();
        })
        .catch((error) => {
          const response = error.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  useEffect(() => {
    getMedications();
  }, []);

  return (
    <>
      <Paper
        sx={{
          minWidth: "90%",
          padding: "10px",
        }}
      >
        <Box sx={{ minWidth: "90%" }}>
          {sid && (
            <Box
              p={2}
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            ></Box>
          )}

          <MedicationModal
            open={openAdd}
            onClose={handleCloseModal}
            onClick={handleCloseModal}
            onSubmit={handleSubmit}
            loading={modalloading}
            medication={medication}
            setMedication={setMedication}
            errors={errors}
            category={category}
            isUpdate={medication.id}
          />

          {notification && <Alert severity="success">{notification}</Alert>}

          <TableContainer sx={{ height: 380 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      style={{ backgroundColor: "black", color: "white" }}
                      key={column.id}
                    >
                      {column.name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              {loading && (
                <TableBody>
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      style={{ textAlign: "center" }}
                    >
                      Loading...
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}

              {!loading && message && (
                <TableBody>
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      style={{ textAlign: "center" }}
                    >
                      {message}
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}

              {!loading && (
                <TableBody>
                  {medications &&
                    medications
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((record) => (
                        <TableRow hover role="checkbox" key={record.id}>
                          <TableCell>{record.date}</TableCell>
                          <TableCell>
                            {record.medicine.category.category}
                          </TableCell>
                          <TableCell>{record.medicine.name}</TableCell>
                          <TableCell>{record.quantity}</TableCell>
                          <TableCell>{record.dosage}</TableCell>
                          <TableCell>{record.description}</TableCell>
                          <TableCell>{record.servicesavailed.status}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={2}>
                              <Button
                                variant="contained"
                                size="small"
                                color="info"
                                onClick={() => handleEdit(record)}
                              >
                                <Edit fontSize="small" />
                              </Button>

                              <Button
                                variant="contained"
                                size="small"
                                color="error"
                                onClick={() => handleArchive(record)}
                              >
                                <Archive fontSize="small" />
                              </Button>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              )}
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 15, 25]}
            rowsPerPage={rowsPerPage}
            page={page}
            count={medications.length}
            component="div"
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          ></TablePagination>
        </Box>
      </Paper>
    </>
  );
}
