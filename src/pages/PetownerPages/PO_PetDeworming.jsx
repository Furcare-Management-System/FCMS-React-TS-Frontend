import React, { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import { useParams } from "react-router-dom";
import {
  Alert,
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
  useMediaQuery,
} from "@mui/material";
import { Archive, Edit } from "@mui/icons-material";
import DewormingLogsModal from "../../components/modals/DewormingLogsModal";
import { useStateContext } from "../../contexts/ContextProvider";

export default function PO_PetDeworming() {
  const { notification, setNotification } = useStateContext();
  const { id } = useParams();
  const isMobile = useMediaQuery("(max-width:600px)");

  //for table
  const columns = [
    { id: "date", name: "Date" },
    { id: "weight", name: "Weight" },
    { id: "Description", name: "Description" },
    { id: "Veterinarian", name: "Veterinarian" },
    { id: "Return", name: "Return" },
  ];
  const [page, pagechange] = useState(0);
  const [rowperpage, rowperpagechange] = useState(10);

  const handlechangepage = (event, newpage) => {
    pagechange(newpage);
  };
  const handleRowsPerPage = (event) => {
    rowperpagechange(+event.target.value);
    pagechange(0);
  };

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState(null);
  const [deworminglog, setDeworminglog] = useState({
    id: null,
    weight: null,
    description: "",
    administered: "",
    return: "",
    pet_id: null,
  });
  const [pet, setPet] = useState([]);
  const [vets, setVets] = useState([]);
  const [open, setOpen] = useState(false);
  const [deworminglogs, setDeworminglogs] = useState([]);
  const [modalloading, setModalloading] = useState(false);

  const getDeworming = () => {
    setDeworminglogs([]);
    setMessage(null);
    setLoading(true);
    axiosClient
      .get(`/deworminglogs/pet/${id}`)
      .then(({ data }) => {
        setLoading(false);
        setDeworminglogs(data.data);
      })
      .catch((mes) => {
        const response = mes.response;
        if (response && response.status == 404) {
          setMessage(response.data.message);
        }
        setLoading(false);
      });
  };

  const getVets = () => {
    axiosClient
      .get(`/vets`)
      .then(({ data }) => {
        setVets(data.data);
      })
      .catch(() => {});
  };

  const closepopup = () => {
    setOpen(false);
  };

  const onEdit = (r) => {
    getVets();
    setErrors(null);
    setModalloading(true);
    axiosClient
      .get(`/deworminglogs/${r.id}`)
      .then(({ data }) => {
        setModalloading(false);
        setDeworminglog(data);
        setPet(data.pet);
      })
      .catch(() => {
        setModalloading(false);
      });
    setOpen(true);
  };

  const onArchive = (r) => {
    if (!window.confirm("Are you sure to archive this?")) {
      return;
    }

    axiosClient.delete(`/deworminglogs/${r.id}/archive`).then(() => {
      setNotification("Deworming was archived");
      getDeworming();
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (deworminglog.id) {
      axiosClient
        .put(`/deworminglogs/${deworminglog.id}`, deworminglog)
        .then(() => {
          setNotification("Deworming was successfully updated.");
          setOpen(false);
          getDeworming();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  useEffect(() => {
    getDeworming();
  }, []);

  return (
    <>
      <Paper
        sx={{
          minWidth: "90%",
          padding: "10px",
        }}
      >
        <DewormingLogsModal
          open={open}
          onClose={closepopup}
          onClick={closepopup}
          onSubmit={onSubmit}
          loading={modalloading}
          deworminglog={deworminglog}
          setDeworminglog={setDeworminglog}
          errors={errors}
          pet={pet}
          vets={vets}
          isUpdate={true}
        />

        {/* <Button
            component={Link}
            to={`/admin/deworminglogs/archives`}
            variant="contained"
            color="success"
            size="small"
          >
            <Typography>Archives</Typography>
          </Button> */}

        {notification && <Alert severity="success">{notification}</Alert>}

        <TableContainer
          sx={{
            height: 380,
            display: { xs: "none", sm: "block", md: "block", lg: "block" },
          }}
        >
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
                  <TableCell
                    colSpan={columns.length}
                    style={{ textAlign: "center" }}
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              </TableBody>
            )}

            {!loading && message && (
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

            {!loading && (
              <TableBody>
                {deworminglogs &&
                  deworminglogs
                    .slice(page * rowperpage, page * rowperpage + rowperpage)
                    .map((r) => (
                      <TableRow hover role="checkbox" key={r.id}>
                        <TableCell>{r.date}</TableCell>
                        <TableCell>{`${r.weight} kg`}</TableCell>
                        <TableCell>{r.description}</TableCell>
                        <TableCell>{r.vet.fullname}</TableCell>
                        <TableCell>{r.return}</TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>

        {isMobile && (
          <TableContainer
            sx={{
              height: "100%",
              width: "100%",
            }}
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{ backgroundColor: "black", color: "white" }}
                  >
                    Dewormings
                  </TableCell>
                </TableRow>
              </TableHead>
              {loading && (
                <TableBody>
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      style={{ textAlign: "center" }}
                    >
                      Loading...
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}

              {!loading && message && (
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

              {!loading && (
                <TableBody>
                  {deworminglogs &&
                    deworminglogs
                      .slice(page * rowperpage, page * rowperpage + rowperpage)
                      .map((r) => (
                        <TableRow hover role="checkbox" key={r.id}>
                          <TableCell
                            sx={{
                              fontSize: "15px",
                            }}
                          >
                            <div>
                              <strong>Date:</strong> {r.date}
                            </div>
                            <div>
                              <strong>Weight:</strong>
                              {`${r.weight} kg`}
                            </div>
                            <div>
                              <strong>Description:</strong> {r.description}
                            </div>
                            <div>
                              <strong>Vet:</strong> {r.vet.fullname}
                            </div>
                            <div>
                              <strong>Return:</strong> {r.return}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              )}
            </Table>
          </TableContainer>
        )}

        <TablePagination
          rowsPerPageOptions={[10, 15, 25]}
          rowsPerPage={rowperpage}
          page={page}
          count={deworminglogs.length}
          component="div"
          onPageChange={handlechangepage}
          onRowsPerPageChange={handleRowsPerPage}
        ></TablePagination>
      </Paper>
    </>
  );
}
