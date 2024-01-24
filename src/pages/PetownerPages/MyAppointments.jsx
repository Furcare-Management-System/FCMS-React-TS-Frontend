import React, { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Edit, Close, Add } from "@mui/icons-material";
import Swal from "sweetalert2";
import { useStateContext } from "../../contexts/ContextProvider";
import PetownerAppointmentModal from "../../components/modals/PetownerAppointmentModal";
import echo from "../../echo";
import { toast } from "react-toastify";

export default function MyAppointments() {
  const { staffuser } = useStateContext();
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:600px)");
  // const isMobile = useMediaQuery(theme.breakpoints.up("xs"));
  //for table
  const columns = [
    { id: "ID", name: "ID" },
    { id: "Date", name: "Date" },
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
      .get(`/petowners/${staffuser.id}/appointments`)
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

  const [anchorEl, setAnchorEl] = useState(null);

  const handleAppointments = (searchValue) => {
    setMessage(null);
    setAppointments([]);
    setLoading(true);
    axiosClient
      .get(`/appointments/${searchValue}`)
      .then(({ data }) => {
        setAppointments(data.data);
        setLoading(false);
        setAnchorEl(null);
      })
      .catch((error) => {
        const response = error.response;
        if (response && response.status === 404) {
          setMessage(response.data.message);
        }
        setLoading(false);
        setAnchorEl(null);
      });
  };

  const handleMenuItemClick = (searchValue) => {
    handleAppointments(searchValue);
  };

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
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
          setOpen(false);
          Swal.fire({
            text: "Appointment updated!",
            icon: "success",
          }).then((result) => {
            if (result.isConfirmed) {
              getAppointments();
            }
          });
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post(`/appointments/petowner/${staffuser.id}`, appointment)
        .then(() => {
          setOpen(false);
          Swal.fire({
            text: "Appointment saved!",
            icon: "success",
          }).then((result) => {
            if (result.isConfirmed) {
              getAppointments();
            }
          });
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  const channel = echo.private(`admin-channel.${3}`);
  // const channel = echo.channel(`admin-channel`);

  channel.listen(".appointment-event", function (data) {
    const display = `The appointment ${data.id} of ${data.firstname} ${data.lastname} is on ${data.date}`;
    toast.info(display, { theme: "colored",autoClose:10000 });
  });
  console.log(channel)

  useEffect(() => {
    setAppointment({ ...appointment, services: selectedServices });
  }, [selectedServices]);

  useEffect(() => {
    getAppointments();
    getServices();
  }, []);

  return (
    <>
      <Box
        sx={{
          minWidth: "90%",
          padding: "15px",
        }}
      >
        <Box
          p={1}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          {!isMobile && <Typography variant="h5">Appointments</Typography>}
          <Button
            onClick={addModal}
            variant="contained"
            color="success"
            size="small"
          >
            {/* create appointment */}
            {isMobile ? (
              <Add />
            ) : (
              <Typography justifyContent={"right"}>
                Create Appointment
              </Typography>
            )}
          </Button>
        </Box>
        {/* <DropDownButtons
              title="status"
              status={true}
              anchorEl={anchorEl}
              handleMenuItemClick={handleMenuItemClick}
              handleOpenMenu={handleOpenMenu}
              handleCloseMenu={handleCloseMenu}
              optionLabel1="current"
              optionLabel2="pending"
              optionLabel3="confirmed"
              optionLabel4="completed"
              optionLabel5="cancelled"
            /> */}
        <PetownerAppointmentModal
          open={open}
          onClose={closepopup}
          onClick={closepopup}
          onSubmit={onSubmit}
          loading={modalloading}
          petownerid={staffuser.id}
          services={services}
          doctors={doctors}
          appointment={appointment}
          setAppointment={setAppointment}
          errors={errors}
          isUpdate={appointment.id}
          selectedServices={selectedServices}
          setSelectedServices={setSelectedServices}
        />

        <TableContainer
          sx={{
            height: "100%",
            // width: "1050px",
            display: { xs: "none", sm: "block", md: "block", lg: "block" },
          }}
        >
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
                        <TableCell>{r.id}</TableCell>
                        <TableCell>{r.date}</TableCell>
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
                          {(r.status === "Pending" ||
                            r.status === "Confirmed") && (
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
                                onClick={() => onCancel(r)}
                              >
                                <Close fontSize="small" />
                              </Button>
                            </Stack>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>

        {isMobile && (
          <TableContainer
            sx={{
              height: "100%",
              width: "100%",
            }}
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{ backgroundColor: "black", color: "white" }}
                  >
                    Appointments
                  </TableCell>
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
                          <TableCell
                            sx={{
                              fontSize: "15px",
                            }}
                          >
                            <div>
                              <strong>ID:</strong> {r.id}
                            </div>
                            <div>
                              <strong>Date:</strong> {r.date}
                            </div>
                            <div>
                              <strong>Services:</strong>{" "}
                              {services
                                .filter((service) =>
                                  r.services.includes(service.id)
                                )
                                .map((filteredService) => (
                                  <span key={filteredService.id}>
                                    {filteredService.service}
                                    <br />
                                  </span>
                                ))}
                            </div>
                            <div>
                              <strong>Purpose:</strong> {r.purpose}
                            </div>
                            <div>
                              <strong>Remarks:</strong> {r.remarks}
                            </div>
                            <div>
                              <strong>Vet:</strong> {r.vet.fullname}
                            </div>
                            <div>
                              <strong>Status:</strong> {r.status}
                            </div>
                            {(r.status === "Pending" ||
                              r.status === "Confirmed") && (
                              <div>
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
                                    onClick={() => onCancel(r)}
                                  >
                                    <Close fontSize="small" />
                                  </Button>
                                </Stack>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              )}
            </Table>
          </TableContainer>
        )}
        <TablePagination
          rowsPerPageOptions={[10, 15, 25]}
          rowsPerPage={rowperpage}
          page={page}
          count={appointments.length}
          component="div"
          onPageChange={handlechangepage}
          onRowsPerPageChange={handleRowsPerPage}
        ></TablePagination>
      </Box>
    </>
  );
}
