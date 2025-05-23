import React, { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
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
import { Add, Archive, Delete } from "@mui/icons-material";
import ServiceAvailModal from "../../components/modals/ServiceAvailModal";
import Swal from "sweetalert2";
import { format } from "date-fns";

export default function ServiceAvail({ sid, title }) {
  const { id } = useParams();

  const columns = [
    { id: "Date and Time", name: "Date and Time" },
    { id: "Pet", name: "Pet" },
    { id: "Quantity", name: "Quantity" },
    { id: "Unit", name: "Unit" },
    { id: "Status", name: "Status" },
    { id: "Actions", name: "Actions" },
  ];

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitloading, setSubmitloading] = useState(false);

  const [serviceavails, setServiceavails] = useState([]);

  const getServiceAvailed = () => {
    setServiceavails([]);
    setMessage(null);
    setLoading(true);
    axiosClient
      .get(`/servicesavailed/petowner/${id}/service/${sid}`)
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
    quantity: null,
    unit: "",
  });

  const [open, openServiceavail] = useState(false);

  const addModal = (ev) => {
    openServiceavail(true);
    getPets();
    setServiceavail({});
    setErrors(null);
    if (sid === 3) {
      setServiceavail((prevServiceavail) => ({
        ...prevServiceavail,
        unit: "day/s",
      }));
    }
  };

  const closeModal = () => {
    openServiceavail(false);
  };

  const onDelete = (u) => {
    Swal.fire({
      title: "Are you sure to delete this?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosClient.delete(`/servicesavailed/${u.id}/forcedelete`).then(() => {
          Swal.fire({
            title: "Service was deleted.",
            icon: "success",
          }).then(() => {
            getServiceAvailed();
          });
        });
      }
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitloading(true);

    axiosClient
      .post(`/servicesavailed/petowner/${id}/service/${sid}`, service)
      .then((response) => {
        openServiceavail(false);
        setSubmitloading(false);
        Swal.fire({
          title: "Success",
          text: response.data.message,
          icon: "success",
        });
        getServiceAvailed();
      })
      .catch((response) => {
        openServiceavail(false);
        setSubmitloading(false);
        Swal.fire({
          title: "Error",
          text: response.response.data.message,
          icon: "error",
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
          width: "105%",
          padding: "10px",
          marginBottom: "-40px",
          marginLeft: "-25px",
        }}
        elevation={4}
      >
        <Box
          padding={1}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Button
            onClick={addModal}
            variant="contained"
            color="success"
            size="small"
          >
            Add
          </Button>
        </Box>

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
          sid={sid}
          submitloading={submitloading}
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
                  <TableCell colSpan={columns.length} style={{ textAlign: "center" }}>
                    Loading...
                  </TableCell>
                </TableRow>
              </TableBody>
            )}

            {!loading && message && (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={columns.length} style={{ textAlign: "center" }}>
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
                        <TableCell>
                          {format(new Date(r.date), "MMMM d, yyyy h:mm a")}
                        </TableCell>
                        <TableCell>{r.pet.name}</TableCell>
                        <TableCell>{r.quantity}</TableCell>
                        <TableCell>{r.unit}</TableCell>
                        <TableCell>{r.status}</TableCell>
                        <TableCell>
                        {r.status === "To Pay" && (
                          <Button
                            variant="contained"
                            size="small"
                            color="error"
                            onClick={() => onDelete(r)}
                          >
                            <Delete fontSize="small" />
                          </Button>
                        )}
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
          count={serviceavails.length}
          component="div"
          onPageChange={handlechangepage}
          onRowsPerPageChange={handleRowsPerPage}
        ></TablePagination>
      </Paper>
    </>
  );
}
