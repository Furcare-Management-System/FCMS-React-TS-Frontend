import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { Add, Archive, Close, Delete, Edit } from "@mui/icons-material";
import { format } from "date-fns";

export default function BalancePaymentModal(props) {
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
  } = props;

  const handleFieldChange = (fieldName, value) => {
    const updatedPayment = { ...payment, [fieldName]: value };
    setPayment(updatedPayment);
  };

  const calculateChange = () => {
    const balance = clientservice.balance || 0;
    const amount = payment.amount || 0;

    if (
      isNaN(balance) ||
      isNaN(amount) ||
      balance === undefined ||
      amount === undefined
    ) {
      return 0;
    }

    const change = amount - balance;
    payment.change = change >= 0 ? change : 0;
    return change >= 0 ? change : 0;
  };

  const [date, setDate] = useState(new Date());
  const dateToday = format(date, "MMMM d, yyyy h:mm a");


  useEffect(() => {
    calculateChange();
  }, []);

  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <>
        {/* <Backdrop open={loading} style={{ zIndex: 999 }}>
          <CircularProgress color="inherit" />
        </Backdrop> */}

        {!loading && (
          <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>
              Payment Details
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
                  />
               <TextField
                    variant="outlined"
                    id="Balance"
                    label="Balance"
                    value={clientservice.balance}
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
                    value={payment.amount || ""}
                    onChange={(ev) =>
                      handleFieldChange("amount", ev.target.value)
                    }
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₱</InputAdornment>
                      ),
                    }}
                    size="small"
                    type="number"
                    inputProps={{ min: "1" }}
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
