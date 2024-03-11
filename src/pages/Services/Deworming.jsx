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
import DewormingLogsModal from "../../components/modals/DewormingLogsModal";
import { useStateContext } from "../../contexts/ContextProvider";
import { format } from "date-fns";

export default function Deworming({ sid }) {
  const { notification, setNotification } = useStateContext();
  const { id } = useParams();

  //for table
  const columns = [
    { id: "date", name: "Date" },
    { id: "Pet", name: "Pet" },
    { id: "weight", name: "Weight" },
    { id: "Description", name: "Description" },
    { id: "Veterinarian", name: "Veterinarian" },
    { id: "Return", name: "Return" },
    { id: "Status", name: "Status" },
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

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState(null);

  const [deworminglogs, setDeworminglogs] = useState([]);
  const [deworminglog, setDeworminglog] = useState({
    id: null,
    date: null,
    weight: "",
    description: "",
    return: "",
    pet_id: null,
    vet_id: null,
    unit_price: null,
  });
  const [pets, setPets] = useState([]);
  const [vets, setVets] = useState([]);

  const [openAdd, setOpenAdd] = useState(false);
  const [pet, setPet] = useState([]);
  const [modalloading, setModalloading] = useState(false);

  const getDeworming = () => {
    setMessage(null);
    setDeworminglogs([]);
    setLoading(true);
    axiosClient
      .get(`/deworminglogs/petowner/${id}/service/${sid}`)
      .then(({ data }) => {
        setLoading(false);
        setDeworminglogs(data.data);
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

  const getVets = () => {
    axiosClient
      .get(`/vets`)
      .then(({ data }) => {
        setVets(data.data);
      })
      .catch(() => {});
  };

  const addModal = () => {
    getPets();
    getVets();
    setOpenAdd(true);
    setDeworminglog({});
    setErrors(null);
  };

  const closepopup = () => {
    setOpenAdd(false);
  };

  const onArchive = (u) => {
    if (!window.confirm("Are you sure to archive this?")) {
      return;
    }

    axiosClient.delete(`/deworminglogs/${u.id}/archive`).then(() => {
      setNotification("This deworming record was archived.");
      getDeworming();
    });
  };

  const onEdit = (r) => {
    getVets();
    setErrors(null);
    setModalloading(true);

    axiosClient
      .get(`/deworminglogs/${r.id}`)
      .then(({ data }) => {
        setModalloading(false);
        setDeworminglog(data);
        setPet(data.pet);
      })
      .catch(() => {
        setModalloading(false);
      });
    setOpenAdd(true);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (deworminglog.id) {
      axiosClient
        .put(`/deworminglogs/${deworminglog.id}`, deworminglog)
        .then(() => {
          setNotification("Pet deworming was successfully updated.");
          setOpenAdd(false);
          getDeworming();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post(`/deworminglogs/petowner/${id}/service/${sid}`, deworminglog)
        .then(() => {
          setNotification("Pet deworming was successfully saved.");
          setOpenAdd(false);
          getDeworming();
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
    getDeworming();
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
            add
          </Button>
        </Box>

        <DewormingLogsModal
          open={openAdd}
          onClose={closepopup}
          onClick={closepopup}
          onSubmit={onSubmit}
          loading={modalloading}
          pets={pets}
          vets={vets}
          deworminglog={deworminglog}
          setDeworminglog={setDeworminglog}
          errors={errors}
          isUpdate={deworminglog.id}
          pet={pet}
        />

        {/* <Button
            component={Link}
            to={`/admin/deworminglogs/archives`}
            variant="contained"
            color="success"
            size="small"
          >
            <Typography>Archives</Typography>
          </Button> */}

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
                  <TableCell colSpan={8} style={{ textAlign: "center" }}>
                    Loading...
                  </TableCell>
                </TableRow>
              </TableBody>
            )}

            {!loading && message && (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={8} style={{ textAlign: "center" }}>
                    {message}
                  </TableCell>
                </TableRow>
              </TableBody>
            )}

            {!loading && (
              <TableBody>
                {deworminglogs &&
                  deworminglogs
                    .slice(page * rowperpage, page * rowperpage + rowperpage)
                    .map((r) => (
                      <TableRow hover role="checkbox" key={r.id}>
                        <TableCell>
                          {format(new Date(r.date), "MMMM d, yyyy h:mm a")}
                        </TableCell>
                        <TableCell>{r.pet.name}</TableCell>
                        <TableCell>{`${r.weight} kg`}</TableCell>
                        <TableCell>{r.description}</TableCell>
                        <TableCell>{r.vet.fullname}</TableCell>
                        <TableCell>
                          {format(new Date(r.return), "MMMM d, yyyy h:mm a")}
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
          sx={{ marginBottom: "-10px" }}
          rowsPerPageOptions={[10, 15, 25]}
          rowsPerPage={rowperpage}
          page={page}
          count={deworminglogs.length}
          component="div"
          onPageChange={handlechangepage}
          onRowsPerPageChange={handleRowsPerPage}
        ></TablePagination>
      </Paper>
    </>
  );
}
