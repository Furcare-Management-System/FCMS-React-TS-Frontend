import React, { useState, useEffect } from "react";
import QrCodeScanner from "../../components/QrCodeScanner";
import {
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { Add, Close, Money, Paid, People } from "@mui/icons-material";
import TotalGraph from "../../components/TotalGraph";
import axiosClient from "../../axios-client";
import { HomeSearchBar } from "../../components/HomeSearchBar";
import { useStateContext } from "../../contexts/ContextProvider";
import PO_AppointmentsToday from "./PO_AppointmentsToday";
import PO_VaccinationReturn from "./PO_VaccinationReturn";
import "react-toastify/dist/ReactToastify.css";

export default function PetownerHome() {
  const [pets, setPets] = useState([]);
  const [balance, setBalance] = useState([]);
  const [message, setMessage] = useState("");

  const { staffuser, user } = useStateContext();

  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = (query) => {
    setMessage(null);
    if (query) {
      setMessage(null);
      setData([]);
      setLoading(true);
      axiosClient
        .get(`/petowner/${staffuser.id}/pets-search/${query}`)
        .then(({ data }) => {
          setLoading(false);
          setData(data.data);
        })
        .catch((error) => {
          const response = error.response;
          if (response && response.status === 404) {
            setMessage(response.data.message);
          }
          setLoading(false);
        });
    }
  };

  const getPetsTotal = () => {
    setMessage(null);
    axiosClient
      .get(`/petowners/${staffuser.id}/countpets`)
      .then(({ data }) => {
        setPets(data.data);
      })
      .catch((mes) => {
        const response = mes.response;
        if (response && response.status == 404) {
          setMessage(response.data.message);
        }
      });
  };

  const getBalance = () => {
    setMessage(null);
    axiosClient
      .get(`/clientdeposits/${staffuser.id}/balance`)
      .then(({ data }) => {
        setBalance(data.balance.toFixed(2));
      })
      .catch((mes) => {
        const response = mes.response;
        if (response && response.status == 404) {
          setBalance(response.data.message);
        }
      });
  };

  useEffect(() => {
    getPetsTotal();
    getBalance();
  }, []);

  return (
    <>
      <Paper sx={{ padding: "15px", margin: "10px", height: "100%" }}>
        <Typography variant="h5" mb={1}>
          Home
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TotalGraph
              total={pets}
              totaltype="Pets"
              color={"#1769aa"}
              link={"/petowner/pets"}
              width="100%"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TotalGraph
              total={balance}
              totaltype="Pending Balance"
              color={"#ffc107"}
              icon={Paid}
              width="100%"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <HomeSearchBar
              searchwhat={"pets"}
              placeholder={"Search pets here..."}
              navigatetype={"/petowner/pets"}
              query={query}
              setQuery={setQuery}
              data={data}
              setData={setData}
              message={message}
              setMessage={setMessage}
              loading={loading}
              setLoading={setLoading}
              search={search}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <PO_AppointmentsToday />
          </Grid>
          <Grid item xs={12} sm={5} md={6}>
            <PO_VaccinationReturn />
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}
