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
import VaccinationLogsModal from "../../components/modals/VaccinationLogsModal";
import { useStateContext } from "../../contexts/ContextProvider";
import { format } from "date-fns";

export default function Vaccination({ sid, sname }) {
  const { notification, setNotification } = useStateContext();

  const columns = [
    { id: "date and Time", name: "Date and Time" },
    { id: "weight", name: "Weight" },
    { id: "Against", name: "Against" },
    { id: "Description", name: "Description" },
    { id: "Veterinarian", name: "Veterinarian" },
    { id: "Return Date", name: "Return Date" },
    { id: "Status", name: "Status" },
    { id: "Actions", name: "Actions" },
  ];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState(null);
  const [vaccinationlogs, setVaccinationlogs] = useState([]);
  const [pets, setPets] = useState([]);
  const [againsts, setAgainsts] = useState([]);
  const [vaccinationlog, setVaccinationlog] = useState({
    id: null,
    weight: "",
    description: "",
    va_againsts: "",
    return: null,
    pet_id: null,
    vet_id: null,
    unit_price: null,
    date: null,
  });
  const [vets, setVets] = useState([]);
  const [pet, setPet] = useState([]);

  const [openAdd, setOpenAdd] = useState(false);
  const [modalloading, setModalloading] = useState(false);
  const [submitloading, setSubmitloading] = useState(false);

  const { id } = useParams();

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getVaccination = () => {
    setVaccinationlogs([]);
    setMessage(null);
    setLoading(true);
    axiosClient
      .get(`/vaccinationlogs/petowner/${id}/service/${sid}`)
      .then(({ data }) => {
        setLoading(false);
        setVaccinationlogs(data.data);
      })
      .catch((error) => {
        const response = error.response;
        if (response && response.status === 404) {
          setMessage(response.data.message);
        }
        setLoading(false);
      });
  };

  const getPets = () => {
    setMessage("");
    axiosClient
      .get(`/petowners/${id}/pets`)
      .then(({ data }) => {
        setPets(data.data);
      })
      .catch((mes) => {
        const response = mes.response;
        if (response && response.status == 404) {
          setMessage(response.data.message);
        }
      });
  };

  const getAgainsts = () => {
    axiosClient
      .get(`/againsts`)
      .then(({ data }) => {
        setAgainsts(data.data);
      })
      .catch(() => {});
  };

  const getVets = () => {
    axiosClient
      .get(`/vets`)
      .then(({ data }) => {
        setVets(data.data);
      })
      .catch(() => {});
  };

  const handleOpenAddModal = () => {
    getPets();
    getAgainsts();
    getVets();
    setOpenAdd(true);
    setVaccinationlog({});
    setErrors(null);
  };

  const handleCloseModal = () => {
    setOpenAdd(false);
  };

  const handleArchive = (record) => {
    if (!window.confirm("Are you sure to archive this?")) {
      return;
    }

    axiosClient.delete(`/vaccinationlogs/${record.id}/archive`).then(() => {
      setNotification("Vaccination was archived");
      getVaccination();
    });
  };

  const handleEdit = (record) => {
    getAgainsts();
    getVets();
    setErrors(null);
    setModalloading(true);

    axiosClient
      .get(`/vaccinationlogs/${record.id}`)
      .then(({ data }) => {
        setModalloading(false);
        setVaccinationlog(data);
        setPet(data.pet);
      })
      .catch(() => {
        setModalloading(false);
      });

    setOpenAdd(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitloading(true);

    if (vaccinationlog.id) {
      axiosClient
        .put(`/vaccinationlogs/${vaccinationlog.id}`, vaccinationlog)
        .then(() => {
          setSubmitloading(false);
          setNotification("Vaccination was successfully updated.");
          setOpenAdd(false);
          getVaccination();
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
        .post(`/vaccinationlogs/petowner/${id}/service/${sid}`, vaccinationlog)
        .then(() => {
          setSubmitloading(false);
          setNotification("Vaccination was successfully saved.");
          setOpenAdd(false);
          getVaccination();
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

  useEffect(() => {
    getVaccination();
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
        <Box>
          {sid && (
            <Box
              padding={1}
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Button
                onClick={handleOpenAddModal}
                variant="contained"
                color="success"
                size="small"
              >
                Add
              </Button>
            </Box>
          )}

          <VaccinationLogsModal
            open={openAdd}
            onClose={handleCloseModal}
            onClick={handleCloseModal}
            onSubmit={handleSubmit}
            loading={modalloading}
            pet={pet}
            pets={pets}
            againsts={againsts}
            vets={vets}
            vaccination={vaccinationlog}
            setVaccination={setVaccinationlog}
            errors={errors}
            isUpdate={vaccinationlog.id}
            servicename={sname}
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
                  {vaccinationlogs &&
                    vaccinationlogs
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
                          <TableCell>{`${record.weight} kg`}</TableCell>
                          <TableCell>{record.va_againsts}</TableCell>
                          <TableCell>{record.description}</TableCell>
                          <TableCell>{record.vet.fullname}</TableCell>
                          <TableCell>
                            {format(
                              new Date(record.return),
                              "MMMM d, yyyy h:mm a"
                            )}
                          </TableCell>
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

                              {/* <Button
                                variant="contained"
                                size="small"
                                color="error"
                                onClick={() => handleArchive(record)}
                              >
                                <Archive fontSize="small" />
                              </Button> */}
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
            count={vaccinationlogs.length}
            component="div"
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          ></TablePagination>
        </Box>
      </Paper>
    </>
  );
}
