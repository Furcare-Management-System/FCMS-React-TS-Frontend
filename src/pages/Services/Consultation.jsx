import React, { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
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
import { useParams } from "react-router-dom";
import DiagnosisModal from "../../components/modals/DiagnosisModal";
import { Add, Archive, Delete, Edit } from "@mui/icons-material";
import { format } from "date-fns";

export default function Consultation({ sid }) {
  const { id } = useParams();

  const columns = [
    { id: "Date", name: "Date" },
    { id: "Pet", name: "Pet" },
    { id: "Diagnosis", name: "Diagnosis" },
    { id: "Follow Up", name: "Follow Up" },
    { id: "Status", name: "Status" },
    { id: "Actions", name: "Actions" },
  ];

  const [notification, setNotification] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitloading, setSubmitloading] = useState(false);

  const [consultations, setConsultations] = useState([]);
  const [pets, setPets] = useState([]);

  const getConsultations = () => {
    setConsultations([]);
    setMessage("");
    setLoading(true);
    axiosClient
      .get(`/diagnosis/petowner/${id}/service/${sid}`)
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
    followup: null,
  });

  const [open, openConsultation] = useState(false);

  const addModal = (ev) => {
    openConsultation(true);
    getPets();
    setConsultation({});
    setErrors(null);
  };

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

  const onDelete = (u) => {
    if (!window.confirm("Are you sure to delete this?")) {
      return;
    }

    axiosClient.delete(`/diagnosis/${u.id}/forcedelete`).then(() => {
      setNotification("This consultation diagnosis record was deleted.");
      getConsultations();
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitloading(true);

    if (consultation.id) {
      axiosClient
        .put(`/diagnosis/${consultation.id}`, consultation)
        .then(() => {
          setSubmitloading(false);
          setNotification("Consultation diagnosis was successfully updated.");
          openConsultation(false);
          getConsultations();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
          setSubmitloading(false);
        });
    } else {
      axiosClient
        .post(`/diagnosis/petowner/${id}/avail/${sid}`, consultation)
        .then(() => {
          setSubmitloading(false);
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
          setSubmitloading(false);
        });
    }
  };

  useEffect(() => {
    getConsultations();
  }, []);

  return (
    <>
      <Paper
        sx={{
          width: "105%",
          padding: "10px",
          marginLeft: "-25px",
          marginBottom: "-40px",
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
                {consultations &&
                  consultations
                    .slice(page * rowperpage, page * rowperpage + rowperpage)
                    .map((r) => (
                      <TableRow hover role="checkbox" key={r.id}>
                        <TableCell>
                          {format(new Date(r.date), "MMMM d, yyyy h:mm a")}
                        </TableCell>
                        <TableCell>{r.pet.name}</TableCell>
                        <TableCell>{r.remarks}</TableCell>
                        <TableCell>
                          {format(new Date(r.followup), "MMMM d, yyyy h:mm a")}
                        </TableCell>
                        <TableCell>{r.servicesavailed.status}</TableCell>
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

                            {/* {r.servicesavailed.status !== "Completed" && (
                              <Button
                                variant="contained"
                                size="small"
                                color="error"
                                onClick={() => onDelete(r)}
                              >
                                <Delete fontSize="small" />
                              </Button>
                            )} */}
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
