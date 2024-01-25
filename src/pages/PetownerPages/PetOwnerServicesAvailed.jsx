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
  useMediaQuery,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import axiosClient from "../../axios-client";
import { useStateContext } from "../../contexts/ContextProvider";

export default function PetOwnerServicesAvailed() {
  const { staffuser } = useStateContext();
  const isMobile = useMediaQuery("(max-width:600px)");
  //for table
  const columns = [
    { id: "Date", name: "Date" },
    { id: "Pet", name: "Pet" },
    { id: "Service", name: "Service" },
    { id: "Total", name: "Total" },
    { id: "Status", name: "Status" },
  ];
  const [page, pagechange] = useState(0);
  const [rowperpage, rowperpagechange] = useState(10);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [servicesavailed, setServicesavailed] = useState([]);

  const getServices = () => {
    setMessage("");
    setLoading(true);
    axiosClient
      .get(`/servicesavailed/petowner/${staffuser.id}/all`)
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
        {!isMobile && (
          <Typography p={2} variant="h5">
            Availed Services
          </Typography>
        )}

        <TableContainer
          sx={{
            height: "100%",
            width: "1050px",
            display: { xs: "none", sm: "block", md: "block", lg: "block" },
          }}
        >
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
                        <TableCell>{r.pet.name}</TableCell>
                        <TableCell>{r.service.service}</TableCell>
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

        {isMobile && (
          <TableContainer
            sx={{
              height: "100%",
              width: "100%",
            }}
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{ backgroundColor: "black", color: "white" }}
                  >
                    Availed Services
                  </TableCell>
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
                          <TableCell   sx={{
                              fontSize: "15px",
                            }}>
                            <div>
                              <strong>Date:</strong> {r.date}
                            </div>
                            <div>
                              <strong>Pet:</strong> {r.pet.name}
                            </div>
                            <div>
                              <strong>Service:</strong>
                              {r.service.service}
                            </div>
                            <div>
                              <strong>Total:</strong>{" "}
                              {(r.unit_price * r.quantity).toFixed(2)}
                            </div>
                            <div>
                              <strong>Status:</strong> {r.status}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              )}
            </Table>
          </TableContainer>
        )}

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
