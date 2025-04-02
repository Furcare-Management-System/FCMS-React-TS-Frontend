import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
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
import axiosClient from "../../axios-client";
import { useStateContext } from "../../contexts/ContextProvider";
import CustomHelmet from "../../components/CustomHelmet";

export default function PetOwnerPaymentsHistory() {
  const { staffuser } = useStateContext();
  const isMobile = useMediaQuery("(max-width:600px)");

  //for table
  const columns = [
    { id: "Date", name: "Date" },
    { id: "Total", name: "Total" },
    { id: "Deposit", name: "Deposit" },
    { id: "Remaining Charge", name: "Remaining Charge" },
    { id: "Type of Payment", name: "Type of Payment" },
    { id: "Amount", name: "Amount" },
    { id: "Change", name: "Change" },
    { id: "Balance", name: "Balance" },
    { id: "Status", name: "Status" },
  ];
  const [page, pagechange] = useState(0);
  const [rowperpage, rowperpagechange] = useState(10);

  const [chargeslip, setChargeSlip] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const getPayments = () => {
    setMessage("");
    setLoading(true);
    axiosClient
      .get(`/paymentrecords/petowner/${staffuser.id}`)
      .then(({ data }) => {
        setLoading(false);
        setChargeSlip(data.data);
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
    getPayments();
  }, []);

  return (
    <>
      <CustomHelmet title="Payment Histories" />

      <Box
        flex={5}
        sx={{
          minWidth: "90%",
          padding: "20px",
        }}
      >
        {!isMobile && (
          <Typography p={2} variant="h5">
            Payment Histories
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
                {chargeslip &&
                  chargeslip
                    .slice(page * rowperpage, page * rowperpage + rowperpage)
                    .map((r) => (
                      <TableRow hover role="checkbox" key={r.id}>
                        <TableCell>{r.date}</TableCell>
                        <TableCell>{r.total.toFixed(2)}</TableCell>
                        <TableCell>
                          {r.clientdeposit.deposit.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {(r.total - r.clientdeposit.deposit).toFixed(2) > 0
                            ? (r.total - r.clientdeposit.deposit).toFixed(2)
                            : 0}
                        </TableCell>
                        <TableCell>{r.type}</TableCell>
                        <TableCell>{r.amount.toFixed(2)}</TableCell>
                        <TableCell>{r.change.toFixed(2)}</TableCell>
                        <TableCell>
                          {r.clientdeposit.balance.toFixed(2)}
                        </TableCell>
                        <TableCell>{r.clientdeposit.status}</TableCell>
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
                    Payments History
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
                  {chargeslip &&
                    chargeslip
                      .slice(page * rowperpage, page * rowperpage + rowperpage)
                      .map((r) => (
                        <TableRow hover role="checkbox" key={r.id}>
                          <TableCell
                            sx={{
                              fontSize: "15px",
                            }}
                          >
                            <div>
                              <strong>Date:</strong> {r.date}
                            </div>
                            <div>
                              <strong>Total:</strong> {r.total.toFixed(2)}
                            </div>
                            <div>
                              <strong>Deposit:</strong>
                              {r.clientdeposit.deposit.toFixed(2)}
                            </div>
                            <div>
                              <strong>Remaining Charge:</strong>{" "}
                              {(r.total - r.clientdeposit.deposit).toFixed(2) >
                              0
                                ? (r.total - r.clientdeposit.deposit).toFixed(2)
                                : 0}
                            </div>
                            <div>
                              <strong>Type of Payment:</strong> {r.type}
                            </div>
                            <div>
                              <strong>Amount:</strong> {r.amount.toFixed(2)}
                            </div>
                            <div>
                              <strong>Change:</strong> {r.change.toFixed(2)}
                            </div>
                            <div>
                              <strong>Balance:</strong>{" "}
                              {r.clientdeposit.balance.toFixed(2)}
                            </div>
                            <div>
                              <strong>Status:</strong> {r.clientdeposit.status}
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
          count={chargeslip.length}
          component="div"
          onPageChange={handlechangepage}
          onRowsPerPageChange={handleRowsPerPage}
        ></TablePagination>
      </Box>
    </>
  );
}
