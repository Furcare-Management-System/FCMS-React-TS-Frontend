import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link, useParams } from "react-router-dom";
import {
  Alert,
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
import { Add, Archive, Edit, Visibility } from "@mui/icons-material";
import DropDownButtons from "../components/DropDownButtons";
import Swal from "sweetalert2";

export default function Staffs() {
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

  const [notification, setNotification] = useState("");
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(false);

  const getStaffs = () => {
    setLoading(true);
    axiosClient
      .get("/staffs")
      .then(({ data }) => {
        setLoading(false);
        setStaffs(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const onArchive = (u) => {
    Swal.fire({
      text: "Are you sure to archive this staff?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosClient.delete(`/staffs/${u.id}/archive`).then(() => {
          Swal.fire({
            text: "Staff was archived.",
            icon: "success",
          }).then(() => {
            getStaffs();
          });
        });
      }
    });
  };

  useEffect(() => {
    getStaffs();
  }, []);

  return (
    <>
      <Paper
        sx={{
          minWidth: "90%",
          padding: "10px",
        }}
      >
        <Box
          p={2}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Typography variant="h5">Staffs</Typography>
          <Button
            component={Link}
            to={"/admin/staffs/new"}
            variant="contained"
            size="small"
            color="success"
            target="_blank"
          >
            <Add />
          </Button>
        </Box>

        {notification && <Alert severity="success">{notification}</Alert>}

        <TableContainer sx={{ height: 340 }}>
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

            {!loading && (
              <TableBody>
                {staffs &&
                  staffs
                    .slice(page * rowperpage, page * rowperpage + rowperpage)
                    .map((r) => (
                      <TableRow hover role="checkbox" key={r.id}>
                        <TableCell>{r.id}</TableCell>
                        <TableCell>{`${r.firstname} ${r.lastname}`}</TableCell>
                        <TableCell>0{r.contact_num}</TableCell>
                        <TableCell>
                          {r.address.zone}, {r.address.barangay},{" "}
                          {r.address.zipcode.area}
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={2}>
                            <Button
                              component={Link}
                              to={`/admin/staffs/` + r.id + `/view`}
                              variant="contained"
                              color="info"
                              size="small"
                              target="_blank"
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
          count={staffs.length}
          component="div"
          onPageChange={handlechangepage}
          onRowsPerPageChange={handleRowsPerPage}
        ></TablePagination>
      </Paper>
    </>
  );
}
