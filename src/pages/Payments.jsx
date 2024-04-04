import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
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
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { format } from "date-fns";
import { Close } from "@mui/icons-material";

export default function Payments() {
  //for table
  const columns = [
    { id: "id", name: "ID" },
    { id: "Date and Time", name: "Date and Time" },
    { id: "Client", name: "Client" },
    { id: "Ref #", name: "Ref #" },
    { id: "Type", name: "Type" },
    { id: "Total", name: "Total" },
    { id: "Amount", name: "Amount" },
    { id: "Change", name: "Change" },
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
  const [printing, setPrinting] = useState(false);
  const [message, setMessage] = useState(null);

  const getPayments = () => {
    setMessage(null);
    setPayments([]);
    setLoading(true);
    setFilterdate(null);
    setBtnclicked(false);
    axiosClient
      .get("/paymentrecords")
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
  const [date, setDate] = useState(new Date());

  const paymentsPDF = async () => {
    setPrinting(true);
    setMessage(null);
    try {
      // Fetch PDF content
      const response = await axiosClient.get(
        `/paymentrecords/date/${filterdate}`,
        {
          responseType: "blob",
          headers: {
            "Content-Type": "application/pdf",
          },
        }
      );

      const pdfBlob = response.data;

      const url = window.URL.createObjectURL(new Blob([pdfBlob]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Summary-ChargeSlipRecords-${format(
          new Date(filterdate),
          "MMMM d, yyyy"
        )}.pdf`
      );
      document.body.appendChild(link);

      // Trigger the download
      link.click();
      document.body.removeChild(link);
      setPrinting(false);
    } catch (error) {
      setPrinting(false);
      alert("Error fetching PDF:", error);
    }
  };

  //filter by date
  const [filterdate, setFilterdate] = useState(null);
  const [btnclicked, setBtnclicked] = useState(false);

  const filter = () => {
    setPayments([]);
    setMessage(null);
    setLoading(true);
    axiosClient
      .get(`/paymentrecords/filter-date/${filterdate}`)
      .then(({ data }) => {
        setLoading(false);
        setPayments(data.data);
        setBtnclicked(true);
      })
      .catch((mes) => {
        setBtnclicked(false);
        const response = mes.response;
        if (response && response.status == 404) {
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
      <Backdrop open={printing} style={{ zIndex: 999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Paper
        sx={{
          padding: "10px",
          margin: "5px",
        }}
        elevation={4}
      >
        <Box
          alignItems={"center"}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Typography variant="h5">Payment Records</Typography>
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
              inputProps={{
                max: new Date().toISOString().split("T")[0],
              }}
              required
            />
            {filterdate && (
              <IconButton variant="outlined" onClick={getPayments}>
                <Close />
              </IconButton>
            )}
            <Button
              variant="contained"
              size="small"
              sx={{ mr: 1, ml: 1 }}
              onClick={filter}
              disabled={filterdate === null}
            >
              <Typography fontSize={"12px"}>Filter</Typography>
            </Button>
            <Button
              variant="contained"
              onClick={paymentsPDF}
              color="success"
              sx={{ pl: 2 }}
              disabled={btnclicked === false || message !== null}
            >
              print
            </Button>
          </Box>
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
                        <TableCell>{r.id}</TableCell>
                        <TableCell>
                          {format(new Date(r.date), "MMMM d, yyyy h:mm a")}
                        </TableCell>
                        <TableCell>{`${r.clientdeposit.petowner.firstname} ${r.clientdeposit.petowner.lastname}`}</TableCell>
                        <TableCell>{r.chargeslip_ref_no}</TableCell>
                        <TableCell>
                          {r.type === "Cash"
                            ? `${r.type}`
                            : `${r.type} ${r.type_ref_no}`}
                        </TableCell>
                        <TableCell>{r.total.toFixed(2)}</TableCell>
                        <TableCell>{r.amount.toFixed(2)}</TableCell>
                        <TableCell>{r.change.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
        <TablePagination
          sx={{ marginBottom: "-20px" }}
          rowsPerPageOptions={[50, 100]}
          rowsPerPage={rowperpage}
          page={page}
          count={payments.length}
          component="div"
          onPageChange={handlechangepage}
          onRowsPerPageChange={handleRowsPerPage}
        ></TablePagination>
      </Paper>
    </>
  );
}
