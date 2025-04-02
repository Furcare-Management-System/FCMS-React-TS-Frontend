import React, { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Divider,
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
import {
  Add,
  AddPhotoAlternate,
  Archive,
  Visibility,
} from "@mui/icons-material";
import { Link, useParams } from "react-router-dom";
import axiosClient from "../../axios-client";
import PetsModal from "../../components/modals/PetsModal";
import { useStateContext } from "../../contexts/ContextProvider";
import CustomHelmet from "../../components/CustomHelmet";

export default function MyPets() {
  const { staffuser } = useStateContext();
  //for table
  const columns = [
    { id: "Photo", name: "Photo" },
    { id: "name", name: "Pet Name" },
    { id: "Birthdate", name: "Birthdate" },
    { id: "Gender", name: "Gender" },
    { id: "breed", name: "Breed" },
    { id: "Color", name: "Color" },
    { id: "Actions", name: "Actions" },
  ];
  const [page, pagechange] = useState(0);
  const [rowperpage, rowperpagechange] = useState(10);

  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [imageData, setImageData] = useState("");
  const [notification, setNotification] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [pets, setPets] = useState([]);

  const [pet, setPet] = useState({
    id: null,
    name: "",
    birthdate: "",
    gender: "",
    color: "",
    photo: null,
    breed_id: null,
  });

  const [breeds, setBreeds] = useState([]);
  const [species, setSpecies] = useState([]);
  const [selectedSpecie, setSelectedSpecie] = useState(null);

  const getSpecies = () => {
    axiosClient
      .get(`/species`)
      .then(({ data }) => {
        setSpecies(data.data);
      })
      .catch(() => {});
  };

  const handleSpecieChange = (event) => {
    const selectedSpeciesId = event.target.value;
    setSelectedSpecie(selectedSpeciesId);
  };

  const getBreeds = () => {
    axiosClient
      .get(`/breeds`)
      .then(({ data }) => {
        setBreeds(data.data);
      })
      .catch(() => {});
  };

  const getPets = () => {
    setMessage("");
    setLoading(true);
    axiosClient
      .get(`/petowners/${staffuser.id}/pets`)
      .then(({ data }) => {
        setLoading(false);
        setPets(data.data);
      })
      .catch((mes) => {
        const response = mes.response;
        if (response && response.status == 404) {
          setMessage(response.data.message);
        }
        setLoading(false);
      });
  };

  const handlechangepage = (event, newpage) => {
    pagechange(newpage);
  };
  const handleRowsPerPage = (event) => {
    rowperpagechange(+event.target.value);
    pagechange(0);
  };

  //for modal
  const [open, openchange] = useState(false);

  const functionopenpopup = (ev) => {
    getBreeds();
    openchange(true);
    setPet({});
    setErrors(null);
  };

  const closepopup = () => {
    openchange(false);
  };

  const onArchive = (u) => {
    if (!window.confirm("Are you sure to archive this pet?")) {
      return;
    }

    axiosClient.delete(`/pets/${u.id}/archive`).then(() => {
      setNotification("Pet was archived");
      getPets();
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (pet.id) {
      axiosClient
        .put(`/pets/${pet.id}`, pet)
        .then(() => {
          setNotification("Pet was successfully updated");
          openchange(false);
          getPets();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      if (!pet.photo) {
        setError("Please select an image to upload.");
        return;
      }

      const formData = new FormData();
      formData.append("photo", pet.photo);

      axiosClient
        .post(`/petowners/${id}/addpet`, pet, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          setNotification("Pet was successfully added");
          openchange(false);
          getPets();
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
    const selectedFile = e.currentTarget.files?.[0] || null;

    if (selectedFile) {
      // Validate the file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/svg+xml",
      ];
      if (allowedTypes.includes(selectedFile.type)) {
        setPet((prevImage) => ({
          ...prevImage,
          photo: selectedFile,
        }));
        setError(null);
      } else {
        setError(
          "The selected file must be of type: jpg, png, jpeg, gif, svg."
        );
      }
    }
  };

  //responsive
  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    getPets();
    getSpecies();
  }, []);

  return (
    <>
      <CustomHelmet title="My Pets" />

      <Box
        sx={{
          minWidth: "90%",
          padding: "15px",
        }}
      >
        {notification && <Alert severity="success">{notification}</Alert>}

        <PetsModal
          open={open}
          onClick={closepopup}
          onClose={closepopup}
          // id={petdata.id}
          setImageData={setImageData}
          onSubmit={onSubmit}
          // loading={loading}
          breeds={breeds}
          species={species}
          pet={pet}
          setPet={setPet}
          errors={errors}
          isUpdate={pet.id}
          petownerid={id}
          addImage={true}
          handleImage={handleImage}
          error={error}
        />
        {!isMobile && (
          <Typography variant="h5" p={1}>
            Pets
          </Typography>
        )}
        <TableContainer
          sx={{
            height: "100%",
            width: "1050px",
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
                {pets &&
                  pets
                    .slice(page * rowperpage, page * rowperpage + rowperpage)
                    .map((r) => (
                      <TableRow hover role="checkbox" key={r.id}>
                        <TableCell>
                          {r.photo ? (
                            <Avatar
                              alt="pet-photo"
                              src={
                                `${import.meta.env.VITE_API_BASE_URL}/` +
                                r.photo
                              }
                              sx={{ width: 50, height: 50 }}
                              variant="rounded"
                            />
                          ) : (
                            <Avatar
                              sx={{ width: 50, height: 50 }}
                              variant="rounded"
                            >
                              <AddPhotoAlternate
                                sx={{ width: 20, height: 20 }}
                              />
                            </Avatar>
                          )}
                        </TableCell>
                        <TableCell>{r.name}</TableCell>
                        <TableCell>{r.birthdate}</TableCell>
                        <TableCell>{r.gender}</TableCell>
                        <TableCell>{r.breed.breed}</TableCell>
                        <TableCell>{r.color}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={2}>
                            <Button
                              variant="contained"
                              color="info"
                              size="small"
                              component={Link}
                              to={`/petowner/pets/` + r.id + `/view`}
                            >
                              <Visibility fontSize="small" />
                            </Button>
                          </Stack>
                        </TableCell>
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
              width: "100",
            }}
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{
                      backgroundColor: "black",
                      color: "white",
                      fontSize: "20px",
                    }}
                  >
                    Pets
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
                  {pets &&
                    pets
                      .slice(page * rowperpage, page * rowperpage + rowperpage)
                      .map((r) => (
                        <TableRow hover role="checkbox" key={r.id}>
                          <TableCell
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              fontSize: "15px",
                            }}
                          >
                            <Stack pr={3}>
                              <div>
                                {r.photo ? (
                                  <Avatar
                                    alt="pet-photo"
                                    src={
                                      `${import.meta.env.VITE_API_BASE_URL}/` +
                                      r.photo
                                    }
                                    sx={{ width: 100, height: 100 }}
                                    variant="rounded"
                                  />
                                ) : (
                                  <Avatar
                                    sx={{ width: 100, height: 100 }}
                                    variant="rounded"
                                  >
                                    <AddPhotoAlternate
                                      sx={{ width: 20, height: 20 }}
                                    />
                                  </Avatar>
                                )}
                              </div>
                            </Stack>
                            <Stack>
                              <div>
                                <strong>Pet Name:</strong> {r.name}
                              </div>
                              <div>
                                <strong>Birthdate:</strong> {r.birthdate}
                              </div>
                              <div>
                                <strong>Gender:</strong> {r.gender}
                              </div>
                              <div>
                                <strong>Breed:</strong> {r.breed.breed}
                              </div>
                              <div>
                                <strong>Color:</strong> {r.color}
                              </div>
                              <Stack direction="row" spacing={2}>
                                <Button
                                  variant="contained"
                                  color="info"
                                  size="small"
                                  component={Link}
                                  to={`/petowner/pets/` + r.id + `/view`}
                                >
                                  <Visibility fontSize="small" />
                                </Button>
                              </Stack>
                            </Stack>
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
          count={pets.length}
          component="div"
          onPageChange={handlechangepage}
          onRowsPerPageChange={handleRowsPerPage}
        ></TablePagination>
      </Box>
    </>
  );
}
