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
  Typography,
} from "@mui/material";
import { Add, Archive, Edit } from "@mui/icons-material";
import { Link, useParams } from "react-router-dom";
import axiosClient from "../../axios-client";
import TestResultModal from "../../components/modals/TestResultModal";
import EnlargeImageModal from "../../components/modals/EnlargeImageModal";
import AttachmentModal from "../../components/modals/AttachmentModal";
import { format } from "date-fns";

export default function OtherTestResults({ sid, sname }) {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [notification, setNotification] = useState("");
  const [message, setMessage] = useState(null);
  const [errormessage, setErrorMessage] = useState(null);

  const [testresults, setTestresults] = useState([]);
  const [pets, setPets] = useState([]);
  const [othertests, setOthertests] = useState([]);

  const [testresult, setTestresult] = useState({
    id: null,
    pet_id: null,
    attachment: null,
    description: "",
    unit_price: null,
    service_id: null,
  });

  const [error, setError] = useState(null);

  const getTestresults = () => {
    setTestresults([]);
    setMessage(null);
    setLoading(true);
    axiosClient
      .get(`/testresults/petowner/${id}/others`)
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
      .get(`/petowners/${id}/pets`)
      .then(({ data }) => {
        setPets(data.data);
      })
      .catch((mes) => {
        const response = mes.response;
        if (response && response.status == 404) {
          setErrorMessage(response.data.message);
        }
      });
  };

  const get4DXtests = () => {
    setOthertests([]);
    setMessage(null);
    setLoading(true);
    axiosClient
      .get(`/services/4dx`)
      .then(({ data }) => {
        setLoading(false);
        setOthertests(data.data);
      })
      .catch((mes) => {
        const response = mes.response;
        if (response && response.status == 404) {
          setMessage(response.data.message);
        }
        setLoading(false);
      });
  };

  //for table
  const columns = [
    { id: "Date", name: "Date" },
    { id: "Pet", name: "Pet" },
    { id: "Type", name: "Type" },
    { id: "Attachment", name: "Attachment" },
    { id: "Description", name: "Description" },
    { id: "Status", name: "Status" },
    // { id: "Actions", name: "Actions" },
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

  const openModal = () => {
    setTestresult({});
    getPets();
    get4DXtests();
    openchange(true);
    setErrors(null);
    setError(null);
  };

  const closeModal = () => {
    openchange(false);
    setUpload(false);
  };

  // onClicks
  const onEdit = (r) => {
    getPets();
    get4DXtests();
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
        .post(
          `/testresults/petowner/${id}/service/${testresult.service_id}`,
          testresult,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
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

  useEffect(() => {
    getTestresults();
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
          sx={{
            minWidth: "90%",
          }}
        >
          <Box
            p={1}
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Button
              onClick={openModal}
              variant="contained"
              color="success"
              size="small"
            >
              add
            </Button>
          </Box>
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
            errormessage={errormessage}
            othertests={othertests}
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
                          <TableCell>
                            {format(new Date(r.date), "MMMM d, yyyy h:mm a")}
                          </TableCell>
                          <TableCell>{r.pet.name}</TableCell>
                          <TableCell>
                            {r.servicesavailed.service.service}
                          </TableCell>
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
                          <TableCell>{r.description}</TableCell>
                          <TableCell>{r.servicesavailed.status}</TableCell>
                          {/* <TableCell>
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
                          </TableCell> */}
                        </TableRow>
                      ))}
                </TableBody>
              )}
            </Table>
          </TableContainer>
          <TablePagination
            sx={{ marginBottom: "-10px" }}
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
