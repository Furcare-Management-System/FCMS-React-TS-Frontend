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
import { Link, useNavigate } from "react-router-dom";
import { DeleteForever, RestoreFromTrash } from "@mui/icons-material";
import CustomHelmet from "../components/CustomHelmet";

export default function PetsArchives() {
  const navigate = useNavigate();
  const columns = [
    { id: "id", name: "ID" },
    { id: "name", name: "Pet Name" },
    { id: "gender", name: "Gender" },
    { id: "breed", name: "Breed" },
    { id: "Deleted Date", name: "Deleted Date" },
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

  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");
  const [message, setMessage] = useState("");

  const getPetsArchive = () => {
    setMessage(null);
    setPets([]);
    setLoading(true);
    axiosClient
      .get("/archives/pets")
      .then(({ data }) => {
        setLoading(false);
        setPets(data.data);
      })
      .catch((mes) => {
        const response = mes.response;
        if (response && response.status == 404) {
          setMessage(response.data.message);
        }
        setLoading(false);
      });
  };

  const onRestore = (po) => {
    if (!window.confirm("Are you sure to restore this pet?")) {
      return;
    }

    axiosClient.put(`/pets/${po.id}/restore`).then(() => {
      setNotification("Pet was successfully restored");
      getPetsArchive();
    });
  };

  const onDelete = (po) => {
    if (!window.confirm("Are you sure permanently delete this pet?")) {
      return;
    }

    axiosClient.delete(`/pets/archives/${po.id}/forcedelete`).then(() => {
      setNotification("Pet was permanently deleted");
      getPetsArchive();
    });
  };

  useEffect(() => {
    getPetsArchive();
  }, []);

  return (
    <>
      <CustomHelmet title="Pet Archives" />

      <Stack direction="row" justifyContent="space-between">
        <Box flex={5}>
          <Paper
            sx={{
              minWidth: "90%",
              padding: "10px",
            }}
          >
            <Typography variant="h5" p={1}>
              Archived Pets
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
                    {pets &&
                      pets
                        .slice(
                          page * rowperpage,
                          page * rowperpage + rowperpage
                        )
                        .map((po) => (
                          <TableRow hover role="checkbox" key={po.id}>
                            <TableCell>{po.id}</TableCell>
                            <TableCell>{po.name}</TableCell>
                            <TableCell>{po.gender}</TableCell>
                            <TableCell>{po.breed.breed}</TableCell>
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
              count={pets.length}
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
