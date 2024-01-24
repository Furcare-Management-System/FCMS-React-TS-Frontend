import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link, useParams } from "react-router-dom";
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

export default function ServiceAvaileble() {
  //for table
  const columns = [
    { id: "id", name: "ID" },
    { id: "Service", name: "Service" },
    { id: "Status", name: "Status" },
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

  const [notification, setNotification] = useState("");
  const [services, setservices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [btnloading, setbtnLoading] = useState(false);

  const getServices = () => {
    setLoading(true);
    axiosClient
      .get("/services")
      .then(({ data }) => {
        setLoading(false);
        setservices(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const isAvailable = (r) => {
    setbtnLoading(true);
    axiosClient
      .put(`/services/${r.id}/isAvailable`)
      .then(({ data }) => {
        setbtnLoading(false);
        getServices()
      })
      .catch(() => {
        setbtnLoading(false);
      });
  };

  useEffect(() => {
    getServices();
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
          p={2}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Typography variant="h5">Services</Typography>
        </Box>

        {notification && <Alert severity="success">{notification}</Alert>}

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
                  <TableCell colSpan={5} style={{ textAlign: "center" }}>
                    Loading...
                  </TableCell>
                </TableRow>
              </TableBody>
            )}

            {!loading && (
              <TableBody>
                {services &&
                  services
                    .slice(page * rowperpage, page * rowperpage + rowperpage)
                    .map((r) => (
                      <TableRow hover role="checkbox" key={r.id}>
                        <TableCell>{r.id}</TableCell>
                        <TableCell>{r.service}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={2}>
                            {r.isAvailable === 1 ? (
                              <Button
                                variant="contained"
                                size="small"
                                color="success"
                                disabled={btnloading}
                                onClick={() => isAvailable(r)}
                                sx={{width:"130px"}}
                              >
                                AVAILABLE
                              </Button>
                            ) : (
                              <Button
                                variant="contained"
                                size="small"
                                color="error"
                                disabled={btnloading}
                                sx={{width:"130px"}}
                                onClick={() => isAvailable(r)}
                              >
                               NOT AVAILABLE
                              </Button>
                            )}
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
          count={services.length}
          component="div"
          onPageChange={handlechangepage}
          onRowsPerPageChange={handleRowsPerPage}
        ></TablePagination>
      </Paper>
    </>
  );
}
