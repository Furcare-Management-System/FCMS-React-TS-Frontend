import React, { useEffect, useState } from "react";
import {
  Box,
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
import { useStateContext } from "../contexts/ContextProvider";

export default function AllServicesAvailed() {
  //for table
  const columns = [
    { id: "Date", name: "Date" },
    { id: "Service", name: "Service" },
    { id: "Pet", name: "Pet" },
    { id: "Price", name: "Price" },
    { id: "Total", name: "Total" },
    { id: "Status", name: "Status" },
  ];
  const [page, pagechange] = useState(0);
  const [rowperpage, rowperpagechange] = useState(10);

  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [servicesavailed, setServicesavailed] = useState([]);

  const getServices = () => {
    setMessage("");
    setLoading(true);
    axiosClient
      .get(`/servicesavailed/petowner/${id}/all`)
      .then(({ data }) => {
        setLoading(false);
        setServicesavailed(data.data);
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
        <Divider />
        <TableContainer sx={{ height: 350 }}>
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
                {servicesavailed &&
                  servicesavailed
                    .slice(page * rowperpage, page * rowperpage + rowperpage)
                    .map((r) => (
                      <TableRow hover role="checkbox" key={r.id}>
                        <TableCell>{r.date}</TableCell>
                        <TableCell>{r.service.service}</TableCell>
                        <TableCell>{r.pet.name}</TableCell>
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
