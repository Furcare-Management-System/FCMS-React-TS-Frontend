import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import {
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { Add, Visibility } from "@mui/icons-material";
import { Link, useParams } from "react-router-dom";
import AdmissionModal from "../components/modals/AdmissionModal";
import TreatmentModal from "../components/modals/TreatmentModal";
import Swal from "sweetalert2";
import { format } from 'date-fns';

export default function Admissions() {
  const { id } = useParams();
  const sid = 20;
  //for table
  const columns = [
    { id: "Date", name: "Date" },
    { id: "Day", name: "Day" },
    { id: "Pet", name: "Pet" },
    { id: "diagnosis", name: "Diagnosis" },
    { id: "Status", name: "Status" },
    { id: "Actions", name: "Actions" },
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

  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [petowner, setPetowner] = useState([]);

  const getAdmissions = () => {
    setMessage("");
    setLoading(true);
    axiosClient
      .get(`/admissions/petowner/${id}/service/${sid}`)
      .then(({ data }) => {
        setLoading(false);
        setAdmissions(data.data);
      })
      .catch((mes) => {
        const response = mes.response;
        if (response && response.status == 404) {
          setMessage(response.data.message);
        }
        setLoading(false);
      });
  };

  const getPetowner = () => {
    setModalloading(true);
    axiosClient
      .get(`/petowners/${id}`)
      .then(({ data }) => {
        setPetowner(data);
        setModalloading(false);
      })
      .catch((mes) => {
        const response = mes.response;
        if (response && response.status == 404) {
          setMessage(response.data.message);
        }
        setModalloading(false);
      });
  };

  //for modal
  const [errors, setErrors] = useState(null);
  const [modalloading, setModalloading] = useState(false);
  const [clientservice, setClientservice] = useState({
    id: null,
    date:null,
    deposit: null,
  });
  const [treatment, setTreatment] = useState({
    id: null,
    day: null,
    pet_id: null,
    diagnosis: "",
    body_weight: "",
    heart_rate: "",
    mucous_membranes: "",
    pr_prealbumin: "",
    temperature: "",
    respiration_rate: "",
    caspillar_refill_time: "",
    body_condition_score: "",
    fluid_rate: "",
    comments: "",
    unit_price: null,
  });
  const [pets, setPets] = useState([]);
  const [openmodal, setOpenmodal] = useState(false);
  const [openconsent, setOpenconsent] = useState(false);

  const getPetownerPets = () => {
    axiosClient
      .get(`/petowners/${id}/pets`)
      .then(({ data }) => {
        setPets(data.data);
      })
      .catch(() => {});
  };

  const addModal = () => {
    getPetownerPets();
    setClientservice({});
    setTreatment({});
    setErrors(null);
    setOpenmodal(true);
  };

  const addConsent = () => {
    getPetowner();
    setClientservice({});
    setErrors(null);
    setOpenconsent(true);
  };

  const closeModal = () => {
    setOpenmodal(false);
    setOpenconsent(false);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    axiosClient
      .post(`/treatments/petowner/${id}/service/${sid}`, treatment)
      .then(() => {
        setOpenmodal(false);
        Swal.fire({
          title: "Treatment saved!",
          icon: "success",
        });
        getAdmissions();
      })

      .catch((err) => {
        setOpenmodal(false);
        const response = err.response;
        console.log(response);
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
        if (response && response.status === 403) {
          Swal.fire({
            title: "Error",
            text: response.data.message,
            icon: "error",
          }).then((result) => {
            if (result.isConfirmed) {
              getPetowner();
              setClientservice({});
              setErrors(null);
              setOpenconsent(true);
            }
          });
        }
        getAdmissions();
      });
  };

  const onSubmitConsent = (e) => {
    e.preventDefault();

    axiosClient
      .post(`/clientdeposits/petowner/${id}`, clientservice)
      .then(() => {
        setOpenconsent(false);
        Swal.fire({
          title: "Proceed to admission.",
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            getPetownerPets();
            setClientservice({});
            setTreatment({});
            setErrors(null);
            setOpenmodal(true);
          }
        });
        getAdmissions();
      })
      .catch((err) => {
        setOpenconsent(false);
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
        if (response && response.status === 403) {
          Swal.fire({
            title: "Error",
            text: response.data.message,
            icon: "error",
          });
        }
        getAdmissions();
      });
  };

  useEffect(() => {
    getAdmissions();
  }, []);

  return (
    <>
      <Paper
        sx={{
          padding: "10px",
        }}
      >
        <Box
          p={1}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Button
            onClick={addConsent}
            variant="contained"
            size="small"
            color="success"
          >
            <Add />
            client deposit
          </Button>
          <Button
            onClick={addModal}
            variant="contained"
            size="small"
            color="success"
          >
            <Add />
            treatment
          </Button>
        </Box>

        <AdmissionModal
          open={openconsent}
          onClose={closeModal}
          onSubmit={onSubmitConsent}
          petowner={petowner}
          clientservice={clientservice}
          setClientservice={setClientservice}
          errors={errors}
          loading={modalloading}
          isUpdate={clientservice.id}
        />
        <TreatmentModal
          open={openmodal}
          onClose={closeModal}
          onSubmit={onSubmit}
          treatment={treatment}
          setTreatment={setTreatment}
          errors={errors}
          loading={modalloading}
          pets={pets}
        />

        <TableContainer sx={{ height: 340 }} maxwidth="sm">
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
              <TableBody>
                {admissions &&
                  admissions
                    .slice(page * rowperpage, page * rowperpage + rowperpage)
                    .map((r) => (
                      <TableRow hover role="checkbox" key={r.id}>
                       <TableCell>
                          {format(new Date(r.treatment.date), "MMMM d, yyyy h:mm a")}
                        </TableCell>
                        <TableCell>{r.treatment.day}</TableCell>
                        <TableCell>{r.treatment.pet.name}</TableCell>
                        <TableCell>{r.treatment.diagnosis}</TableCell>
                        <TableCell>{r.servicesavailed.status}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={2}>
                            <Button
                              variant="contained"
                              size="small"
                              color="info"
                              component={Link}
                              to={`/admin/treatment/` + r.treatment.id}
                              target="_blank"
                            >
                              <Visibility fontSize="small" />
                              <Typography variant="subtitle2" ml={1}>
                                {" "}
                                View
                              </Typography>
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 15, 25]}
          rowsPerPage={rowperpage}
          page={page}
          count={admissions.length}
          component="div"
          onPageChange={handlechangepage}
          onRowsPerPageChange={handleRowsPerPage}
        ></TablePagination>
      </Paper>
      {/* </Box> */}
      {/* </Stack> */}
    </>
  );
}
