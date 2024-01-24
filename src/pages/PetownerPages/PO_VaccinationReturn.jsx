import React, { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import { Link, useParams } from "react-router-dom";
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
import { useStateContext } from "../../contexts/ContextProvider";

export default function PO_VaccinationReturn() {
  const { notification, setNotification } = useStateContext();
  const { staffuser } = useStateContext();

  const columns = [
    { id: "Return Date", name: "Return Date" },
    { id: "Pet", name: "Pet" },
    { id: "weight", name: "Weight" },
    { id: "Against", name: "Against" },
    { id: "Description", name: "Description" },
    { id: "Veterinarian", name: "Veterinarian" },
    { id: "Last Avail", name: "Last Avail" },
  ];

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
    const [vaccinationlogs, setVaccinationlogs] = useState([]);

  const getVaccination = () => {
    setVaccinationlogs([]);
    setMessage(null);
    setLoading(true);
    axiosClient
      .get(`/vaccinationlogs/petowner/${staffuser.id}`)
      .then(({ data }) => {
        setLoading(false);
        setVaccinationlogs(data.data);
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
    getVaccination();
  }, []);

  return (
    <>
      <Paper
        sx={{
          minWidth: "90%",
          padding: "10px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h5" p={1}>
           Upcoming Vaccinations
          </Typography>
        </Box>
        <Box sx={{ minWidth: "90%" }}>
          {notification && <Alert severity="success">{notification}</Alert>}

          <TableContainer sx={{ height: 280 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      style={{ backgroundColor: "black", color: "white",fontSize:"12px" }}
                      key={column.id}
                      size="small"

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
                  {vaccinationlogs &&
                    vaccinationlogs.map((record) => (
                      <TableRow hover role="checkbox" key={record.id}>
                        <TableCell>{record.return}</TableCell>
                        <TableCell>{record.pet.name}</TableCell>
                        <TableCell>{`${record.weight} kg`}</TableCell>
                        <TableCell>{record.va_againsts}</TableCell>
                        <TableCell>{record.description}</TableCell>
                        <TableCell>{record.vet.fullname}</TableCell>
                        <TableCell>{record.date}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Box>
      </Paper>
    </>
  );
}
