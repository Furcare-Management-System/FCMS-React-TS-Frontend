import React, { useEffect, useState } from "react";
import {
  Alert,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Divider,
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
import { Add, Archive, Close, Edit } from "@mui/icons-material";
import { Link, useParams } from "react-router-dom";
import axiosClient from "../axios-client";
import TestResultModal from "../components/modals/TestResultModal";
import EnlargeImageModal from "../components/modals/EnlargeImageModal";
import AttachmentModal from "../components/modals/AttachmentModal";

export default function PetTestResults({ sid, sname }) {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [notification, setNotification] = useState("");
  const [message, setMessage] = useState(null);

  const [testresults, setTestresults] = useState([]);
  const [pets, setPets] = useState([]);

  const [testresult, setTestresult] = useState({
    id: null,
    pet_id: null,
    attachment: null,
    description: "",
    unit_price: null,
  });

  const [error, setError] = useState(null);

  const getTestresults = () => {
    setError(null);
    setFilterdate(null);
    setTestresults([]);
    setMessage(null);
    setLoading(true);
    axiosClient
      .get(`/testresults/pet/${id}`)
      .then(({ data }) => {
        setLoading(false);
        setTestresults(data.data);
      })
      .catch((mes) => {
        const response = mes.response;
        if (response && response.status == 404) {
          setMessage(response.data.message);
        }
        setLoading(false);
      });
  };

  const getPets = () => {
    axiosClient
      .get(`/pets`)
      .then(({ data }) => {
        setPets(data.data);
      })
      .catch((mes) => {
        const response = mes.response;
        if (response && response.status == 404) {
          setErrors(response.data.message);
        }
      });
  };

  //for table
  const columns = [
    { id: "Date", name: "Date" },
    { id: "Attachment", name: "Attachment" },
    { id: "Type", name: "Type" },
    { id: "Description", name: "Description" },
    { id: "Actions", name: "Actions" },
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

  //for modal
  const [open, openchange] = useState(false);
  const [upload, setUpload] = useState(false);
  const [trid, setTrid] = useState(null);
  const [modalloading, setModalloading] = useState(false);

  const closeModal = () => {
    openchange(false);
    setUpload(false);
  };

  // onClicks
  const onEdit = (r) => {
    getPets();
    setModalloading(true);
    axiosClient
      .get(`/testresults/${r.id}`)
      .then(({ data }) => {
        setTestresult(data);
        setModalloading(false);
      })
      .catch(() => {
        setModalloading(false);
      });

    openchange(true);
  };

  const onEditAttachment = (r) => {
    setUpload(true);
    setTrid(r.id);
  };

  const onArchive = (r) => {
    if (!window.confirm("Are you sure to archive this test result?")) {
      return;
    }

    axiosClient.delete(`/testresults/${r.id}/archive`).then(() => {
      setNotification("Test result was archived.");
      getTestresults();
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (testresult.id) {
      axiosClient
        .put(`/testresults/${testresult.id}`, testresult)
        .then(() => {
          setNotification("Test result was successfully updated.");
          openchange(false);
          getTestresults();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      if (!testresult.attachment) {
        setError("Please select an image attachment to upload.");
        return;
      }

      const formData = new FormData();
      formData.append("attachment", testresult.attachment);

      axiosClient
        .post(`/testresults/petowner/${id}/service/${sid}`, testresult, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          setNotification("Test result was successfully saved.");
          openchange(false);
          setTestresult({});
          getTestresults();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  const handleImage = (e) => {
    const selectedFile = e.currentTarget.files?.[0];

    if (selectedFile) {
      // Validate the file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/svg+xml",
      ];
      if (allowedTypes.includes(selectedFile.type)) {
        setTestresult((prevImage) => ({
          ...prevImage,
          attachment: selectedFile,
        }));
        setResult((prevImage) => ({
          ...prevImage,
          attachment: selectedFile,
        }));
        setError(null);
        setUploadError(null);
      } else {
        setError(
          "The selected file must be of type: jpg, png, jpeg, gif, svg."
        );
        setUploadError(
          "The selected file must be of type: jpg, png, jpeg, gif, svg."
        );
      }
    }
  };

  //view attachment
  const [showImage, setShowImage] = useState(false);
  const [image, setImage] = useState(null);

  const toggleImage = (r) => {
    setShowImage(!showImage);
    setImage(r.attachment);
  };

  //upload new attachment
  const [uploadError, setUploadError] = useState(null);
  const [result, setResult] = useState({
    attachment: null,
  });

  const submitImage = (e) => {
    e.preventDefault();

    if (!result.attachment) {
      setUploadError("Please select an image attachment to upload.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("attachment", result.attachment);

      axiosClient
        .post(`/testresults/${trid}/upload-attachment`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          setNotification(response.data.success);
          setUpload(false);
          setResult({});
          getTestresults();
        })
        .catch((response) => {
          setUploadError(response.data.message);
        });
    } catch (error) {
      setUploadError("Failed to upload the attachment.");
    }
  };

  //filter by date
  const [filterdate, setFilterdate] = useState(null);

  const filter = () => {
    setTestresults([]);
    setMessage(null);
    setLoading(true);
    axiosClient
      .get(`/testresults/pet/${id}/${filterdate}`)
      .then(({ data }) => {
        setLoading(false);
        setTestresults(data.data);
      })
      .catch((mes) => {
        const response = mes.response;
        if (response && response.status == 404) {
          setMessage(response.data.message);
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    getTestresults();
  }, []);

  return (
    <>
      <Paper
        sx={{
          minWidth: "90%",
          padding: "10px",
          marginBottom: "-30px",
        }}
        elevation={4}
      >
        <Box p={1} sx={{ display: "flex", justifyContent: "right" }}>
          <TextField
            label="Date"
            variant="outlined"
            id="Date"
            type="date"
            size="small"
            value={filterdate || ``}
            onChange={(ev) => setFilterdate(ev.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{
              max: new Date().toISOString().split("T")[0],
            }}
            required
          />
          {filterdate && (
            <IconButton variant="outlined" onClick={getTestresults}>
              <Close />
            </IconButton>
          )}
          <Button
            variant="contained"
            size="small"
            sx={{ ml: 1 }}
            onClick={filter}
          >
            <Typography fontSize={"12px"}>Filter</Typography>
          </Button>
        </Box>
        <Box
          sx={{
            minWidth: "90%",
          }}
        >
          {notification && <Alert severity="success">{notification}</Alert>}

          <TestResultModal
            open={open}
            onClick={closeModal}
            onClose={closeModal}
            onSubmit={onSubmit}
            loading={modalloading}
            pets={pets}
            errors={errors}
            testresult={testresult}
            setTestresult={setTestresult}
            isUpdate={testresult.id}
            petid={null}
            handleImage={handleImage}
            error={error}
            servicename={sname}
          />
          <AttachmentModal
            open={upload}
            onClick={closeModal}
            onClose={closeModal}
            handleImage={handleImage}
            submitImage={submitImage}
            uploadError={uploadError}
          />
          <EnlargeImageModal
            open={showImage}
            onClose={toggleImage}
            title="Test Result Attachment"
            image={image}
          />
          <Divider />
          <TableContainer sx={{ height: 350 }}>
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
                  {testresults &&
                    testresults
                      .slice(page * rowperpage, page * rowperpage + rowperpage)
                      .map((r) => (
                        <TableRow hover role="checkbox" key={r.id}>
                          <TableCell>{r.date}</TableCell>
                          <TableCell>
                            <img
                              src={
                                `${import.meta.env.VITE_API_BASE_URL}/` +
                                r.attachment
                              }
                              height="50"
                              width="50"
                              onClick={() => toggleImage(r)}
                              style={{ cursor: "pointer" }}
                            />
                            <IconButton
                              color="primary"
                              onClick={() => onEditAttachment(r)}
                            >
                              <Edit fontSize="small" />{" "}
                            </IconButton>
                          </TableCell>
                          <TableCell>
                            {r.servicesavailed.service.service}
                          </TableCell>
                          <TableCell>{r.description}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={2}>
                              <Button
                                variant="contained"
                                color="info"
                                size="small"
                                onClick={() => onEdit(r)}
                              >
                                <Edit fontSize="small" />
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
            sx={{ marginBottom: "-20px" }}
            rowsPerPageOptions={[10, 15, 25]}
            rowsPerPage={rowperpage}
            page={page}
            count={testresults.length}
            component="div"
            onPageChange={handlechangepage}
            onRowsPerPageChange={handleRowsPerPage}
          ></TablePagination>
        </Box>
      </Paper>
    </>
  );
}
