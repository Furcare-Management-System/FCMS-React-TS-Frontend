import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Add, Archive, Close, Delete, Edit } from "@mui/icons-material";
import { format } from "date-fns";

export default function PaymentModal(props) {
  const {
    open,
    onClose,
    onClick,
    onSubmit,
    loading,
    payment,
    setPayment,
    clientservice,
    errors,
    calculateBalance,
  } = props;

  const handleFieldChange = (fieldName, value) => {
    const updatedPayment = { ...payment, [fieldName]: value };
    setPayment(updatedPayment);
  };

  const calculateChange = () => {
    const totalCost = payment.total || 0;
    const balance = clientservice.balance || 0;
    const deposit = clientservice.deposit || 0;
    const amount = payment.amount || 0;
    const discount = payment.discount || 0;

    // Check for invalid inputs
    if (
      isNaN(deposit) ||
      isNaN(balance) ||
      isNaN(amount) ||
      isNaN(discount) ||
      deposit === undefined ||
      balance === undefined ||
      amount === undefined ||
      discount === undefined
    ) {
      return 0;
    }

    if (totalCost !== 0) {
      // Calculate change
      const change = amount - (totalCost + balance - deposit - discount);
      // Ensure change is non-negative
      const actualChange = Math.max(change, 0);
      // Update payment change
      payment.change = actualChange;
      return actualChange.toLocaleString();
    } else {
      return 0;
    }
  };

  useEffect(() => {
    calculateChange();
  }, []);

  const [date, setDate] = useState(new Date());
  const dateToday = format(date, "MMMM d, yyyy h:mm a");

  const [isHovered, setIsHovered] = useState(false);

  const calculatePaymentValue = (
    paymentTotal,
    paymentDiscount,
    clientDeposit
  ) => {
    if (
      isNaN(paymentTotal) ||
      isNaN(paymentDiscount) ||
      isNaN(clientDeposit) ||
      paymentTotal === undefined ||
      paymentDiscount === undefined ||
      clientDeposit === undefined
    ) {
      return (paymentDiscount = 0);
    }

    if (paymentDiscount === null) {
      return paymentTotal;
    }

    const value = paymentTotal - paymentDiscount - clientDeposit;
    const formattedValue = Math.max(value, 0).toLocaleString();
    return formattedValue;
  };

  return (
    <>
      <>
        {/* <Backdrop open={loading} style={{ zIndex: 999 }}>
          <CircularProgress color="inherit" />
        </Backdrop> */}

        {!loading && (
          <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography variant="h5"> Payment Details</Typography>
              <IconButton onClick={onClick} style={{ float: "right" }}>
                <Close color="primary"></Close>
              </IconButton>
            </DialogTitle>
            <DialogContent>
              {errors && (
                <Box>
                  {Object.keys(errors).map((key) => (
                    <Alert severity="error" key={key}>
                      {errors[key][0]}
                    </Alert>
                  ))}
                </Box>
              )}
              <form onSubmit={(e) => onSubmit(e)}>
                <Stack spacing={2} margin={1}>
                  <TextField
                    variant="outlined"
                    id="Date and Time"
                    label="Date and Time"
                    value={dateToday}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      readOnly: true,
                      "aria-readonly": true,
                    }}
                    size="small"
                    required
                  />
                  <TextField
                    variant="outlined"
                    id="Referrence No."
                    label="Referrence No."
                    value={payment.chargeslip_ref_no || ``}
                    onChange={(ev) =>
                      handleFieldChange("chargeslip_ref_no", ev.target.value)
                    }
                    required
                    size="small"
                    type="number"
                    inputProps={{ min: "1" }}
                  />
                  <Divider />
                  <TextField
                    variant="filled"
                    id="Total"
                    label="Total"
                    value={payment.total.toLocaleString() || ``}
                    onChange={(ev) =>
                      handleFieldChange("total", ev.target.value)
                    }
                    required
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">₱</InputAdornment>
                      ),
                    }}
                    size="small"
                    disabled={isHovered}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  />
                  <TextField
                    variant="outlined"
                    id="Deposit"
                    label="Deposit"
                    value={
                      payment.total === 0
                        ? 0
                        : clientservice.deposit.toLocaleString()
                    }
                    required
                    InputProps={{
                      readOnly: true,
                      "aria-readonly": true,
                      startAdornment: (
                        <InputAdornment position="start">₱</InputAdornment>
                      ),
                    }}
                    disabled={isHovered}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    size="small"
                  />
                  <TextField
                    label="Discount"
                    variant="outlined"
                    id="Discount"
                    value={
                      typeof payment.discount === "number"
                        ? payment.discount.toLocaleString()
                        : ""
                    }
                    onChange={(ev) => {
                      const value = parseFloat(
                        ev.target.value.replace(/,/g, "")
                      );
                      handleFieldChange("discount", isNaN(value) ? 0 : value);
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₱</InputAdornment>
                      ),
                    }}
                    required
                    size="small"
                    inputProps={{ min: "0" }}
                  />
                  <TextField
                    variant="outlined"
                    id="Remaining Charge"
                    label="Remaining Charge"
                    value={calculatePaymentValue(
                      payment.total,
                      payment.discount,
                      clientservice.deposit
                    )}
                    required
                    InputProps={{
                      readOnly: true,
                      "aria-readonly": true,
                      startAdornment: (
                        <InputAdornment position="start">₱</InputAdornment>
                      ),
                    }}
                    size="small"
                    disabled={isHovered}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  />
                  <Divider />

                  <FormControl>
                    <InputLabel>Type of Payment</InputLabel>
                    <Select
                      label="Type of Payment"
                      value={payment.type || ""}
                      onChange={(ev) =>
                        handleFieldChange("type", ev.target.value)
                      }
                      required
                      size="small"
                    >
                      <MenuItem value="Cash">Cash</MenuItem>
                      <MenuItem value="Gcash">Gcash</MenuItem>
                      <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                    </Select>
                  </FormControl>
                  {payment.type !== "Cash" && (
                    <TextField
                      required
                      label={`${payment.type} Referrence # `}
                      value={payment.type_ref_no || ""}
                      onChange={(ev) =>
                        handleFieldChange("type_ref_no", ev.target.value)
                      }
                      size="small"
                    />
                  )}
                  <TextField
                    label="Amount"
                    variant="outlined"
                    id="Amount"
                    value={
                      typeof payment.amount === "number"
                        ? payment.amount.toLocaleString()
                        : ""
                    }
                    onChange={(ev) => {
                      const value = parseFloat(
                        ev.target.value.replace(/,/g, "")
                      );
                      handleFieldChange("amount", isNaN(value) ? 0 : value);
                    }}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₱</InputAdornment>
                      ),
                    }}
                    size="small"
                    inputProps={{ min: "0" }}
                  />
                  <TextField
                    label="Change"
                    variant="outlined"
                    id="Change"
                    value={calculateChange()}
                    InputProps={{
                      readOnly: true,
                      "aria-readonly": true,
                      startAdornment: (
                        <InputAdornment position="start">₱</InputAdornment>
                      ),
                    }}
                    required
                    size="small"
                    disabled={isHovered}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  />
                  <TextField
                    variant="outlined"
                    id="Balance"
                    label="Balance"
                    value={calculateBalance()}
                    onChange={(ev) =>
                      handleFieldChange("balance", ev.target.value)
                    }
                    required
                    InputProps={{
                      readOnly: true,
                      "aria-readonly": true,
                      startAdornment: (
                        <InputAdornment position="start">₱</InputAdornment>
                      ),
                    }}
                    size="small"
                    disabled={isHovered}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  />
                  <Button color="success" variant="contained" type="submit">
                    Pay
                  </Button>
                </Stack>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </>
    </>
  );
}
