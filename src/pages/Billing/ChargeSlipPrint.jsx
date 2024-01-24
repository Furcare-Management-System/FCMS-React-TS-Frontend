import React, { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
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
import { Add, Close, Refresh, Remove } from "@mui/icons-material";
import ReactToPrint from "react-to-print";
import { useRef } from "react";

const ChargeSlipPrint = React.forwardRef((props, ref) => {
  const { id } = useParams();
  //for table
  const columns = [
    { id: "Pet", name: "Pet" },
    { id: "Service", name: "Service" },
    { id: "Quantity", name: "Quantity" },
    { id: "Unit", name: "Unit" },
    { id: "Unit Price", name: "Unit Price" },
  ];

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());

  const [servicesavailedpaid, setServicesavailedpaid] = useState([]);
  const [petowner, setPetowner] = useState([]);
  const [clientservice, setClientservice] = useState([]);

  const getServicesAvailedChargeSlip = () => {
    setMessage(null);
    setLoading(true);
    axiosClient
      .get(`/servicesavailed/petowner/${id}/completed`)
      .then(({ data }) => {
        setLoading(false);
        setServicesavailedpaid(data.data);
      })
      .catch((mes) => {
        const response = mes.response;
        if (response && response.status == 404) {
          setMessage(response.data.message);
        }
        setLoading(false);
      });
  };

  const getClientService = () => {
    setMessage(null);
    axiosClient
      .get(`/clientdeposits/petowner/${id}`)
      .then(({ data }) => {
        setClientservice(data);
        setPetowner(data.petowner);
      })
      .catch((mes) => {
        const response = mes.response;
        if (response && response.status == 404) {
          setMessage(response.data.message);
        }
      });
  };

  // Group services by pet
  const groupServicesByPet = () => {
    const groupedServices = {};
    servicesavailedpaid.forEach((item) => {
      const petId = item.pet.id;
      if (groupedServices.hasOwnProperty(petId)) {
        groupedServices[petId].push(item);
      } else {
        groupedServices[petId] = [item];
      }
    });
    return groupedServices;
  };

  const servicesGroupedByPet = groupServicesByPet();

  // Calculate the total for all selected items
  const calculateTotal = () => {
    return servicesavailedpaid.reduce((total, item) => {
      return total + parseFloat(item.unit_price);
    }, 0);
  };

  useEffect(() => {
    getClientService();
    getServicesAvailedChargeSlip();
  }, []);

  return (
    <div ref={ref}>
      <div
        style={{
          width: "370px",
        }}
      >
        <h2 align="center">Charge Slip </h2>{" "}
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <span>
            Client: {petowner.firstname} {petowner.lastname}
          </span>
          <span>Date: {date.toDateString()} </span>
        </Box>
        <table style={{ borderCollapse: "collapse"}}>
          <thead >
            <tr>
              {columns.map((column) => (
                <td style={{ padding:"5px" }} key={column.id}>{column.name}</td>
              ))}
            </tr>
          </thead>
          {loading && (
            <TableBody>
              <TableRow>
                <TableCell colSpan={6} style={{ textAlign: "center" }}>
                  Loading...
                </TableCell>
              </TableRow>
            </TableBody>
          )}
          {!loading && message && (
            <TableBody>
              <TableRow>
                <TableCell colSpan={6} style={{ textAlign: "center" }}>
                  {message}
                </TableCell>
              </TableRow>
            </TableBody>
          )}
          {!loading && (
            <tbody>
              {/* {Object.keys(servicesGroupedByPet).map((petId) => (
                  <React.Fragment key={petId}>
                    <tr >
                      <TableCell colSpan={5}>
                        <Typography variant="subtitle1">
                          {servicesGroupedByPet[petId][0].pet.name}
                        </Typography>
                      </TableCell>
                    </tr> */}
              {servicesavailedpaid.map((item) => (
                <tr key={item.id}>
                  <td style={{ padding:"5px" }}>{item.pet.name} </td>
                  <td style={{ padding:"5px" }}>{item.service.service}</td>
                  <td style={{ padding:"5px" }}>{item.quantity}</td>
                  <td style={{ padding:"5px" }}>{item.unit}</td>
                  <td style={{ padding:"5px" }}>{item.unit_price}</td>
                </tr>
              ))}
              {/* </React.Fragment> */}
              {/* ))} */}
              <tr>
                <td colSpan={4} align="right">
                  Total:
                </td>
                <td>{calculateTotal()}</td>
              </tr>
              <tr>
                <td colSpan={4} align="right">
                  Deposit:
                </td>
                <td>{clientservice.deposit}</td>
              </tr>
              <tr>
                <td colSpan={4} align="right">
                  Balance:
                </td>
                <td sx={{ width: "30%" }}>
                  {clientservice.balance}
                </td>
              </tr>
              <tr>
                <td colSpan={4} align="right">
                  Cash:
                </td>
              </tr>
              <tr>
                <td colSpan={4} align="right">
                  Change:
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
});

const PrintComponent = () => {
  const componentRef = useRef();
  const pageStyle = `{ size: 2in 4in }`;

  return (
    <>
      <div>
        {/* button to trigger printing of target component */}
        <ReactToPrint
          pageStyle={pageStyle}
          trigger={() => <Button variant="contained">print</Button>}
          content={() => componentRef.current} // Use componentRef.current here
        />

        {/* component to be printed */}
        <ChargeSlipPrint ref={componentRef} />
      </div>
    </>
  );
};

export default PrintComponent;
