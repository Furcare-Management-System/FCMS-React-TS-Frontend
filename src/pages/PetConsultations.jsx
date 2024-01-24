import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import {
  Alert,
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
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import DiagnosisModal from "../components/modals/DiagnosisModal";
import { Add, Archive, Close, Edit } from "@mui/icons-material";

export default function PetConsultations({ sid }) {
  const { id } = useParams();

  const columns = [
    { id: "Date", name: "Date" },
    { id: "Diagnosis", name: "Diagnosis" },
    { id: "Follow Up", name: "Follow Up" },
    { id: "Actions", name: "Actions" },
  ];

  const [notification, setNotification] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [consultations, setConsultations] = useState([]);
  const [pets, setPets] = useState([]);

  const getConsultations = () => {
    setFilterdate(null);
    setConsultations([]);
    setMessage("");
    setLoading(true);
    axiosClient
      .get(`/diagnosis/pet/${id}`)
      .then(({ data }) => {
        setLoading(false);
        setConsultations(data.data);
      })
      .catch((mes) => {
        const response = mes.response;
        if (response && response.status == 404) {
          setMessage(response.data.message);
        }
        setLoading(false);
      });
  };

  const getPets = () => {
    axiosClient
      .get(`/petowners/${id}/pets`)
      .then(({ data }) => {
        setPets(data.data);
      })
      .catch(() => {});
  };

  //for table
  const [page, pagechange] = useState(0);
  const [rowperpage, rowperpagechange] = useState(10);

  const handlechangepage = (event, newpage) => {
    pagechange(newpage);
  };
  const handleRowsPerPage = (event) => {
    rowperpagechange(+event.target.value);
    pagechange(0);
  };

  //for modal
  const [errors, setErrors] = useState(null);
  const [modalloading, setModalloading] = useState(false);
  const [consultation, setConsultation] = useState({
    id: null,
    remarks: "",
    unit_price: null,
    pet_id: null,
  });

  const [open, openConsultation] = useState(false);

  const closeModal = () => {
    openConsultation(false);
  };

  const onEdit = (r) => {
    getPets();
    setErrors(null);
    setModalloading(true);
    axiosClient
      .get(`/diagnosis/${r.id}`)
      .then(({ data }) => {
        setConsultation(data);
        setModalloading(false);
      })
      .catch(() => {
        setModalloading(false);
      });
    openConsultation(true);
  };

  const onArchive = (u) => {
    if (!window.confirm("Are you sure to archive this?")) {
      return;
    }

    axiosClient.delete(`/diagnosis/${u.id}/archive`).then(() => {
      setNotification("This consultation diagnosis record was archived.");
      getConsultations();
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (consultation.id) {
      axiosClient
        .put(`/diagnosis/${consultation.id}`, consultation)
        .then(() => {
          setNotification("Consultation diagnosis was successfully updated.");
          openConsultation(false);
          getConsultations();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post(`/diagnosis/petowner/${id}/avail/${sid}`, consultation)
        .then(() => {
          setNotification("Consultation diagnosis was successfully saved.");
          openConsultation(false);
          getConsultations();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          } else if (response && response.status === 404) {
            console.log(response.data.message);
          }
        });
    }
  };

  //filter by date
  const [filterdate, setFilterdate] = useState(null);

  const filter = () => {
    setConsultations([]);
    setMessage(null);
    setLoading(true);
    axiosClient
      .get(`/diagnosis/pet/${id}/${filterdate}`)
      .then(({ data }) => {
        setLoading(false);
        setConsultations(data.data);
      })
      .catch((mes) => {
        const response = mes.response;
        if (response && response.status == 404) {
          setMessage(response.data.message);
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    getConsultations();
  }, []);

  return (
    <>
      <Paper
        sx={{
          minWidth: "90%",
          padding: "10px",
        }}
      >
        <Box p={1} sx={{ display: "flex", justifyContent: "right" }}>
          <TextField
            label="Date"
            variant="outlined"
            id="Date"
            type="date"
            size="small"
            value={filterdate || ``}
            onChange={(ev) => setFilterdate(ev.target.value)}
            InputLabelProps={{ shrink: true }}
            required
          />
          {filterdate && (
            <IconButton variant="outlined" onClick={getConsultations}>
              <Close />
            </IconButton>
          )}
          <Button
            variant="contained"
            size="small"
            sx={{ ml: 1 }}
            onClick={filter}
          >
            <Typography fontSize={"12px"}>Filter</Typography>
          </Button>
        </Box>
        <DiagnosisModal
          open={open}
          onClose={closeModal}
          onClick={closeModal}
          onSubmit={onSubmit}
          loading={modalloading}
          pets={pets}
          diagnosis={consultation}
          setDiagnosis={setConsultation}
          errors={errors}
          isUpdate={consultation.id}
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
                  <TableCell colSpan={5} style={{ textAlign: "center" }}>
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
                {consultations &&
                  consultations
                    .slice(page * rowperpage, page * rowperpage + rowperpage)
                    .map((r) => (
                      <TableRow hover role="checkbox" key={r.id}>
                        <TableCell>{r.date}</TableCell>
                        <TableCell>{r.remarks}</TableCell>
                        <TableCell>{r.followup}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={2}>
                            <Button
                              variant="contained"
                              size="small"
                              color="info"
                              onClick={() => onEdit(r)}
                            >
                              <Edit fontSize="small" />
                            </Button>

                            <Button
                              variant="contained"
                              size="small"
                              color="error"
                              onClick={() => onArchive(r)}
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
          rowsPerPage={rowperpage}
          page={page}
          count={consultations.length}
          component="div"
          onPageChange={handlechangepage}
          onRowsPerPageChange={handleRowsPerPage}
        ></TablePagination>
      </Paper>
    </>
  );
}
