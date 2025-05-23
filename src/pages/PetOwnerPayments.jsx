import React, { useEffect, useState } from "react";
import {
  Alert,
  Backdrop,
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import axiosClient from "../axios-client";
import ChargeSlipDetailsModal from "../components/modals/ChargeSlipDetailsModal";
import Swal from "sweetalert2";
import AdmissionModal from "../components/modals/AdmissionModal";
import BalancePaymentModal from "../components/modals/BalancePaymentModal";
import { format } from "date-fns";

export default function PetOwnerPayments() {
  //for table
  const columns = [
    { id: "Date and Time", name: "Date and Time" },
    { id: "Deposit", name: "Deposit" },
    { id: "Balance", name: "Balance" },
    { id: "Status", name: "Status" },
    { id: "Actions", name: "Actions" },
  ];
  const [page, pagechange] = useState(0);
  const [rowperpage, rowperpagechange] = useState(10);

  const { id } = useParams();
  const [chargeslip, setChargeSlip] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [modalloading, setModalloading] = useState(false);
  const [servicesavailed, setServicesavailed] = useState([]);
  const [petowner, setPetowner] = useState([]);
  const [payment, setPayment] = useState([]);
  const [openmodal, setOpenmodal] = useState(false);
  const [noservices, setNoservices] = useState("");
  const [errors, setErrors] = useState(null);

  const [clientservice, setClientservice] = useState({
    id: null,
    date: null,
    deposit: null,
    balance: null,
    rendered_by: "",
    status: "",
  });

  const getPayments = () => {
    setMessage("");
    setLoading(true);
    axiosClient
      .get(`/clientdeposits/petowner/${id}/all`)
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

  const getServicesAvailed = (r) => {
    setMessage(null);
    setModalloading(true);
    setServicesavailed([]);
    setOpenmodal(true);
    setNoservices("");
    getPaymentRecord(r);
    axiosClient
      .get(`/clientdeposits/${r.id}/services`)
      .then(({ data }) => {
        setServicesavailed(data.data);
        setClientservice(data.clientservice);
        setPetowner(data.clientservice.petowner);
        setModalloading(false);
      })
      .catch((mes) => {
        const response = mes.response;
        if (response && response.status == 404) {
          setNoservices(response.data.message);
        }
        setModalloading(false);
      });
  };

  const getPaymentRecord = (r) => {
    setPayment([]);
    axiosClient
      .get(`/paymentrecords/clientdeposits/${r.id}`)
      .then(({ data }) => {
        setPayment(data);
      })
      .catch((mes) => {
        const response = mes.response;
        if (response && response.status == 404) {
          setNoservices(response.data.message);
        }
      });
  };

  const [openconsent, setOpenconsent] = useState(false);

  const openEdit = (r) => {
    setOpenconsent(true);
    setModalloading(true);
    setNoservices("");
    axiosClient
      .get(`/clientdeposits/${r.id}`)
      .then(({ data }) => {
        setModalloading(false);
        setPetowner(data.petowner);
        setClientservice(data);
      })
      .catch((mes) => {
        const response = mes.response;
        if (response && response.status == 404) {
          setNoservices(response.data.message);
        }
        setModalloading(false);
      });
  };

  const editDeposit = (ev) => {
    ev.preventDefault();

    axiosClient
      .put(`/clientdeposits/${clientservice.id}/updatedeposit`, clientservice)
      .then(() => {
        setOpenconsent(false);
        Swal.fire({
          text: "Client deposit updated.",
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            getPayments();
            setClientservice({});
          }
        });
      })
      .catch((err) => {
        setOpenconsent(false);
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      });
  };

  const closeModal = () => {
    setOpenmodal(false);
    setOpenconsent(false);
    setOpenpayment(false);
  };
  const [openpayment, setOpenpayment] = useState(false);
  const [paymentrecord, setPaymentRecord] = useState({
    id: null,
    chargeslip_ref_no: "",
    type: "Cash",
    type_ref_no: "",
    total: null,
    amount: null,
    change: 0,
    amounts_payable: null,
  });

  const calculateTotal = () => {
    const totalCost = servicesavailed.reduce((total, item) => {
      const price = item.unit_price || 0;
      return total + price * item.quantity;
    }, 0);

    paymentrecord.total = totalCost.toFixed(2);

    return totalCost;
  };

  const calculateBalance = () => {
    // const totalCost = paymentrecord.total || 0;
    const balance = clientservice.balance || 0;
    // const deposit = clientservice.deposit || 0;
    const amount = paymentrecord.amount || 0;
    // const currentbalance = totalCost + balance - deposit;

    const final = balance - amount;
    if (final < 0) {
      return 0;
    }

    payment.amounts_payable = final;

    return final;
  };

  const toPay = (r) => {
    setOpenpayment(true);
    setClientservice(r);
    setPetowner(r.petowner);
  };

  const [backdrop, setBackdrop] = useState(false);

  const payBalance = async (ev) => {
    ev.preventDefault();
    setOpenpayment(false);
    setBackdrop(true);
    setPaymentRecord({ type: "Cash" });

    try {
      if (clientservice.status === "Pending") {
        const updatedClientService = {
          ...clientservice,
          balance: calculateBalance() || 0,
          ...paymentrecord,
          amounts_payable: calculateBalance(),
        };
        await axiosClient
          .put(`/clientdeposits/${clientservice.id}`, updatedClientService)
          .then((response) => {
            setClientservice(response.data);
            console.log(response.data);
          });
      }

      setBackdrop(false);

      Swal.fire({
        title: "Success",
        icon: "success",
        confirmButtonText: "GENERATE CHARGE SLIP",
        confirmButtonColor: "black",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          windowOpenPDFforPrint();
        }
        getPayments();
      });
    } catch (err) {
      setBackdrop(false);

      Swal.fire({
        title: "Error",
        text: "An error occurred. Please try again.",
        icon: "error",
      });
    }
  };

  const windowOpenPDFforPrint = async () => {
    try {
      // Fetch PDF content
      const response = await axiosClient.get(
        `/clientdeposits/${clientservice.id}/generate-chargeslip`,
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
        `ChargeSlip-${
          clientservice.date
        }-${`${petowner.firstname}_${petowner.lastname}`}-.pdf`
      );
      document.body.appendChild(link);

      // Trigger the download
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert("Error fetching PDF:", error);
    }
  };

  useEffect(() => {
    getPayments();
  }, []);

  return (
    <>
      <Paper
        sx={{
          padding: "10px",
        }}
        elevation={4}
      >
        <Backdrop open={backdrop} style={{ zIndex: 999 }}></Backdrop>

        <ChargeSlipDetailsModal
          open={openmodal}
          onClose={closeModal}
          petowner={petowner}
          clientservice={clientservice}
          servicesavailed={servicesavailed}
          calculateTotal={calculateTotal().toFixed(2)}
          loading={modalloading}
          printPDF={windowOpenPDFforPrint}
          message={noservices}
          payment={payment}
        />

        <AdmissionModal
          open={openconsent}
          onClose={closeModal}
          onSubmit={editDeposit}
          petowner={petowner}
          clientservice={clientservice}
          setClientservice={setClientservice}
          // errors={errors}
          loading={modalloading}
          isUpdate={true}
        />

        <BalancePaymentModal
          open={openpayment}
          onClose={closeModal}
          onClick={closeModal}
          onSubmit={payBalance}
          loading={loading}
          payment={paymentrecord}
          setPayment={setPaymentRecord}
          clientservice={clientservice}
          // pastbalance={pastbalance}
          calculateBalance={calculateBalance}
          //  errors={errors}
        />

        <Divider />
        <TableContainer sx={{ height: 450 }}>
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
                        <TableCell>
                          {format(new Date(r.date), "MMMM d, yyyy h:mm a")}
                        </TableCell>
                        <TableCell>{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(r.deposit)}</TableCell>
                        <TableCell>{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(r.balance)}</TableCell>
                        <TableCell>{r.status}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={2}>
                            <Button
                              variant="contained"
                              size="small"
                              color="info"
                              onClick={() => getServicesAvailed(r)}
                            >
                              details
                            </Button>
                            {r.status === "To Pay" && (
                              <Button
                                variant="contained"
                                size="small"
                                color="success"
                                onClick={() => openEdit(r)}
                              >
                                EDIT{" "}
                              </Button>
                            )}
                            {r.status === "Pending" && (
                              <Button
                                variant="contained"
                                size="small"
                                color="success"
                                onClick={() => toPay(r)}
                              >
                                Pay balance
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
          sx={{ marginBottom: "-20px" }}
          rowsPerPageOptions={[10, 15, 25]}
          rowsPerPage={rowperpage}
          page={page}
          count={chargeslip.length}
          component="div"
          onPageChange={handlechangepage}
          onRowsPerPageChange={handleRowsPerPage}
        ></TablePagination>
      </Paper>
    </>
  );
}
