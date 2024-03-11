import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import {
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
  Close,
  Done,
  DoneAll,
  Edit,
  Launch,
  NavigateNext,
  TaskAltOutlined,
} from "@mui/icons-material";
import EditAppointment from "../components/modals/EditAppointment";
import DropDownButtons from "../components/DropDownButtons";
import { SearchPetOwner } from "../components/SearchPetOwner";
import Notif from "../components/Notif";
import { useStateContext } from "../contexts/ContextProvider";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

export default function Appointments() {
  const navigate = useNavigate();

  //for table
  const columns = [
    { id: "ID", name: "ID" },
    { id: "Date", name: "Date" },
    { id: "client", name: "Client" },
    { id: "Services", name: "Services" },
    { id: "Purpose", name: "Purpose" },
    { id: "Remarks", name: "Remarks" },
    { id: "Veterinarian", name: "Veterinarian" },
    { id: "Status", name: "Status" },
    { id: "Actions", name: "Actions" },
  ];

  const petownerscolumns = [
    { id: "id", name: "ID" },
    { id: "name", name: "Name" },
    { id: "contact_num", name: "Contact Number" },
    { id: "address", name: "Address" },
    { id: "Actions", name: "Actions" },
  ];

  const [page, pagechange] = useState(0);
  const [rowperpage, rowperpagechange] = useState(10);

  const handlechangepage = (event, newpage) => {
    pagechange(newpage);
  };
  const handleRowsPerPage = (event) => {
    rowperpagechange(+event.target.value);
    pagechange(0);
  };

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [appointments, setAppointments] = useState([]);
  const [petowners, setPetowners] = useState([]);
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [query, setQuery] = useState("");

  //for notif modal
  const [opennotif, setOpennotif] = useState(false);
  const { notification, setNotification } = useStateContext();

  //for modal
  const [errors, setErrors] = useState(null);
  const [modalloading, setModalloading] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [appointment, setAppointment] = useState({
    id: null,
    date: null,
    purpose: "",
    remarks: "",
    petowner_id: null,
    services: [],
    vet_id: null,
  });

  const [petowner, setPetowner] = useState({
    id: null,
    firstname: "",
    lastname: "",
  });

  const [pid, setPid] = useState(null);
  const [open, openchange] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElVets, setAnchorElVets] = useState(null);
  const [openadd, setOpenadd] = useState(false);

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

  const handleVetAppointments = (searchValue) => {
    setMessage(null);
    setAppointments([]);
    setLoading(true);
    axiosClient
      .get(`/appointments/vet/${searchValue}`)
      .then(({ data }) => {
        setAppointments(data.data);
        setLoading(false);
        setAnchorElVets(null);
      })
      .catch((error) => {
        const response = error.response;
        if (response && response.status === 404) {
          setMessage(response.data.message);
        }
        setLoading(false);
        setAnchorElVets(null);
      });
  };

  const handleMenuItemClickVets = (searchValue) => {
    handleVetAppointments(searchValue);
  };

  const handleOpenMenuVets = (event) => {
    setAnchorElVets(event.currentTarget);
  };

  const handleCloseMenuVets = () => {
    setAnchorElVets(null);
  };

  const getAppointments = () => {
    setPid(null);
    setPetowners([]);
    setAppointments([]);
    setMessage(null);
    setLoading(true);
    axiosClient
      .get("/appointments/current")
      .then(({ data }) => {
        setAppointments(data.confirmed);
        setLoading(false);
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

  const getVets = () => {
    axiosClient
      .get(`/vets`)
      .then(({ data }) => {
        setDoctors(data.data);
      })
      .catch(() => {});
  };

  const search = (query) => {
    if (query) {
      setMessage(null);
      setPetowners([]);
      setLoading(true);
      axiosClient
        .get(`/petowners-search/${query}`)
        .then(({ data }) => {
          setLoading(false);
          setPetowners(data.data);
        })
        .catch((error) => {
          const response = error.response;
          if (response && response.status === 404) {
            setMessage(response.data.message);
          }
          setLoading(false);
        });
    }
  };

  //for modal
  const addModal = (p) => {
    getVets();
    setPid(p.id);
    setPetowner(p);
    setAppointment({});
    setErrors(null);
    setNotification("");
    setSelectedServices([]);
    openchange(true);
  };

  const closepopup = () => {
    openchange(false);
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
            navigate(`/admin/petowners/${r.petowner.id}/view`);
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
            handleAppointments("current");
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
            handleAppointments("current");
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
            handleAppointments("current");
          });
        });
      }
    });
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
        setPetowner(data.petowner);
        setSelectedServices(data.services);
      })
      .catch(() => {
        setModalloading(false);
      });
    openchange(true);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setOpenadd(false);

    if (appointment.id) {
      axiosClient
        .put(`/appointments/${appointment.id}`, appointment)
        .then(() => {
          // toast.success("Appointment updated!", {
          //   theme: "colored",
          // });
          Swal.fire({
            title: "Appointment updated!",
            icon: "success",
          });
          openchange(false);
          handleAppointments("current");
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post(`/appointments/petowner/${pid}`, appointment)
        .then(() => {
          setNotification("Appointment was successfully saved.");
          openchange(false);
          setOpennotif(true);
          handleAppointments("current");
          setQuery("");
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
    handleAppointments("current");
    getServices();
    getVets();
  }, []);

  return (
    <>
      <Paper
        sx={{
          minWidth: "90%",
          padding: "10px",
          margin: "10px",
        }}
        elevation={4}
      >
        <Box
          p={1}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box display={"flex"} flexDirection={"row"}>
            <Typography variant="h5" sx={{ mr: 2 }}>
              Appointments
            </Typography>
            <DropDownButtons
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
            />
            <DropDownButtons
              title="veterinarians"
              anchorEl={anchorElVets}
              vets={doctors}
              handleMenuItemClick={handleMenuItemClickVets}
              handleOpenMenu={handleOpenMenuVets}
              handleCloseMenu={handleCloseMenuVets}
            />
          </Box>
          <SearchPetOwner
            query={query}
            setQuery={setQuery}
            search={search}
            getPetowners={getAppointments}
          />
        </Box>

        <EditAppointment
          open={open}
          onClose={closepopup}
          onClick={closepopup}
          onSubmit={onSubmit}
          loading={modalloading}
          petowner={petowner}
          petownerid={pid}
          petowners={petowners}
          services={services}
          doctors={doctors}
          appointment={appointment}
          setAppointment={setAppointment}
          errors={errors}
          isUpdate={appointment.id}
          selectedServices={selectedServices}
          setSelectedServices={setSelectedServices}
        />

        <TableContainer sx={{ height: "100%" }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              {!query ? (
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
              ) : (
                <TableRow>
                  {petownerscolumns.map((column) => (
                    <TableCell
                      style={{ backgroundColor: "black", color: "white" }}
                      key={column.id}
                    >
                      {column.name}
                    </TableCell>
                  ))}
                </TableRow>
              )}
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

            {!loading && !query && (
              <TableBody>
                {appointments &&
                  appointments
                    .slice(page * rowperpage, page * rowperpage + rowperpage)
                    .map((r) => (
                      <TableRow hover role="checkbox" key={r.id}>
                        <TableCell>{r.id}</TableCell>
                        <TableCell>
                          {format(new Date(r.date), "MMMM d, yyyy h:mm a")}
                        </TableCell>
                        <TableCell>{`${r.petowner.firstname} ${r.petowner.lastname}`}</TableCell>
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
            {query && petowners && (
              <TableBody>
                {petowners &&
                  petowners
                    .slice(page * rowperpage, page * rowperpage + rowperpage)
                    .map((p) => (
                      <TableRow hover role="checkbox" key={p.id}>
                        <TableCell>{p.id}</TableCell>
                        <TableCell>{`${p.firstname} ${p.lastname}`}</TableCell>
                        <TableCell>0{p.contact_num}</TableCell>
                        <TableCell>
                          {p.address.zone}, {p.address.barangay},{" "}
                          {p.address.zipcode.area}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => addModal(p)}
                          >
                            <Add fontSize="small" />
                          </Button>
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
        <Notif open={opennotif} notification={notification} />
      </Paper>
    </>
  );
}
