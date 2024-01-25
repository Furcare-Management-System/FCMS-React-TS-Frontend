import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import axiosClient from "../axios-client";

export default function Services() {
  //for table
  const columns = [
    { id: "Date", name: "Date" },
    { id: "Client", name: "Client" },
    { id: "Pet", name: "Pet" },
    { id: "Service", name: "Service" },
    { id: "Price", name: "Price" },
    { id: "Total", name: "Total" },
    { id: "Status", name: "Status" },
  ];
  const [page, pagechange] = useState(0);
  const [rowperpage, rowperpagechange] = useState(10);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [servicesavailed, setServicesavailed] = useState([]);

  const getServices = () => {
    setMessage(null);
    setLoading(true);
    axiosClient
      .get(`/servicesavailed`)
      .then(({ data }) => {
        setLoading(false);
        setServicesavailed(data.data);
        if (servicesavailed.length === 0) {
          setMessage("No services logs found.");
        }
      })
      .catch((mes) => {
        const response = mes.response;
        if (response && response.status == 404) {
          setMessage(response.data.message);
        }
        setLoading(false);
      });
  };

  const handlechangepage = (event, newpage) => {
    pagechange(newpage);
  };
  const handleRowsPerPage = (event) => {
    rowperpagechange(+event.target.value);
    pagechange(0);
  };

  useEffect(() => {
    getServices();
  }, []);

  return (
    <>
      <Box
        flex={5}
        sx={{
          minWidth: "90%",
          padding: "20px",
        }}
      >
        <Box
          p={1}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems={"center"}
        >
          <Typography variant="h5" p={2}>
            Services Logs
          </Typography>
          <Button
            component={Link}
            to={"/admin/services"}
            variant="contained"
            color="info"
          >
            services
          </Button>
        </Box>
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

            {!servicesavailed && !loading && message && (
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
                {servicesavailed &&
                  servicesavailed
                    .slice(page * rowperpage, page * rowperpage + rowperpage)
                    .map((r) => (
                      <TableRow hover role="checkbox" key={r.id}>
                        <TableCell>{r.date}</TableCell>
                        <TableCell>{`${r.clientservice.petowner.firstname} ${r.clientservice.petowner.lastname}`}</TableCell>
                        <TableCell>{r.pet.name}</TableCell>
                        <TableCell>{r.service.service}</TableCell>
                        <TableCell>
                          {r.unit_price ? r.unit_price.toFixed(2) : 0}
                        </TableCell>
                        <TableCell>
                          {(r.unit_price * r.quantity).toFixed(2)}
                        </TableCell>
                        <TableCell>{r.status}</TableCell>
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
          count={servicesavailed.length}
          component="div"
          onPageChange={handlechangepage}
          onRowsPerPageChange={handleRowsPerPage}
        ></TablePagination>
      </Box>
    </>
  );
}
