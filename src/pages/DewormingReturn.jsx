import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { useStateContext } from "../contexts/ContextProvider";
import DropDownButtons from "../components/DropDownButtons";

export default function DewormingReturn() {
  const { notification, setNotification } = useStateContext();

  const columns = [
    { id: "Return Date", name: "Return Date" },
    { id: "Client", name: "Client" },
    { id: "Pet", name: "Pet" },
    { id: "weight", name: "Weight" },
    { id: "Description", name: "Description" },
    { id: "Veterinarian", name: "Veterinarian" },
    { id: "Last Avail", name: "Last Avail" },
  ];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState(null);
  const [deworminglogs, setDeworminglogs] = useState([]);
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
  });
  const [vets, setVets] = useState([]);
  const [pet, setPet] = useState([]);

  const [openAdd, setOpenAdd] = useState(false);
  const [modalloading, setModalloading] = useState(false);

  const { id } = useParams();

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getDewormings = () => {
    setDeworminglogs([]);
    setMessage(null);
    setLoading(true);
    axiosClient
      .get(`/deworminglogs/today`)
      .then(({ data }) => {
        setLoading(false);
        setDeworminglogs(data.data);
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

  const handleOpenAddModal = () => {
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

    axiosClient.delete(`/deworminglogs/${record.id}/archive`).then(() => {
      setNotification("Vaccination was archived");
      getDewormings();
    });
  };

  const handleEdit = (record) => {
    getAgainsts();
    getVets();
    setErrors(null);
    setModalloading(true);

    axiosClient
      .get(`/deworminglogs/${record.id}`)
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

  useEffect(() => {
    getDewormings();
  }, []);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleVaccinations = (searchValue) => {
    setMessage(null);
    setDeworminglogs([]);
    setLoading(true);
    axiosClient
      .get(`/deworminglogs/${searchValue}`)
      .then(({ data }) => {
        setDeworminglogs(data.data);
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
    handleVaccinations(searchValue);
  };

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Paper
        sx={{
          minWidth: "90%",
          padding: "10px",
        }}
      >
        <Box>
          <DropDownButtons
            title="filter"
            status={true}
            anchorEl={anchorEl}
            handleMenuItemClick={handleMenuItemClick}
            handleOpenMenu={handleOpenMenu}
            handleCloseMenu={handleCloseMenu}
            optionLabel1="today"
            optionLabel2="weekly"
            optionLabel3="monthly"
            optionLabel4="yearly"
          />
        </Box>
        <Box sx={{ minWidth: "90%" }}>
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
                  {deworminglogs &&
                    deworminglogs
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((record) => (
                        <TableRow hover role="checkbox" key={record.id}>
                          <TableCell>{record.return}</TableCell>
                          <TableCell>{`${record.servicesavailed.clientservice.petowner.firstname} ${record.servicesavailed.clientservice.petowner.lastname}`}</TableCell>
                          <TableCell>{record.pet.name}</TableCell>
                          <TableCell>{`${record.weight} kg`}</TableCell>
                          <TableCell>{record.description}</TableCell>
                          <TableCell>{record.vet.fullname}</TableCell>
                          <TableCell>{record.date}</TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              )}
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 15, 25]}
            rowsPerPage={rowsPerPage}
            page={page}
            count={deworminglogs.length}
            component="div"
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          ></TablePagination>
        </Box>
      </Paper>
    </>
  );
}
