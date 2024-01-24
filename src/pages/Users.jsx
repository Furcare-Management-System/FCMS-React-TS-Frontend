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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Notif from "../components/Notif";
import { useStateContext } from "../contexts/ContextProvider";
import Swal from "sweetalert2";

export default function Users() {
  const { notification, setNotification } = useStateContext();

  //for table
  const columns = [
    { id: "id", name: "ID" },
    { id: "email", name: "Email" },
    { id: "Role", name: "Role" },
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

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [opennotif, setOpennotif] = useState(false);
  const [message, setMessage] = useState(null);

  const getUsers = () => {
    setMessage(null);
    setLoading(true);
    axiosClient
      .get("/users")
      .then(({ data }) => {
        setLoading(false);
        setUsers(data.data);
      })
      .catch((error) => {
        const response = error.response;
        if (response && response.status === 404) {
          setMessage(response.data.message);
        }
        setLoading(false);
      });
  };

  //for modal
  const [errors, setErrors] = useState(null);
  const [modalloading, setModalloading] = useState(false);
  const [user, setUser] = useState({
    id: null,
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
    role_id: null,
  });
  const [open, openchange] = useState(false);
  const [roles, setRoles] = useState([]);

  const getRoles = () => {
    axiosClient
      .get("/roles")
      .then(({ data }) => {
        setRoles(data.data);
      })
      .catch(() => {});
  };

  const addModal = (ev) => {
    setNotification("");
    setUser({});
    getRoles();
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
      .get(`/users/${r.id}`)
      .then(({ data }) => {
        setModalloading(false);
        setUser(data);
      })
      .catch(() => {
        setModalloading(false);
      });
    openchange(true);
  };

  const onArchive = (u) => {
    Swal.fire({
      text: "Are you sure to archive this user?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosClient.delete(`/users/${u.id}/archive`).then(() => {
          Swal.fire({
            text: "User was archived.",
            icon: "success",
          }).then(() => {
            getUsers();
          });
        });
      }
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (user.id) {
      axiosClient
        .patch(`/users/${user.id}`, user)
        .then(() => {
          setNotification("User was successfully updated.");
          openchange(false);
          setOpennotif(true);
          getUsers();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post(`/users`, user)
        .then(() => {
          setNotification("Admin user was successfully created.");
          openchange(false);
          setOpennotif(true);
          getUsers();
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
    getUsers();
  }, []);

  return (
    <>
      <Paper
        sx={{
          padding: "10px",
        }}
      >
        <Box
          p={2}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Typography variant="h5">Users</Typography>
          <Button
            onClick={addModal}
            variant="contained"
            size="small"
            color="success"
          >
            <Add />
          </Button>
        </Box>
        <UserEdit
          open={open}
          onClick={closepopup}
          onClose={closepopup}
          onSubmit={onSubmit}
          loading={modalloading}
          roles={roles}
          user={user}
          setUser={setUser}
          errors={errors}
          isUpdate={user.id}
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
                {users &&
                  users
                    .slice(page * rowperpage, page * rowperpage + rowperpage)
                    .map((r) => (
                      <TableRow hover role="checkbox" key={r.id}>
                        <TableCell>{r.id}</TableCell>
                        <TableCell>{r.email}</TableCell>
                        <TableCell>{r.role_id}</TableCell>
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
          count={users.length}
          component="div"
          onPageChange={handlechangepage}
          onRowsPerPageChange={handleRowsPerPage}
        ></TablePagination>
        <Notif
          open={opennotif}
          notification={notification}
          severity={"success"}
        />
      </Paper>
    </>
  );
}
