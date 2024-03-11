import {
  Alert,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Add, Archive, Close, Delete, Edit, Search } from "@mui/icons-material";
import Swal from "sweetalert2";

export default function Vets() {
  //for table
  const columns = [
    { id: "id", name: "ID" },
    { id: "Full Name", name: "Full Name" },
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

  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const getVets = () => {
    setLoading(true);
    setVets([]);
    setMessage(null);
    axiosClient
      .get("/vets")
      .then(({ data }) => {
        setLoading(false);
        setVets(data.data);
      })
      .catch((error) => {
        const response = error.response;
        if (response && response.status === 404) {
          setMessage(response.data.message);
        }
        setLoading(false);
      });
  };

  const onDelete = (r) => {
    Swal.fire({
      title: "Are you sure to archive this vet?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosClient.delete(`/vets/${r.id}/archive`).then(() => {
          Swal.fire({
            title: "Vet was archived!",
            icon: "error",
          }).then(() => {
            getVets();
          });
        });
      }
    });
  };

  //for modal
  const [open, openchange] = useState(false);

  const functionopenpopup = (ev) => {
    setVet({});
    setErrors(null);
    openchange(true);
  };

  const closepopup = () => {
    openchange(false);
  };

  const [errors, setErrors] = useState(null);
  const [modalloading, setModalloading] = useState(false);
  const [vet, setVet] = useState({
    id: null,
    fullname: "",
  });

  const onEdit = (r) => {
    setModalloading(true);
    axiosClient
      .get(`/vets/${r.id}`)
      .then(({ data }) => {
        setModalloading(false);
        setVet(data);
      })
      .catch(() => {
        setModalloading(false);
      });

    openchange(true);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (vet.id) {
      axiosClient
        .put(`/vets/${vet.id}`, vet)
        .then(() => {
          openchange(false);
          getVets();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post(`/vets`, vet)
        .then(() => {
          openchange(false);
          getVets();
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
    getVets();
  }, []);

  return (
    <>
      <Paper
        sx={{
          padding: "10px",
        }}
        elevation={4}
      >
        <Box
          p={2}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Typography variant="h5">Veterinarians</Typography>
          <Button
            variant="contained"
            size="small"
            color="success"
            onClick={functionopenpopup}
          >
            <Add />
          </Button>
        </Box>

        <Backdrop open={modalloading} style={{ zIndex: 999 }}>
          <CircularProgress color="inherit" />
        </Backdrop>

        {!modalloading && (
          <Dialog open={open} onClose={closepopup} fullWidth maxWidth="sm">
            {vet.id && (
              <DialogTitle>
                Update Vet
                <IconButton onClick={closepopup} style={{ float: "right" }}>
                  <Close color="primary"></Close>
                </IconButton>{" "}
              </DialogTitle>
            )}

            {!vet.id && (
              <DialogTitle>
                New Vet
                <IconButton onClick={closepopup} style={{ float: "right" }}>
                  <Close color="primary"></Close>
                </IconButton>{" "}
              </DialogTitle>
            )}

            <DialogContent>
              {errors && (
                <Box>
                  {Object.keys(errors).map((key) => (
                    <Alert severity="error" key={key}>
                      {errors[key][0]}
                    </Alert>
                  ))}
                </Box>
              )}
              <form onSubmit={(e) => onSubmit(e)}>
                <Stack spacing={2} margin={2}>
                  <TextField
                    variant="outlined"
                    id="Full Name"
                    label="Full Name"
                    value={vet.fullname || ""}
                    onChange={(ev) =>
                      setVet({ ...vet, fullname: ev.target.value })
                    }
                    required
                  />
                  <Button color="primary" variant="contained" type="submit">
                    Save
                  </Button>
                </Stack>
              </form>
            </DialogContent>
            <DialogActions></DialogActions>
          </Dialog>
        )}

        <TableContainer sx={{ height: 340 }}>
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
                  <TableCell colSpan={4} style={{ textAlign: "center" }}>
                    Loading...
                  </TableCell>
                </TableRow>
              </TableBody>
            )}

            {!loading && message && (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={7} style={{ textAlign: "center" }}>
                    {message}
                  </TableCell>
                </TableRow>
              </TableBody>
            )}

            {!loading && (
              <TableBody>
                {vets &&
                  vets
                    .slice(page * rowperpage, page * rowperpage + rowperpage)
                    .map((r) => (
                      <TableRow hover role="checkbox" key={r.id}>
                        <TableCell>{r.id}</TableCell>
                        <TableCell>{r.fullname}</TableCell>
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
                              onClick={() => onDelete(r)}
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
          sx={{ marginBottom: "-20px" }}
          rowsPerPageOptions={[10, 15, 25]}
          rowsPerPage={rowperpage}
          page={page}
          count={vets.length}
          component="div"
          onPageChange={handlechangepage}
          onRowsPerPageChange={handleRowsPerPage}
        ></TablePagination>
      </Paper>
    </>
  );
}
