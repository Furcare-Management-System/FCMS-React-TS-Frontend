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
                        {parseFloat(item.unit_price).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {parseFloat(item.quantity * item.unit_price).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                 {!message && <> <TableRow>
                    <TableCell
                      colSpan={5}
                      align="right"
                      sx={{ fontWeight: "bold" }}
                    >
                      Total:
                    </TableCell>
                    <TableCell>{payment.total}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      align="right"
                      sx={{ fontWeight: "bold" }}
                    >
                      Deposit:
                    </TableCell>
                    <TableCell>{clientservice.deposit}</TableCell>
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
                      {" "}
                      {payment.total < clientservice.deposit
                        ? 0
                        : payment.total - clientservice.deposit}
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
                    <TableCell>{payment.amount}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      align="right"
                      sx={{ fontWeight: "bold" }}
                    >
                      Change:
                    </TableCell>
                    <TableCell>{payment.change}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      align="right"
                      sx={{ fontWeight: "bold" }}
                    >
                      Balance:
                    </TableCell>
                    <TableCell>{clientservice.balance}</TableCell>
                  </TableRow>
                  </>
                  }
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
