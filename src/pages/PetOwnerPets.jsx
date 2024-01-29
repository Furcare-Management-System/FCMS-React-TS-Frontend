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
} from "@mui/material";
import {
  Add,
  AddPhotoAlternate,
  Archive,
  Visibility,
} from "@mui/icons-material";
import { Link, useParams } from "react-router-dom";
import axiosClient from "../axios-client";
import PetsModal from "../components/modals/PetsModal";

export default function PetOwnerPets() {
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
  const [submitloading, setSubmitloading] = useState(false);

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
    const selectedSpecietype = event.target.value;
    setSelectedSpecie(selectedSpecietype);
    getBreeds(selectedSpecietype);
  };

  const getBreeds = (query) => {
    if (query) {
      setBreeds([]);
      axiosClient
        .get(`/breeds-specie/${query}`)
        .then(({ data }) => {
          setBreeds(data.data);
        })
        .catch((error) => {
          const response = error.response;
          if (response && response.status === 404) {
            console.log(response.data.message);
          }
        });
    }
  };

  const getPets = () => {
    setMessage("");
    setLoading(true);
    axiosClient
      .get(`/petowners/${id}/pets`)
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
    getSpecies();
    setSelectedSpecie(null);
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
    setSubmitloading(true);
    if (pet.id) {
      axiosClient
        .put(`/pets/${pet.id}`, pet)
        .then(() => {
          setSubmitloading(false);
          setNotification("Pet was successfully updated");
          openchange(false);
          getPets();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
          setSubmitloading(false);
        });
    } else {
      axiosClient
        .post(`/petowners/${id}/addpet`, pet)
        .then(() => {
          setSubmitloading(false);
          setNotification("Pet was successfully added");
          openchange(false);
          getPets();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
          setSubmitloading(false);
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

  useEffect(() => {
    getPets();
  }, []);

  return (
    <>
      <Box
        sx={{
          minWidth: "90%",
        }}
      >
        <Box
          p={2}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Button
            onClick={functionopenpopup}
            variant="contained"
            size="small"
            color="success"
          >
            <Add />
          </Button>
        </Box>
        {notification && <Alert severity="success">{notification}</Alert>}

        <PetsModal
          open={open}
          onClick={closepopup}
          onClose={closepopup}
          setImageData={setImageData}
          onSubmit={onSubmit}
          selectedSpecie={selectedSpecie}
          handleSpecieChange={handleSpecieChange}
          species={species}
          breeds={breeds}
          pet={pet}
          setPet={setPet}
          errors={errors}
          isUpdate={pet.id}
          petownerid={id}
          addImage={true}
          handleImage={handleImage}
          error={error}
          submitloading={submitloading}
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
                              to={`/admin/pets/` + r.id + `/view`}
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
          count={pets.length}
          component="div"
          onPageChange={handlechangepage}
          onRowsPerPageChange={handleRowsPerPage}
        ></TablePagination>
      </Box>
    </>
  );
}
