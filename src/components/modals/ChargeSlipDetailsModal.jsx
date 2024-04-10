import React from "react";
import {
  Button,
  Backdrop,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  TableBody,
  TableCell,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  DialogActions,
} from "@mui/material";
import { Close, Print } from "@mui/icons-material";

export default function ChargeSlipDetailsModal(props) {
  const {
    open,
    onClose,
    servicesavailed,
    loading,
    printPDF,
    message,
    payment,
    clientservice,
  } = props;

  const columns = [
    { id: "Pet", name: "Pet" },
    { id: "Service", name: "Service" },
    { id: "Quantity", name: "Quantity" },
    { id: "Unit", name: "Unit" },
    { id: "Unit Price", name: "Unit Price" },
    { id: "Total", name: "Total" },
  ];

  return (
    <>
      <Backdrop open={loading} style={{ zIndex: 999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {!loading && (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
          <DialogTitle>
            Charge Slip
            <IconButton onClick={onClose} style={{ float: "right" }}>
              <Close color="primary"></Close>
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <TableContainer sx={{ height: 380 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell key={column.id}>{column.name}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                {message && (
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
                <TableBody>
                  {servicesavailed.map((item) => (
                    <TableRow hover role="checkbox" key={item.id}>
                      <TableCell>{item.pet.name} </TableCell>
                      <TableCell>{item.service.service}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("en-PH", {
                          style: "currency",
                          currency: "PHP",
                        }).format(item.unit_price ? item.unit_price : 0)}
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("en-PH", {
                          style: "currency",
                          currency: "PHP",
                        }).format(
                          item.unit_price * item.quantity
                            ? item.unit_price * item.quantity
                            : 0
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {!message && clientservice.status !== "To Pay" && (
                    <>
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          align="right"
                          sx={{ fontWeight: "bold" }}
                        >
                          Total:
                        </TableCell>
                        <TableCell>
                          {new Intl.NumberFormat("en-PH", {
                            style: "currency",
                            currency: "PHP",
                          }).format(payment.total)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          align="right"
                          sx={{ fontWeight: "bold" }}
                        >
                          Deposit:
                        </TableCell>
                        <TableCell>
                          {new Intl.NumberFormat("en-PH", {
                            style: "currency",
                            currency: "PHP",
                          }).format(clientservice.deposit)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          align="right"
                          sx={{ fontWeight: "bold" }}
                        >
                          Remaining Charge:
                        </TableCell>
                        <TableCell>
                          {new Intl.NumberFormat("en-PH", {
                            style: "currency",
                            currency: "PHP",
                          }).format(
                            payment.total < clientservice.deposit
                              ? 0
                              : payment.total - clientservice.deposit
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          align="right"
                          sx={{ fontWeight: "bold" }}
                        >
                          Type of Payment:
                        </TableCell>
                        <TableCell>
                          {payment.type !== "Cash"
                            ? `${payment.type} ${payment.type_ref_no}`
                            : payment.type}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          align="right"
                          sx={{ fontWeight: "bold" }}
                        >
                          Amount:
                        </TableCell>
                        <TableCell>
                          {new Intl.NumberFormat("en-PH", {
                            style: "currency",
                            currency: "PHP",
                          }).format(payment.amount)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          align="right"
                          sx={{ fontWeight: "bold" }}
                        >
                          Change:
                        </TableCell>
                        <TableCell>
                          {new Intl.NumberFormat("en-PH", {
                            style: "currency",
                            currency: "PHP",
                          }).format(payment.change)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          align="right"
                          sx={{ fontWeight: "bold" }}
                        >
                          Amounts Payable:
                        </TableCell>
                        <TableCell>
                          {new Intl.NumberFormat("en-PH", {
                            style: "currency",
                            currency: "PHP",
                          }).format(clientservice.balance)}
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
