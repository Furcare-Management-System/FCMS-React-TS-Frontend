import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
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
import { Add, Archive, Close, Delete, Edit } from "@mui/icons-material";
import UserEdit from "../components/modals/UserEdit";
import { Link } from "react-router-dom";
import BreedsModal from "../components/modals/BreedsModal";
import DropDownButtons from "../components/DropDownButtons";

export default function Treatments() {
  //for table
  const columns = [
    { id: "Date Submission", name: "Date Submission" },
    { id: "Date Released", name: "Date Released" },
    { id: "Treatment Cost", name: "Treatment Cost" },
    { id: "Pet", name: "Pet" },
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

  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");

  const getBreeds = () => {
    setLoading(true);
    axiosClient
      .get("/breeds")
      .then(({ data }) => {
        setLoading(false);
        setBreeds(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const [species, setSpecies] = useState([]);

  const getSpecies = () => {
    setLoading(true);
    axiosClient
      .get("/species")
      .then(({ data }) => {
        setLoading(false);
        setSpecies(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  //for modal
  const [errors, setErrors] = useState(null);
  const [modalloading, setModalloading] = useState(false);
  const [breed, setBreed] = useState({
    id: null,
    breed: "",
    description: "",
    specie_id: null,
  });
  const [open, openchange] = useState(false);

  const addModal = (ev) => {
    setBreed({});
    setErrors(null);
    openchange(true);
  };

  const closepopup = () => {
    openchange(false);
  };

  const onEdit = (r) => {
    setErrors(null);
    setModalloading(true);
    axiosClient
      .get(`/breeds/${r.id}`)
      .then(({ data }) => {
        setModalloading(false);
        setBreed(data);
      })
      .catch(() => {
        setModalloading(false);
      });
    openchange(true);
  };

  const onArchive = (u) => {
    if (!window.confirm("Are you sure to archive this breed?")) {
      return;
    }

    axiosClient.delete(`/breeds/${u.id}/archive`).then(() => {
      setNotification("breed was archived");
      getBreeds();
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (breed.id) {
      axiosClient
        .put(`/breeds/${breed.id}`, breed)
        .then(() => {
          setNotification("Breed was successfully updated");
          openchange(false);
          getBreeds();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post(`/breeds`, breed)
        .then(() => {
          setNotification("Breed was successfully added");
          openchange(false);
          getBreeds();
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
    getBreeds();
    getSpecies();
  }, []);

  return (
    <>
      <Paper
        sx={{
          padding: "10px",
        }}
      >
        <Box
          p={1}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Button onClick={addModal} variant="contained" size="small">
            <Add />
          </Button>
        </Box>

        {notification && <Alert severity="success">{notification}</Alert>}

        <TableContainer sx={{ height: 340 }} maxwidth="sm">
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

            {!loading && (
              <TableBody>
                {breeds &&
                  breeds
                    .slice(page * rowperpage, page * rowperpage + rowperpage)
                    .map((r) => (
                      <TableRow hover role="checkbox" key={r.id}>
                        <TableCell>{r.id}</TableCell>
                        <TableCell>{r.specie.specie}</TableCell>
                        <TableCell>{r.breed}</TableCell>
                        <TableCell>{r.description}</TableCell>
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
                              color="error"
                              size="small"
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
          count={breeds.length}
          component="div"
          onPageChange={handlechangepage}
          onRowsPerPageChange={handleRowsPerPage}
        ></TablePagination>
      </Paper>
      {/* </Box> */}
      {/* </Stack> */}
    </>
  );
}
