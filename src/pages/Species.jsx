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
import SpeciesModal from "../components/modals/SpeciesModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Species() {
  //for table
  const columns = [
    { id: "id", name: "ID" },
    { id: "Specie", name: "Specie" },
    { id: "Description", name: "Description" },
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

  const [loading, setLoading] = useState(false);
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
  const [specie, setSpecie] = useState({
    id: null,
    specie: "",
    description: "",
  });

  const [open, openchange] = useState(false);

  const addModal = (ev) => {
    setSpecie({});
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
      .get(`/species/${r.id}`)
      .then(({ data }) => {
        setModalloading(false);
        setSpecie(data);
      })
      .catch(() => {
        setModalloading(false);
      });
    openchange(true);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (specie.id) {
      axiosClient
        .put(`/species/${specie.id}`, specie)
        .then(() => {
          toast.success("A specie was successfully updated.", {
            theme: "colored",
          });
          openchange(false);
          getSpecies();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post(`/species`, specie)
        .then(() => {
          toast.success("A specie was successfully added.");
          openchange(false);
          getSpecies();
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
    getSpecies();
  }, []);

  return (
    <>
      <Paper
        sx={{
          padding: "10px",
        }}
        elevation={4}
      >
        {/* <ToastContainer></ToastContainer> */}
        <Box
          p={2}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Typography variant="h5">Species</Typography>
          <Button
            onClick={addModal}
            variant="contained"
            size="small"
            color="success"
          >
            <Add />
          </Button>
        </Box>

        <SpeciesModal
          open={open}
          onClose={closepopup}
          onClick={closepopup}
          onSubmit={onSubmit}
          loading={modalloading}
          specie={specie}
          setSpecie={setSpecie}
          errors={errors}
          isUpdate={specie.id}
        />

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
                {species &&
                  species
                    .slice(page * rowperpage, page * rowperpage + rowperpage)
                    .map((r) => (
                      <TableRow hover role="checkbox" key={r.id}>
                        <TableCell>{r.id}</TableCell>
                        <TableCell>{r.specie}</TableCell>
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
          count={species.length}
          component="div"
          onPageChange={handlechangepage}
          onRowsPerPageChange={handleRowsPerPage}
        ></TablePagination>
      </Paper>
    </>
  );
}
