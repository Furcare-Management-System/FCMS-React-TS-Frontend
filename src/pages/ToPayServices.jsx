import React, { useEffect, useState } from "react";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Stack,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import axiosClient from "../axios-client";
import Swal from "sweetalert2";
import PaymentModal from "../components/modals/PaymentModal";
import { format } from "date-fns";
import { Delete, Edit } from "@mui/icons-material";
import EditServiceModal from "../components/modals/EditServiceModal";

export default function ToPayServices() {
  //for table
  const columns = [
    { id: "Date and Time", name: "Date and Time" },
    { id: "Pet", name: "Pet" },
    { id: "Service", name: "Product/Service" },
    { id: "Quantity", name: "Quantity" },
    { id: "Unit", name: "Unit" },
    { id: "Unit Price", name: "Unit Price" },
    { id: "Total", name: "Total" },
    { id: "Actions", name: "Actions" },
  ];
  const [page, pagechange] = useState(0);
  const [rowperpage, rowperpagechange] = useState(10);

  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [servicesavailed, setServicesavailed] = useState([]);
  const [clientservice, setClientservice] = useState([]);
  const [petowner, setPetowner] = useState([]);
  const [meds, setMeds] = useState([]);
  const [pastbalance, setPastbalance] = useState([]);

  const [paymentrecord, setPaymentRecord] = useState({
    id: null,
    chargeslip_ref_no: "",
    type: "Cash",
    type_ref_no: "",
    total: null,
    amount: null,
    change: null,
    amounts_payable: null,
    discount: null,
  });
  const [openpayment, setOpenpayment] = useState(false);
  const [backdrop, setBackdrop] = useState(false);
  const [printing, setPrinting] = useState(false);

  const getServices = () => {
    setServicesavailed([]);
    setMessage("");
    setLoading(true);
    axiosClient
      .get(`/servicesavailed/petowner/${id}/toPay`)
      .then(({ data }) => {
        setLoading(false);
        setServicesavailed(data.data);
        setClientservice(data.clientdeposit);
        setPetowner(data.clientdeposit.petowner);
        setMeds(data.meds);
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

  const calculateTotal = () => {
    const totalCost = servicesavailed.reduce((total, item) => {
      const price = item.unit_price || 0;
      return total + price * item.quantity;
    }, 0);

    paymentrecord.total = totalCost;

    return totalCost;
  };

  const calculateBalance = () => {
    const totalCost = paymentrecord.total || 0;
    const balance = clientservice.balance || 0;
    const deposit = clientservice.deposit || 0;
    const amount = paymentrecord.amount || 0;
    const discount = paymentrecord.discount || 0;
    const currentbalance = totalCost + balance - deposit - discount;

    const final = currentbalance - amount;
    if (final < 0) {
      return 0;
    }

    return final;
  };

  const toPay = () => {
    setPaymentRecord({ type: "Cash" });
    if (servicesavailed.length > 0) {
      setOpenpayment(true);
    } else {
      Swal.fire({
        title: "Error",
        text: "No services availed!",
        icon: "error",
        allowOutsideClick: false,
      });
    }
  };

  const closeModal = () => {
    setOpenpayment(false);
  };

  const windowOpenPDFforPrint = async () => {
    setPrinting(true);
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
      setPrinting(false);
    } catch (error) {
      alert("Error fetching PDF:", error);
      setPrinting(false);
    }
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();

    try {
      // Prevent form submission if there are services availed
      if (servicesavailed.length === 0) {
        ev.preventDefault();
        setBackdrop(false); // Move setBackdrop here so it's not repeated

        Swal.fire({
          title: "Error",
          text: "No services availed!",
          icon: "error",
          confirmButtonColor: "black",
        });

        return; // Exit the function if no services availed
      }

      setBackdrop(true); // Show backdrop when there are services availed
      setOpenpayment(false);

      if (clientservice) {
        const updatedClientService = {
          ...clientservice,
          balance: calculateBalance() || 0,
          ...paymentrecord,
          client_deposit_id: clientservice.id,
          amounts_payable: calculateBalance(),
        };

        await axiosClient.put(
          `/clientdeposits/${clientservice.id}`,
          updatedClientService
        );

        setBackdrop(false);

        Swal.fire({
          title: "Success",
          icon: "success",
          text: "Do you want to generate a charge slip?",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes",
          allowOutsideClick: false,
          showCancelButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            windowOpenPDFforPrint();
            getServices();
          } else {
            getServices();
          }
        });
      }
    } catch (err) {
      setBackdrop(false);

      Swal.fire({
        title: "Error",
        text: "An error occurred. Please try again.",
        icon: "error",
      });
    }
  };

  const [open, setOpen] = useState(false);
  const [openloading, setOpenloading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [service, setService] = useState({
    quantity: null,
    unit: null,
    unit_price: null,
    pet_id:null
  });
  const [pets, setPets] = useState([]);
  const [submitloading, setSubmitloading] = useState(false);
  const [servicename, setServicename] = useState(false);

  const getPets = () => {
    axiosClient
      .get(`/petowners/${id}/pets`)
      .then(({ data }) => {
        setPets(data.data);
      })
      .catch(() => {});
  };

  const onEdit = (r) => {
    setErrors(null);
    setOpen(true);
    setOpenloading(true);
    getPets();

    axiosClient
      .get(`/servicesavailed/${r.id}`)
      .then(({ data }) => {
        setOpenloading(false);
        setService(data);
        setServicename(data.service.service)
      })
      .catch(() => {
        setOpenloading(false);
      });
  };

  const onSubmitEdit = (e) => {
    e.preventDefault();
    setSubmitloading(true);

    if (service.id) {
      axiosClient
        .put(`/servicesavailed/${service.id}/update`, service)
        .then(() => {
          setSubmitloading(false);
          setOpen(false);
          getServices();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
          setSubmitloading(false);
        });
    }
  };

  const closepopup = () => {
    setOpen(false);
  };

  useEffect(() => {
    getServices();
  }, []);

  return (
    <>
      <Backdrop open={printing} style={{ zIndex: 999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Paper
        flex={5}
        sx={{
          padding: "10px",
        }}
        elevation={4}
      >
        <Backdrop open={backdrop} style={{ zIndex: 999 }}></Backdrop>
        <Box display={"flex"} justifyContent={"space-between"} p={1}>
          <Typography variant="h6" fontWeight={"bold"}>
            Total Amount: {calculateTotal().toFixed(2)}
          </Typography>
          {servicesavailed.length !== 0 && (
            <Button
              variant="contained"
              size="small"
              color="success"
              onClick={toPay}
            >
              <Typography variant="body1">Pay</Typography>
            </Button>
          )}
        </Box>

        <EditServiceModal
          open={open}
          onClose={closepopup}
          onClick={closepopup}
          onSubmit={onSubmitEdit}
          loading={openloading}
          pets={pets}
          service={service}
          setService={setService}
          errors={errors}
          isUpdate={service.id}
          submitloading={submitloading}
          servicename={servicename}
        />
        <PaymentModal
          open={openpayment}
          onClose={closeModal}
          onClick={closeModal}
          onSubmit={onSubmit}
          loading={loading}
          payment={paymentrecord}
          setPayment={setPaymentRecord}
          clientservice={clientservice}
          pastbalance={pastbalance}
          calculateBalance={calculateBalance}
        />

        <TableContainer sx={{ height: 410 }}>
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
                        <TableCell>
                          {format(new Date(r.date), "MMMM d, yyyy h:mm a")}
                        </TableCell>
                        <TableCell>{r.pet.name}</TableCell>
                        <TableCell>
                          {meds.map((m) =>
                            r.id === m.services_availed_id ? (
                              <span key={m.id}>{m.medicine_name}</span>
                            ) : null
                          )}
                          {r.service.service !== "Medicine"
                            ? r.service.service
                            : null}
                        </TableCell>

                        <TableCell>{r.quantity}</TableCell>
                        <TableCell>{r.unit}</TableCell>
                        <TableCell>
                            {new Intl.NumberFormat("en-PH", {
                              style: "currency",
                              currency: "PHP",
                            }).format(r.unit_price ? r.unit_price : 0)}
                          </TableCell>
                          <TableCell>
                            {new Intl.NumberFormat("en-PH", {
                              style: "currency",
                              currency: "PHP",
                            }).format(r.unit_price*r.quantity ? r.unit_price*r.quantity : 0)}
                          </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={2}>
                            {r.status === "To Pay" && (
                              <Button
                                variant="contained"
                                size="small"
                                color="info"
                                onClick={() => onEdit(r)}
                              >
                                <Edit fontSize="small" />
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
          count={servicesavailed.length}
          component="div"
          onPageChange={handlechangepage}
          onRowsPerPageChange={handleRowsPerPage}
        ></TablePagination>
      </Paper>
    </>
  );
}
