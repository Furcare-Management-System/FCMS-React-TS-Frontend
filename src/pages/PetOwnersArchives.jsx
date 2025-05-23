import {
  Alert,
  Box,
  Button,
  CssBaseline,
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
import { Link } from "react-router-dom";
import { DeleteForever, RestoreFromTrash } from "@mui/icons-material";
import CustomHelmet from "../components/CustomHelmet";

export default function PetOwnerArchives() {
  const columns = [
    { id: "id", name: "ID" },
    { id: "name", name: "Name" },
    { id: "contact_num", name: "Contact Number" },
    { id: "address", name: "Address" },
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

  const [petowners, setPetowners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");
  const [message, setMessage] = useState(null);

  const getPetOwnerArchives = () => {
    setMessage(null);
    setLoading(true);
    setPetowners([]);
    axiosClient
      .get("/archives/petowners")
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
  };

  const onRestore = (po) => {
    if (!window.confirm("Are you sure to restore this client?")) {
      return;
    }

    axiosClient.put(`/petowners/${po.id}/restore`).then(() => {
      setNotification("Pet Owner was successfully restored");
      getPetOwnerArchives();
    });
  };

  const onDelete = (po) => {
    if (!window.confirm("Are you sure permanently delete this client?")) {
      return;
    }

    axiosClient.delete(`/petowners/archives/${po.id}/forcedelete`).then(() => {
      setNotification("Pet Owner was permanently deleted");
      getPetOwnerArchives();
    });
  };

  useEffect(() => {
    getPetOwnerArchives();
  }, []);

  return (
    <>
      <CustomHelmet title="Pet Owner Archives" />

      <Stack direction="row" justifyContent="space-between">
        <Box flex={5}>
          <Paper
            sx={{
              minWidth: "90%",
              padding: "10px",
            }}
          >
            <Typography variant="h5" p={1}>
              Archived Pet Owners
            </Typography>{" "}
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
                      <TableCell colSpan={5} style={{ textAlign: "center" }}>
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
                    {petowners &&
                      petowners
                        .slice(
                          page * rowperpage,
                          page * rowperpage + rowperpage
                        )
                        .map((po) => (
                          <TableRow hover role="checkbox" key={po.id}>
                            <TableCell>{po.id}</TableCell>
                            <TableCell>{`${po.firstname} ${po.lastname}`}</TableCell>
                            <TableCell>{po.contact_num}</TableCell>
                            <TableCell>
                              {po.zone}, {po.barangay}, {po.zipcode.area}
                            </TableCell>
                            <TableCell>{po.deleted_at}</TableCell>
                            <TableCell>
                              <Stack direction="row" spacing={2}>
                                <Button
                                  variant="contained"
                                  color="success"
                                  size="small"
                                  onClick={() => onRestore(po)}
                                >
                                  <RestoreFromTrash fontSize="small" />
                                </Button>
                                <Button
                                  variant="contained"
                                  size="small"
                                  color="error"
                                  onClick={() => onDelete(po)}
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
              sx={{ marginBottom: "-20px" }}
              rowsPerPageOptions={[10, 15, 25]}
              rowsPerPage={rowperpage}
              page={page}
              count={petowners.length}
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
