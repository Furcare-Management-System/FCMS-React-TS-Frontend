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
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { DeleteForever, RestoreFromTrash } from "@mui/icons-material";
import { format } from "date-fns";

export default function UserArchives() {
  const columns = [
    { id: "id", name: "ID" },
    { id: "email", name: "Email" },
    { id: "deleteddate", name: "Deleted Date" },
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
  const [notification, setNotification] = useState("");
  const [message, setMessage] = useState(null);

  const getArchivedUsers = () => {
    setMessage(null);
    setUsers([]);
    setLoading(true);
    axiosClient
      .get(`/archives/users`)
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

  const onRestore = (u) => {
    if (!window.confirm("Are you sure to restore this uer?")) {
      return;
    }

    axiosClient.put(`/users/${u.id}/restore`).then(() => {
      setNotification("User was successfully restored");
      getArchivedUsers();
    });
  };

  const onDelete = (r) => {
    if (!window.confirm("Are you sure permanently delete this user?")) {
      return;
    }

    axiosClient.delete(`/archives/${r.id}/forcedelete`).then(() => {
      setNotification("User was permanently deleted");
      getArchivedUsers();
    });
  };

  useEffect(() => {
    getArchivedUsers();
  }, []);

  return (
    <>
      <Stack direction="row" justifyContent="space-between">
        <Box flex={5}>
          <Paper
            sx={{
              minWidth: "90%",
              padding: "10px",
            }}
          >
            <Typography p={1} variant="h5">
              Archived Users
            </Typography>
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
                    {users &&
                      users
                        .slice(
                          page * rowperpage,
                          page * rowperpage + rowperpage
                        )
                        .map((r) => (
                          <TableRow hover role="checkbox" key={r.id}>
                            <TableCell>{r.id}</TableCell>
                            <TableCell>{r.email}</TableCell>
                            <TableCell>
                              {format(
                                new Date(r.deleted_at),
                                "MMMM d, yyyy h:mm a"
                              )}
                            </TableCell>
                            <TableCell>
                              <Stack direction="row" spacing={2}>
                                <Button
                                  variant="contained"
                                  color="success"
                                  size="small"
                                  onClick={() => onRestore(r)}
                                >
                                  <RestoreFromTrash fontSize="small" />
                                </Button>
                                <Button
                                  variant="contained"
                                  size="small"
                                  color="error"
                                  onClick={() => onDelete(r)}
                                >
                                  <DeleteForever fontSize="small" />
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
          </Paper>
        </Box>
      </Stack>
    </>
  );
}
