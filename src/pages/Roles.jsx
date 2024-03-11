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
import { Add, Close, Delete, Edit, Search } from "@mui/icons-material";

export default function Roles() {
  //for table
  const columns = [
    { id: "id", name: "ID" },
    { id: "name", name: "Roles" },
    { id: "email", name: "Description" },
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

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  const getRoles = () => {
    setLoading(true);
    axiosClient
      .get("/roles")
      .then(({ data }) => {
        setLoading(false);
        setRoles(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const onDelete = (r) => {
    if (!window.confirm("Are you sure?")) {
      return;
    }

    axiosClient.delete(`/roles/${r.id}`).then(() => {
      setNotification("Role was deleted");
      getRoles();
    });
  };

  //for modal
  const [open, openchange] = useState(false);

  const functionopenpopup = (ev) => {
    setRole({});
    setErrors(null);
    openchange(true);
  };

  const closepopup = () => {
    openchange(false);
  };

  const [errors, setErrors] = useState(null);
  const [notification, setNotification] = useState("");
  const [modalloading, setModalloading] = useState(false);
  const [role, setRole] = useState({
    id: null,
    role: "",
    description: "",
  });

  const onEdit = (r) => {
    setModalloading(true);
    axiosClient
      .get(`/roles/${r.id}`)
      .then(({ data }) => {
        setModalloading(false);
        setRole(data);
      })
      .catch(() => {
        setModalloading(false);
      });

    openchange(true);
  };

  const onSubmit = () => {
    if (role.id) {
      axiosClient
        .put(`/roles/${role.id}`, role)
        .then(() => {
          setNotification("Role was successfully updated");
          openchange(false);
          getRoles();
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
    getRoles();
  }, []);

  return (
    <>
      <Paper
        sx={{
          padding: "10px",
          marginBottom: "-100px",
        }}
        elevation={4}
      >
        <Box
          p={2}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Typography variant="h5">Roles</Typography>
        </Box>

        {notification && <Alert severity="success">{notification} </Alert>}

        <Backdrop open={modalloading} style={{ zIndex: 999 }}>
          <CircularProgress color="inherit" />
        </Backdrop>

        {!modalloading && (
          <Dialog open={open} onClose={closepopup} fullWidth maxWidth="sm">
            {role.id && (
              <DialogTitle>
                Update Role
                <IconButton onClick={closepopup} style={{ float: "right" }}>
                  <Close color="primary"></Close>
                </IconButton>{" "}
              </DialogTitle>
            )}

            {!role.id && (
              <DialogTitle>
                New Role
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
              <Stack spacing={2} margin={2}>
                <TextField
                  variant="outlined"
                  id="Role"
                  label="Role"
                  value={role.role}
                  onChange={(ev) => setRole({ ...role, role: ev.target.value })}
                  InputProps={{
                    readOnly: role.id ? true : false,
                    "aria-readonly": role.id ? true : false,
                  }}
                />
                <TextField
                  variant="outlined"
                  id="Description"
                  label="Description"
                  value={role.description}
                  onChange={(ev) =>
                    setRole({ ...role, description: ev.target.value })
                  }
                />
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => onSubmit()}
                >
                  Save
                </Button>
              </Stack>
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

            {!loading && (
              <TableBody>
                {roles &&
                  roles
                    .slice(page * rowperpage, page * rowperpage + rowperpage)
                    .map((r) => (
                      <TableRow hover role="checkbox" key={r.id}>
                        <TableCell>{r.id}</TableCell>
                        <TableCell>{r.role}</TableCell>
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
          count={roles.length}
          component="div"
          onPageChange={handlechangepage}
          onRowsPerPageChange={handleRowsPerPage}
        ></TablePagination>
      </Paper>
    </>
  );
}
