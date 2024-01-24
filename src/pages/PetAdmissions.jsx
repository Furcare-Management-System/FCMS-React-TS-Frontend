import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link, useParams } from "react-router-dom";
import {
  Alert,
  Backdrop,
  Box,
  Button,
  CircularProgress,
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
import {
  Add,
  Archive,
  Close,
  NavigateNext,
  Visibility,
} from "@mui/icons-material";

export default function PetAdmissions() {
  const { id } = useParams();
  //for table
  const columns = [
    { id: "Date", name: "Date" },
    { id: "Day", name: "Day" },
    { id: "diagnosis", name: "Diagnosis" },
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
  const [notification, setNotification] = useState("");
  const [message, setMessage] = useState(null);
  const [treatments, setTreatments] = useState([]);

  const getTreatments = () => {
    setFilterdate(null);
    setMessage(null);
    setLoading(true);
    axiosClient
      .get(`/treatments/pet/${id}`)
      .then(({ data }) => {
        setLoading(false);
        setTreatments(data.data);
      })
      .catch((error) => {
        const response = error.response;
        if (response && response.status === 404) {
          setMessage(response.data.message);
        }
        setLoading(false);
      });
  };

  const onArchive = (u) => {
    if (!window.confirm("Are you sure to archive this pet owner?")) {
      return;
    }

    axiosClient.delete(`/treatments/${u.id}/archive`).then(() => {
      setNotification("Pet Owner was archived");
      getTreatments();
    });
  };

  //filter by date
  const [filterdate, setFilterdate] = useState(null);

  const filter = () => {
    setTreatments([]);
    setMessage(null);
    setLoading(true);
    axiosClient
      .get(`/treatments/pet/${id}/${filterdate}`)
      .then(({ data }) => {
        setLoading(false);
        setTreatments(data.data);
      })
      .catch((mes) => {
        const response = mes.response;
        if (response && response.status == 404) {
          setMessage(response.data.message);
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    getTreatments();
  }, []);

  return (
    <>
      <Paper
        sx={{
          minWidth: "90%",
          padding: "10px",
          margin: "10px",
        }}
      >
        <Box p={1} sx={{ display: "flex", justifyContent: "right" }}>
          <TextField
            label="Date"
            variant="outlined"
            id="Date"
            type="date"
            size="small"
            value={filterdate || ``}
            onChange={(ev) => setFilterdate(ev.target.value)}
            InputLabelProps={{ shrink: true }}
            required
          />
          {filterdate && (
            <IconButton variant="outlined" onClick={getTreatments}>
              <Close />
            </IconButton>
          )}
          <Button
            variant="contained"
            size="small"
            sx={{ ml: 1 }}
            onClick={filter}
          >
            <Typography fontSize={"12px"}>Filter</Typography>
          </Button>
        </Box>
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
                  <TableCell colSpan={7} style={{ textAlign: "center" }}>
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
                {treatments &&
                  treatments
                    .slice(page * rowperpage, page * rowperpage + rowperpage)
                    .map((r) => (
                      <TableRow hover role="checkbox" key={r.id}>
                        <TableCell>{r.date}</TableCell>
                        <TableCell>{r.day}</TableCell>
                        <TableCell>{r.diagnosis}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={2}>
                            <Button
                              component={Link}
                              to={`/admin/treatment/` + r.id}
                              variant="contained"
                              color="info"
                              size="small"
                              target="_blank"
                            >
                              <Visibility fontSize="small" />
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
          rowsPerPageOptions={[10, 15, 25]}
          rowsPerPage={rowperpage}
          page={page}
          count={treatments.length}
          component="div"
          onPageChange={handlechangepage}
          onRowsPerPageChange={handleRowsPerPage}
        ></TablePagination>
      </Paper>
    </>
  );
}
