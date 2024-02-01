import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import {
  Alert,
  Backdrop,
  Box,
  Button,
  CircularProgress,
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
import { Add, Archive, NavigateNext, Visibility } from "@mui/icons-material";
import { SearchPetOwner } from "../components/SearchPetOwner";

export default function PetOwners() {
  //for table
  const columns = [
    { id: "id", name: "ID" },
    { id: "name", name: "Name" },
    { id: "contact_num", name: "Contact Number" },
    { id: "address", name: "Address" },
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

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");
  const [message, setMessage] = useState(null);
  const [petowners, setPetowners] = useState([]);
  const [query, setQuery] = useState("");

  const getPetowners = () => {
    setMessage(null);
    setLoading(true);
    axiosClient
      .get("/petowners")
      .then(({ data }) => {
        setLoading(false);
        setPetowners(data.data);
      })
      .catch((error) => {
        const response = error.response;
        if (response && response.status === 404) {
          setMessage(response.data.message);
        }
        setLoading(false);
      });
  };

  const search = (query) => {
    if (query) {
      setMessage(null);
      setPetowners([]);
      setLoading(true);
      axiosClient
        .get(`/petowners-search/${query}`)
        .then(({ data }) => {
          setLoading(false);
          setPetowners(data.data);
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

  const onArchive = (u) => {
    if (!window.confirm("Are you sure to archive this pet owner?")) {
      return;
    }

    axiosClient.delete(`/petowners/${u.id}/archive`).then(() => {
      setNotification("Pet Owner was archived");
      getPetowners();
    });
  };

  useEffect(() => {
    if (!query) {
      getPetowners();
    }
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
        <Box
          p={1}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
            <Typography variant="h5" pr={2}>
              Pet Owners
            </Typography>
            <Button
              component={Link}
              to={"/admin/petowners/new"}
              variant="contained"
              color="success"
              size="small"
              target="_blank"
            >
              <Add />
            </Button>
          </Box>
          <SearchPetOwner
            query={query}
            setQuery={setQuery}
            search={search}
            getPetowners={getPetowners}
          />
        </Box>

        {notification && <Alert severity="success">{notification}</Alert>}

        <TableContainer sx={{ height: "100%" }}>
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
                  <TableCell colSpan={7} style={{ textAlign: "center" }}>
                    {message}
                  </TableCell>
                </TableRow>
              </TableBody>
            )}

            {!loading && (
              <TableBody>
                {petowners &&
                  petowners
                    .slice(page * rowperpage, page * rowperpage + rowperpage)
                    .map((r) => (
                      <TableRow hover role="checkbox" key={r.id}>
                        <TableCell>{r.id}</TableCell>
                        <TableCell>{`${r.firstname} ${r.lastname}`}</TableCell>
                        <TableCell>0{r.contact_num}</TableCell>
                        <TableCell>
                          {r.zone}, {r.barangay},{" "}
                          {r.zipcode.area}
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={2}>
                            <Button
                              component={Link}
                              to={`/admin/petowners/` + r.id + `/view`}
                              variant="contained"
                              color="info"
                              size="small"
                            >
                              <Visibility fontSize="small" />
                            </Button>

                            <Button
                              variant="contained"
                              size="small"
                              color="error"
                              onClick={() => onArchive(r)}
                            >
                              <Archive fontSize="small" />
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
          count={petowners.length}
          component="div"
          onPageChange={handlechangepage}
          onRowsPerPageChange={handleRowsPerPage}
        ></TablePagination>
      </Paper>
    </>
  );
}
