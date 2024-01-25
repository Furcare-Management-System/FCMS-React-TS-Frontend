import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { Add, Archive } from "@mui/icons-material";
import ServiceAvailModal from "../components/modals/ServiceAvailModal";
import Swal from "sweetalert2";

export default function PetServiceAvail({ sid, title }) {
  const { id } = useParams();

  const columns = [
    { id: "Date", name: "Date" },
    { id: "Service", name: "Service" },
    { id: "Actions", name: "Actions" },
  ];

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [serviceavails, setServiceavails] = useState([]);

  const getServiceAvailed = () => {
    setServiceavails([]);
    setMessage(null);
    setLoading(true);
    axiosClient
      .get(`/servicesavailed/pet/${id}`)
      .then(({ data }) => {
        setLoading(false);
        setServiceavails(data.data);
      })
      .catch((mes) => {
        const response = mes.response;
        if (response && response.status == 404) {
          setMessage(response.data.message);
        }
        setLoading(false);
      });
  };

  const [pets, setPets] = useState([]);
  const getPets = () => {
    axiosClient
      .get(`/petowners/${id}/pets`)
      .then(({ data }) => {
        setPets(data.data);
      })
      .catch(() => {});
  };

  //for table
  const handlechangepage = (event, newpage) => {
    pagechange(newpage);
  };
  const handleRowsPerPage = (event) => {
    rowperpagechange(+event.target.value);
    pagechange(0);
  };

  const [page, pagechange] = useState(0);
  const [rowperpage, rowperpagechange] = useState(10);

  //for modal
  const [errors, setErrors] = useState(null);
  const [service, setServiceavail] = useState({
    id: null,
    pet_id: null,
    unit_price: null,
  });

  const [open, openServiceavail] = useState(false);

  const addModal = (ev) => {
    openServiceavail(true);
    getPets();
    setServiceavail({});
    setErrors(null);
  };

  const closeModal = () => {
    openServiceavail(false);
  };

  const onArchive = (u) => {
    Swal.fire({
      title: "Are you sure to archive this?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosClient.delete(`/servicesavailed/${u.id}/archive`).then(() => {
          Swal.fire({
            title: "Service was archived!",
            icon: "success",
            confirmButtonColor: "black",
          }).then(() => {
            getServiceAvailed();
          });
        });
      }
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    axiosClient
      .post(`/servicesavailed/petowner/${id}/service/${sid}`, service)
      .then((response) => {
        openServiceavail(false);
        Swal.fire({
          title: "Success",
          text: response.data.message,
          icon: "success",
          confirmButtonColor: "black",
        });
        getServiceAvailed();
      })
      .catch((response) => {
        openServiceavail(false);
        Swal.fire({
          title: "Error",
          text: response.response.data.message,
          icon: "error",
          confirmButtonColor: "black",
        });
      });
  };

  useEffect(() => {
    getServiceAvailed();
  }, []);

  return (
    <>
      <Paper
        sx={{
          minWidth: "90%",
          padding: "10px",
          margin: "10px",
        }}
      >
        <ServiceAvailModal
          open={open}
          onClose={closeModal}
          onClick={closeModal}
          onSubmit={onSubmit}
          title={title}
          pets={pets}
          addpet={true}
          serviceavail={service}
          setServiceavail={setServiceavail}
          errors={errors}
        />

        <TableContainer sx={{ height: 380 }}>
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
                  <TableCell colSpan={5} style={{ textAlign: "center" }}>
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
                {serviceavails &&
                  serviceavails
                    .slice(page * rowperpage, page * rowperpage + rowperpage)
                    .map((r) => (
                      <TableRow hover role="checkbox" key={r.id}>
                        <TableCell>{r.date}</TableCell>
                        <TableCell>{r.service.service}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            size="small"
                            color="error"
                            onClick={() => onArchive(r)}
                          >
                            <Archive fontSize="small" />
                          </Button>
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
          count={serviceavails.length}
          component="div"
          onPageChange={handlechangepage}
          onRowsPerPageChange={handleRowsPerPage}
        ></TablePagination>
      </Paper>
    </>
  );
}
