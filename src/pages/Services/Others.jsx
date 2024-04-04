import React, { useEffect, useState } from "react";
import {
  Alert,
  Backdrop,
  Box,
  Button,
  Divider,
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
  Typography,
} from "@mui/material";
import { Add, Archive, Delete, Edit } from "@mui/icons-material";
import { Link, useParams } from "react-router-dom";
import axiosClient from "../../axios-client";
import { format } from "date-fns";
import OthersModal from "../../components/modals/OthersModal";
import Swal from "sweetalert2";

export default function Others({ sname }) {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [notification, setNotification] = useState("");
  const [message, setMessage] = useState(null);
  const [errormessage, setErrorMessage] = useState(null);

  const [testresults, setTestresults] = useState([]);
  const [pets, setPets] = useState([]);
  const [othertests, setOthertests] = useState([]);

  const [testresult, setTestresult] = useState({
    id: null,
    pet_id: null,
    unit_price: null,
    service_id: null,
  });

  const [error, setError] = useState(null);

  const getOthers = () => {
    setTestresults([]);
    setMessage(null);
    setLoading(true);
    axiosClient
      .get(`/servicesavailed/others/petowner/${id}`)
      .then(({ data }) => {
        setLoading(false);
        setTestresults(data.data);
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
      .catch((mes) => {
        const response = mes.response;
        if (response && response.status == 404) {
          setErrorMessage(response.data.message);
        }
      });
  };

  const getOtherServices = () => {
    setOthertests([]);
    setMessage(null);
    setLoading(true);
    axiosClient
      .get(`/services/others`)
      .then(({ data }) => {
        setLoading(false);
        setOthertests(data.data);
      })
      .catch((mes) => {
        const response = mes.response;
        if (response && response.status == 404) {
          setMessage(response.data.message);
        }
        setLoading(false);
      });
  };

  //for table
  const columns = [
    { id: "Date and Time", name: "Date and Time" },
    { id: "Pet", name: "Pet" },
    { id: "Service", name: "Service" },
    { id: "Status", name: "Status" },
    { id: "Action", name: "Action" },
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

  //for modal
  const [open, openchange] = useState(false);
  const [upload, setUpload] = useState(false);
  const [trid, setTrid] = useState(null);
  const [modalloading, setModalloading] = useState(false);

  const openModal = () => {
    setTestresult({});
    getPets();
    getOtherServices();
    openchange(true);
    setErrors(null);
    setError(null);
  };

  const closeModal = () => {
    openchange(false);
    setUpload(false);
  };

  // onClicks
  const onEdit = (r) => {
    getPets();
    getOtherServices();
    setModalloading(true);
    axiosClient
      .get(`/testresults/${r.id}`)
      .then(({ data }) => {
        setTestresult(data);
        setModalloading(false);
      })
      .catch(() => {
        setModalloading(false);
      });

    openchange(true);
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
        axiosClient.delete(`/servicesavailed/${u.id}/forcedelete`).then(() => {
          Swal.fire({
            title: "Other service was deleted.",
            icon: "success",
          }).then(() => {
            getOthers();
          });
        });
      }
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (testresult.id) {
      axiosClient
        .put(`/testresults/${testresult.id}`, testresult)
        .then(() => {
          setNotification("Test result was successfully updated.");
          openchange(false);
          getOthers();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post(
          `/servicesavailed/petowner/${id}/service/${testresult.service_id}`,
          testresult
        )
        .then(() => {
          setNotification("Test result was successfully saved.");
          openchange(false);
          setTestresult({});
          getOthers();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  useEffect(() => {
    getOthers();
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
          sx={{
            minWidth: "90%",
          }}
        >
          <Box
            p={1}
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Button
              onClick={openModal}
              variant="contained"
              color="success"
              size="small"
            >
              add
            </Button>
          </Box>
          {notification && <Alert severity="success">{notification}</Alert>}

          <OthersModal
            open={open}
            onClick={closeModal}
            onClose={closeModal}
            onSubmit={onSubmit}
            loading={modalloading}
            pets={pets}
            errors={errors}
            testresult={testresult}
            setTestresult={setTestresult}
            isUpdate={testresult.id}
            petid={null}
            error={error}
            servicename={sname}
            errormessage={errormessage}
            othertests={othertests}
          />

          <Divider />
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
                  {testresults &&
                    testresults
                      .slice(page * rowperpage, page * rowperpage + rowperpage)
                      .map((r) => (
                        <TableRow hover role="checkbox" key={r.id}>
                          <TableCell>
                            {format(new Date(r.date), "MMMM d, yyyy h:mm a")}
                          </TableCell>
                          <TableCell>{r.pet.name}</TableCell>
                          <TableCell>{r.service.service}</TableCell>
                          <TableCell>{r.status}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={2}>
                              {/* <Button
                                variant="contained"
                                color="info"
                                size="small"
                                onClick={() => onEdit(r)}
                              >
                                <Edit fontSize="small" />
                              </Button> */}
                              {r.status === "To Pay" && (
                                <Button
                                  variant="contained"
                                  size="small"
                                  color="error"
                                  onClick={() => onDelete(r)}
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
            rowsPerPage={rowperpage}
            page={page}
            count={testresults.length}
            component="div"
            onPageChange={handlechangepage}
            onRowsPerPageChange={handleRowsPerPage}
          ></TablePagination>
        </Box>
      </Paper>
    </>
  );
}
