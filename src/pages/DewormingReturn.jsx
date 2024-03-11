import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
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
import DropDownButtons from "../components/DropDownButtons";
import { format } from "date-fns";

export default function DewormingReturn() {
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
  const [deworminglogs, setDeworminglogs] = useState([]);

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
          margin: "20px",
        }}
        elevation={6}
      >
        <Typography variant="h5" p={1}>
          Deworming Returns
        </Typography>
        <Box>
          <DropDownButtons
            title="filter"
            status={true}
            anchorEl={anchorEl}
            handleMenuItemClick={handleMenuItemClick}
            handleOpenMenu={handleOpenMenu}
            handleCloseMenu={handleCloseMenu}
            optionLabel1="today"
            optionLabel2="this week"
            optionLabel3="this month"
            optionLabel4="this year"
          />
        </Box>
        <Box sx={{ minWidth: "90%" }}>
          <TableContainer sx={{ height: "100%" }}>
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
                          <TableCell>
                            {format(
                              new Date(record.return),
                              "MMMM d, yyyy h:mm a"
                            )}
                          </TableCell>
                          <TableCell>{`${record.servicesavailed.clientservice.petowner.firstname} ${record.servicesavailed.clientservice.petowner.lastname}`}</TableCell>
                          <TableCell>{record.pet.name}</TableCell>
                          <TableCell>{`${record.weight} kg`}</TableCell>
                          <TableCell>{record.description}</TableCell>
                          <TableCell>{record.vet.fullname}</TableCell>
                          <TableCell>
                            {format(
                              new Date(record.date),
                              "MMMM d, yyyy h:mm a"
                            )}
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
