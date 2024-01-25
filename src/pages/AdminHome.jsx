import React, { useState, useEffect } from "react";
import QrCodeScanner from "../components/QrCodeScanner";
import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import { Close, Money, Paid, People } from "@mui/icons-material";
import TotalGraph from "../components/TotalGraph";
import axiosClient from "../axios-client";
import AppointmentsToday from "./AppointmentsToday";
import { HomeSearchBar } from "../components/HomeSearchBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStateContext } from "../contexts/ContextProvider";

export default function AdminHome() {
  const { user } = useStateContext();

  const [petowners, setPetowners] = useState([]);
  const [pets, setPets] = useState([]);
  const [income, setIncome] = useState([]);
  const [message, setMessage] = useState("");

  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchwhat, setSearchwhat] = useState("");
  const [navigatetype, setNavigatetype] = useState("");

  const search = (query) => {
    setMessage(null);
    if (query) {
      setMessage(null);
      setData([]);
      setLoading(true);
      axiosClient
        .get(`/search/petowners-pets/${query}`)
        .then(({ data }) => {
          setLoading(false);
          setData(data.petOwners);

          if (data.petOwners && data.petOwners.length > 0) {
            setData(data.petOwners);
            setSearchwhat("petowners");
            setNavigatetype("/admin/petowners");
          }
          if (data.pets && data.pets.length > 0) {
            setData(data.pets);
            setSearchwhat("pets");
            setNavigatetype("/admin/pets");
          }
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

  const getAllTotal = () => {
    setMessage(null);
    axiosClient
      .get(`/counts`)
      .then(({ data }) => {
        setPetowners(data.petowners);
        setPets(data.pets);
        setIncome(data.income.toFixed(2));
      })
      .catch((mes) => {
        const response = mes.response;
        if (response && response.status == 404) {
          setMessage(response.data.message);
        }
      });
  };

  const [openscan, setOpenscan] = useState(false);

  useEffect(() => {
    getAllTotal();
  }, []);

  return (
    <>
      <Paper sx={{ padding: "15px", margin: "10px", height: "100%" }}>
        <ToastContainer />
        <Typography variant="h5" mb={1}>
          Home
        </Typography>
        <Stack flexDirection={"row"}>
          <Stack
            flexDirection={"column"}
            sx={{ width: "710px", height: "100px", alignItems: "center" }}
          >
            <Stack flexDirection={"row"}>
              <TotalGraph
                total={pets}
                totaltype="Pets"
                color={"#1769aa"}
                link={"/admin/pets"}
                width="200px"
              />
              <TotalGraph
                total={petowners}
                totaltype="Petowners"
                color={"#357a38"}
                icon={People}
                link={"/admin/petowners"}
                width="200px"
              />
              <TotalGraph
                total={income}
                totaltype="Daily Income"
                color={"#ffc107"}
                icon={Paid}
                link={"/admin/paymentrecords"}
                width="250px"
              />
            </Stack>
            <Stack width={"710px"}>
              <AppointmentsToday />
            </Stack>
          </Stack>
          <Stack flexDirection={"column"} height={"480px"}>
            <HomeSearchBar
              placeholder={"Search petowners, pets here..."}
              searchwhat={searchwhat}
              navigatetype={navigatetype}
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
            <Box
              sx={{
                mt: 4,
                width: "320px",
                height: "320px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: "1px black solid",
              }}
            >
              {openscan ? (
                <>
                  <QrCodeScanner />
                </>
              ) : (
                <>
                  <Button onClick={() => setOpenscan(true)} variant="contained">
                    scan qr code
                  </Button>
                </>
              )}
            </Box>
          </Stack>
        </Stack>
      </Paper>
    </>
  );
}
