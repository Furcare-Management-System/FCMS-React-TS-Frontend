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
import { useStateContext } from "../../contexts/ContextProvider";
import ProductModal from "../../components/modals/ProductModal";
import { format } from "date-fns";
import { Delete } from "@mui/icons-material";
import Swal from "sweetalert2";

export default function Products({ sid }) {
  const { notification, setNotification } = useStateContext();

  const columns = [
    { id: "date and Time", name: "Date and Time" },
    { id: "Pet", name: "Pet" },
    { id: "Product Name", name: "Product Name" },
    { id: "Quantity", name: "Quantity" },
    { id: "Unit", name: "Unit" },
    { id: "Price", name: "Price" },
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
    service: "",
    quantity: null,
    unit: "",
    pet_id: null,
    unit_price: null,
  });
  const [category, setCategory] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [modalloading, setModalloading] = useState(false);
  const [pets, setPets] = useState([]);
  const [submitloading, setSubmitloading] = useState(false);

  const { id } = useParams();

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getPets = () => {
    axiosClient
      .get(`/petowners/${id}/pets`)
      .then(({ data }) => {
        setPets(data.data);
      })
      .catch(() => {});
  };
  const getMedications = () => {
    setMedications([]);
    setMessage(null);
    setLoading(true);
    axiosClient
      .get(`/servicesavailed/products/petowner/${id}`)
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

  const addModal = () => {
    setOpenAdd(true);
    setMedication({});
    setErrors(null);
    getPets();
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
    setErrors(null);
    setModalloading(true);

    axiosClient
      .get(`/medications/${record.id}`)
      .then(({ data }) => {
        setModalloading(false);
        setMedication(data);
        setMedication((prev) => ({
          ...prev,
          medcat_id: data.medicine.medcat_id,
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
    setSubmitloading(true);

    if (medication.id) {
      axiosClient
        .put(`/medications/${medication.id}`, medication)
        .then(() => {
          setSubmitloading(false);
          setOpenAdd(false);
          getMedications();
        })
        .catch((error) => {
          const response = error.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
          setSubmitloading(false);
        });
    } else {
      axiosClient
        .post(`/servicesavailed/store-product/petowner/${id}`, medication)
        .then(() => {
          setSubmitloading(false);
          setOpenAdd(false);
          getMedications();
        })
        .catch((error) => {
          const response = error.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
          setSubmitloading(false);
        });
    }
  };

  const onDelete = (u) => {
    Swal.fire({
      title: "Are you sure to delete this?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosClient.delete(`/servicesavailed/${u.id}/forcedelete/product`).then(() => {
          Swal.fire({
            title: "Product was deleted.",
            icon: "success",
          }).then(() => {
            getMedications();
          });
        });
      }
    });
  };

  useEffect(() => {
    getMedications();
  }, []);

  return (
    <>
      <Paper
        sx={{
          width: "105%",
          padding: "10px",
          marginBottom: "-40px",
          marginLeft: "-25px",
        }}
        elevation={4}
      >
        <Box
          padding={1}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Button
            onClick={addModal}
            variant="contained"
            color="success"
            size="small"
          >
            Add
          </Button>
        </Box>
        <Box sx={{ minWidth: "90%" }}>
          {sid && (
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            ></Box>
          )}

          <ProductModal
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
            pets={pets}
            submitloading={submitloading}
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
                          <TableCell>
                            {format(
                              new Date(record.date),
                              "MMMM d, yyyy h:mm a"
                            )}
                          </TableCell>
                          <TableCell>{record.pet.name}</TableCell>
                          <TableCell>{record.service.service}</TableCell>
                          <TableCell>{record.quantity}</TableCell>
                          <TableCell>{record.unit}</TableCell>
                          <TableCell>{record.unit_price}</TableCell>
                          <TableCell>{record.status}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={2}>
                              {/* <Button
                                variant="contained"
                                size="small"
                                color="info"
                                onClick={() => handleEdit(record)}
                              >
                                <Edit fontSize="small" />
                              </Button> */}

                              {record.status === "To Pay" && (
                                <Button
                                  variant="contained"
                                  size="small"
                                  color="error"
                                  onClick={() => onDelete(record)}
                                >
                                  <Delete fontSize="small" />
                                </Button>
                              )}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              )}
            </Table>
          </TableContainer>
          <TablePagination
            sx={{ marginBottom: "-10px" }}
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
