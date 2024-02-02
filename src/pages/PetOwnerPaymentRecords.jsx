import {
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
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { format } from "date-fns";
import { useParams } from "react-router-dom";

export default function PetOwnerPaymentRecords() {
  //for table
  const columns = [
    { id: "Date", name: "Date" },
    { id: "Ref #", name: "Ref #" },
    { id: "Type", name: "Type" },
    { id: "Total", name: "Total" },
    { id: "Deposit", name: "Deposit" },
    { id: "Remaining Charge", name: "Remaining Charge" },
    { id: "Amount", name: "Amount" },
    { id: "Change", name: "Change" },
    { id: "Amounts Payable", name: "Amounts Payable" },
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

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const { id } = useParams();

  const getPayments = () => {
    setMessage(null);
    setPayments([]);
    setLoading(true);
    axiosClient
      .get(`/paymentrecords/petowner/${id}`)
      .then(({ data }) => {
        setLoading(false);
        setPayments(data.data);
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
    getPayments();
  }, []);

  return (
    <>
      <Box
      >
        <TableContainer sx={{ height: "!00%" }}>
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
                {payments &&
                  payments
                    .slice(page * rowperpage, page * rowperpage + rowperpage)
                    .map((r) => (
                      <TableRow hover role="checkbox" key={r.id}>
                        <TableCell>
                          {format(new Date(r.date), "MMMM d, yyyy h:mm a")}
                        </TableCell>
                        <TableCell>{r.chargeslip_ref_no}</TableCell>
                        <TableCell>
                          {r.type === "Cash"
                            ? `${r.type}`
                            : `${r.type} ${r.type_ref_no}`}
                        </TableCell>
                        <TableCell>{r.total.toFixed(2)}</TableCell>
                        <TableCell>{r.clientdeposit.deposit.toFixed(2)}</TableCell>
                        <TableCell> {r.total < r.clientdeposit.deposit
                            ? 0
                            : r.total - r.clientdeposit.deposit}</TableCell>
                        <TableCell>{r.amount.toFixed(2)}</TableCell>
                        <TableCell>{r.change.toFixed(2)}</TableCell>
                        <TableCell>{r.amounts_payable.toFixed(2)}</TableCell>
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
          count={payments.length}
          component="div"
          onPageChange={handlechangepage}
          onRowsPerPageChange={handleRowsPerPage}
        ></TablePagination>
      </Box>
    </>
  );
}
