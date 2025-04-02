import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import {
  Add,
  DoneAll,
  ArrowBackIos,
  Edit,
  Done,
  Close,
} from "@mui/icons-material";
import EditAppointment from "../components/modals/EditAppointment";
import Swal from "sweetalert2";
import { format } from "date-fns";
import CustomHelmet from "../components/CustomHelmet";

export default function PetOwnerAppointments({ petowner }) {
  //for table
  const columns = [
    { id: "Date and Time", name: "Date and Time" },
    { id: "Services", name: "Services" },
    { id: "Purpose", name: "Purpose" },
    { id: "Remarks", name: "Remarks" },
    { id: "Veterinarian", name: "Veterinarian" },
    { id: "Status", name: "Status" },
    { id: "Actions", name: "Actions" },
  ];

  const handlechangepage = (event, newpage) => {
    pagechange(newpage);
  };
  const handleRowsPerPage = (event) => {
    rowperpagechange(+event.target.value);
    pagechange(0);
  };

  const [page, pagechange] = useState(0);
  const [rowperpage, rowperpagechange] = useState(10);

  const [notification, setNotification] = useState("");
  const [message, setMessage] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  //for modal
  const [errors, setErrors] = useState(null);
  const [modalloading, setModalloading] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [appointment, setAppointment] = useState({
    id: null,
    date: "",
    purpose: "",
    remarks: "",
    services: [],
    vet_id: null,
  });
  const [open, setOpen] = useState(false);

  const [services, setServices] = useState([]);

  const getAppointments = () => {
    setAppointments([]);
    setMessage("");
    setLoading(true);
    axiosClient
      .get(`/petowners/${id}/appointments`)
      .then(({ data }) => {
        setLoading(false);
        setAppointments(data.data);
      })
      .catch((mes) => {
        const response = mes.response;
        if (response && response.status == 404) {
          setMessage(response.data.message);
        }
        setLoading(false);
      });
  };

  const getServices = () => {
    axiosClient
      .get(`/services`)
      .then(({ data }) => {
        setServices(data.data);
      })
      .catch(() => {});
  };

  const [doctors, setDoctors] = useState([]);

  const getVets = () => {
    axiosClient
      .get(`/vets`)
      .then(({ data }) => {
        setDoctors(data.data);
      })
      .catch(() => {});
  };

  const addModal = (ev) => {
    getVets();
    setOpen(true);
    setAppointment({});
    setErrors(null);
    setSelectedServices([]);
  };

  const closepopup = () => {
    setOpen(false);
  };

  const onEdit = (r) => {
    setErrors(null);
    getVets();
    setModalloading(true);
    axiosClient
      .get(`/appointments/${r.id}`)
      .then(({ data }) => {
        setModalloading(false);
        setAppointment(data);
        setSelectedServices(data.services);
      })
      .catch(() => {
        setModalloading(false);
      });
    setOpen(true);
  };

  //buttons
  const onDone = (r) => {
    Swal.fire({
      title: "Are you sure the pet owner has shown up?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosClient.put(`/appointments/${r.id}/completed`).then(() => {
          Swal.fire({
            title: "Appointment proceed!",
            icon: "success",
          }).then(() => {
            getAppointments();
          });
        });
      }
    });
  };

  const onNoShow = (r) => {
    Swal.fire({
      title: "Are you sure the pet owner didn't show up?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosClient.put(`/appointments/${r.id}/noshow`).then(() => {
          Swal.fire({
            title: "Appointment cancelled!",
            icon: "error",
          }).then(() => {
            getAppointments();
          });
        });
      }
    });
  };

  const onAccept = (r) => {
    Swal.fire({
      title: "Are you sure to confirm this appointment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosClient.put(`/appointments/${r.id}/confirm`).then(() => {
          Swal.fire({
            title: "Appointment confirmed!",
            icon: "success",
          }).then(() => {
            getAppointments();
          });
        });
      }
    });
  };

  const onCancel = (r) => {
    Swal.fire({
      title: "Are you sure to cancel this appointment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosClient.put(`/appointments/${r.id}/cancel`).then(() => {
          Swal.fire({
            title: "Appointment cancelled!",
            icon: "error",
          }).then(() => {
            getAppointments();
          });
        });
      }
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (appointment.id) {
      axiosClient
        .put(`/appointments/${appointment.id}`, appointment)
        .then(() => {
          setNotification("Appointment was successfully updated.");
          setOpen(false);
          getAppointments();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post(`/appointments/petowner/${id}`, appointment)
        .then(() => {
          setNotification("Appointment was successfully saved.");
          setOpen(false);
          getAppointments();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  useEffect(() => {
    setAppointment({ ...appointment, services: selectedServices });
  }, [selectedServices]);

  useEffect(() => {
    getAppointments();
    getServices();
  }, []);

  return (
    <>
      <CustomHelmet title={`View Pet Owner Appointment #${id}`} />

      <Paper
        sx={{
          padding: "10px",
        }}
        elevation={4}
      >
        <Box
          p={1}
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
            add
          </Button>
        </Box>
        {notification && <Alert severity="success">{notification}</Alert>}

        <EditAppointment
          open={open}
          onClose={closepopup}
          onClick={closepopup}
          onSubmit={onSubmit}
          loading={modalloading}
          petownerid={id}
          petowner={petowner}
          services={services}
          doctors={doctors}
          appointment={appointment}
          setAppointment={setAppointment}
          errors={errors}
          isUpdate={appointment.id}
          selectedServices={selectedServices}
          setSelectedServices={setSelectedServices}
        />

        <TableContainer sx={{ height: 400 }}>
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
                {appointments &&
                  appointments
                    .slice(page * rowperpage, page * rowperpage + rowperpage)
                    .map((r) => (
                      <TableRow hover role="checkbox" key={r.id}>
                        <TableCell>
                          {format(new Date(r.date), "MMMM d, yyyy h:mm a")}
                        </TableCell>
                        <TableCell>
                          {services
                            .filter((service) =>
                              r.services.includes(service.id)
                            )
                            .map((filteredService) => (
                              <span key={filteredService.id}>
                                {filteredService.service}
                                <br></br>
                              </span>
                            ))}
                        </TableCell>
                        <TableCell>{r.purpose}</TableCell>
                        <TableCell>{r.remarks}</TableCell>
                        <TableCell>{r.vet.fullname}</TableCell>
                        <TableCell>{r.status}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={2}>
                            {r.status === "Confirmed" && (
                              <>
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
                                  color="success"
                                  onClick={() => onDone(r)}
                                >
                                  <DoneAll fontSize="small" />
                                </Button>
                                <Button
                                  variant="contained"
                                  size="small"
                                  color="error"
                                  onClick={() => onNoShow(r)}
                                >
                                  <Close fontSize="small" />
                                </Button>
                              </>
                            )}

                            {r.status === "Pending" && (
                              <>
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
                                  color="success"
                                  size="small"
                                  onClick={() => onAccept(r)}
                                >
                                  <Done fontSize="small" />
                                </Button>
                                <Button
                                  variant="contained"
                                  size="small"
                                  color="error"
                                  onClick={() => onCancel(r)}
                                >
                                  <Close fontSize="small" />
                                </Button>
                              </>
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
          sx={{ marginBottom: "-20px" }}
          rowsPerPageOptions={[10, 15, 25]}
          rowsPerPage={rowperpage}
          page={page}
          count={appointments.length}
          component="div"
          onPageChange={handlechangepage}
          onRowsPerPageChange={handleRowsPerPage}
        ></TablePagination>
      </Paper>
    </>
  );
}
