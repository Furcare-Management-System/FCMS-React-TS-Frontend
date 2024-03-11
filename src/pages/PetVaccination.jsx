import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
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
  Typography,
} from "@mui/material";
import { Add, Archive, Edit } from "@mui/icons-material";
import VaccinationLogsModal from "../components/modals/VaccinationLogsModal";
import { useStateContext } from "../contexts/ContextProvider";

export default function PetVaccination() {
  const { id } = useParams();
  const { notification, setNotification } = useStateContext();

  const columns = [
    { id: "date", name: "Date" },
    { id: "Type", name: "Type" },
    { id: "weight", name: "Weight" },
    { id: "Against", name: "Against" },
    { id: "Description", name: "Description" },
    { id: "Veterinarian", name: "Veterinarian" },
    { id: "Return", name: "Return" },
    { id: "Actions", name: "Actions" },
  ];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState(null);
  const [vaccinationlogs, setVaccinationlogs] = useState([]);
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
    date:null

  });
  const [pet, setPet] = useState([]);
  const [vets, setVets] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [modalloading, setModalloading] = useState(false);

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
      .get(`/vaccinationlogs/pet/${id}`)
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

  const handleCloseModal = () => {
    setOpenAdd(false);
  };

  const handleArchive = (record) => {
    if (!window.confirm("Are you sure to archive this?")) {
      return;
    }

    axiosClient.delete(`/vaccinationlogs/${record.id}/archive`).then(() => {
      setNotification("Vaccination record was archived.");
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
        setVaccinationlog(data);
        setPet(data.pet);
        setModalloading(false);
      })
      .catch(() => {
        setModalloading(false);
      });

    setOpenAdd(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (vaccinationlog.id) {
      axiosClient
        .put(`/vaccinationlogs/${vaccinationlog.id}`, vaccinationlog)
        .then(() => {
          setNotification("Vaccination was successfully updated.");
          setOpenAdd(false);
          getVaccination();
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
    getVaccination();
  }, []);

  return (
    <>
      <Paper
        sx={{
          minWidth: "90%",
          padding: "10px",
        }}
      elevation={4}
      >
        <Box sx={{ minWidth: "90%" }}>
          <VaccinationLogsModal
            open={openAdd}
            onClose={handleCloseModal}
            onClick={handleCloseModal}
            onSubmit={handleSubmit}
            loading={modalloading}
            againsts={againsts}
            vets={vets}
            vaccination={vaccinationlog}
            setVaccination={setVaccinationlog}
            errors={errors}
            pet={pet}
            isUpdate={true}
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
                          <TableCell>{record.date}</TableCell>
                          <TableCell>{record.servicesavailed.service.service}</TableCell>
                          <TableCell>{`${record.weight} kg`}</TableCell>
                          <TableCell>{record.va_againsts}</TableCell>
                          <TableCell>{record.description}</TableCell>
                          <TableCell>{record.vet.fullname}</TableCell>
                          <TableCell>{record.return}</TableCell>
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
          sx={{ marginBottom: "-20px" }}
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
