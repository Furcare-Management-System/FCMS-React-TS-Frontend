import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosClient from "../axios-client";
import {
  Alert,
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { AddPhotoAlternate, Edit } from "@mui/icons-material";
import PetsModal from "../components/modals/PetsModal";
import PetTabs from "../components/PetTabs";
import QrCodeGenerator from "../components/QrCodeGenerator";
import QRCode from "qrcode";
import CryptoJS from "crypto-js";
import { useStateContext } from "../contexts/ContextProvider";
import PetImageModal from "../components/modals/PetImageModal";

export default function ViewPet() {
  const { id } = useParams();
  const { notification, setNotification } = useStateContext();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  const [pet, setPet] = useState({
    id: null,
    name: "",
    birthdate: "",
    gender: "",
    color: "",
    qr_code: "",
    petowner_id: null,
    photo: null,
    breed_id: null,
  });

  const [specie, setSpecie] = useState([]);
  const [breed, setBreed] = useState([]);
  const [petowner, setPetowner] = useState([]);
  const [error, setError] = useState(null);
  const [breeds, setBreeds] = useState([]);
  const [species, setSpecies] = useState([]);
  const [selectedSpecie, setSelectedSpecie] = useState(null);

  const [open, setOpen] = useState(false);
  const [upload, setUpload] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [petimage, setPetimage] = useState({
    photo: null,
  });

  const getPet = () => {
    setNotification(null);
    setErrors(null);
    setLoading(true);
    axiosClient
      .get(`/pets/${id}`)
      .then(({ data }) => {
        setLoading(false);
        setPet(data);
        setPetowner(data.petowner);
        setSpecie(data.breed.specie);
        setBreed(data.breed);
      })
      .catch(() => {
        setLoading(false);
      });
  };

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
      axiosClient
        .get(`/breeds-specie/${query}`)
        .then(({ data }) => {
          setBreeds(data.data || []);
        })
        .catch((error) => {
          const response = error.response;
          if (response && response.status === 404) {
            alert(response.data.message);
          }
        });
    } else {
      setBreeds([]);
    }
  };

  const onEdit = () => {
    getPet();
    setErrors(null);
    getSpecies();
    setOpen(true);
    if (specie.id) {
      setSelectedSpecie(specie.id);
      getBreeds(specie.id);
    }
  };

  const onSubmit = (ev) => {
    ev.preventDefault();

    if (pet.id) {
      axiosClient
        .put(`/pets/${pet.id}`, pet)
        .then(() => {
          setNotification("Pet was successfully updated");
          setOpen(false);
          getPet();
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
        .post(`/petowners/${pet.petowner_id}/addpet`, pet, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          setNotification("Pet was successfully added");
          setOpen(false);
          getPet();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  const uploadImage = () => {
    setUpload(true);
  };

  const submitImage = (e) => {
    e.preventDefault();

    if (!petimage.photo) {
      setUploadError("Please select an image attachment to upload.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("photo", petimage.photo);

      axiosClient
        .post(`/pets/${id}/upload-image`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          setNotification(response.data.success);
          setUpload(false);
          setPetimage({});
          getPet();
        })
        .catch((response) => {
          setUploadError(response.data.message);
        });
    } catch (error) {
      setUploadError("Failed to upload the attachment.");
    }
  };

  const closepopup = () => {
    setOpen(false);
    setUpload(false);
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
        setPetimage((prevImage) => ({
          ...prevImage,
          photo: selectedFile,
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

  const [qr, setQr] = useState("");
  const [qrval, setQrval] = useState("");

  const secretPass = "XkhZG4fW2t2W";

  const encryptData = () => {
    const data = CryptoJS.AES.encrypt(
      JSON.stringify(id),
      secretPass
    ).toString();

    setQrval(data);
  };

  const GenerateQRCode = () => {
    QRCode.toDataURL(
      qrval,
      {
        width: 120,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#EEEEEEFF",
        },
      },
      (err, qrval) => {
        if (err) return console.error(err);

        setQr(qrval);
      }
    );
  };

  useEffect(() => {
    getPet();
    encryptData();
  }, []);

  useEffect(() => {
    if (selectedSpecie) {
      getBreeds(selectedSpecie);
    } else {
      setBreeds([]);
    }
  }, [selectedSpecie]);

  return (
    <div>
      <Paper mt={1} sx={{ padding: "15px", margin: "10px" }}>
        <Breadcrumbs color="primary">
          <Button
            component={Link}
            to={`/admin/petowners/` + petowner.id + `/view`}
            color="secondary"
            variant="text"
            size="small"
          >
            {petowner.firstname}
          </Button>
          <Typography color="text.primary">{pet.name}</Typography>
        </Breadcrumbs>
        <Divider />
        {notification && <Alert severity="success">{notification}</Alert>}
        <Stack flexDirection="row" padding={1}>
          <Button onClick={uploadImage}>
            {pet.photo ? (
              <Avatar
                alt="pet-photo"
                src={`${import.meta.env.VITE_API_BASE_URL}` + pet.photo}
                sx={{ width: 130, height: 130 }}
                variant="rounded"
              />
            ) : (
              <Avatar sx={{ width: 130, height: 130 }} variant="rounded">
                <AddPhotoAlternate sx={{ width: 40, height: 40 }} />
              </Avatar>
            )}
          </Button>

          <Stack flexDirection="column" padding={1}>
            <Typography variant="h6">
              Pet Information
              <IconButton
                variant="contained"
                color="info"
                onClick={() => onEdit()}
              >
                <Edit fontSize="small" />
              </IconButton>
            </Typography>
            <Typography>
              Pet Owner: {petowner.firstname} {petowner.lastname}
            </Typography>
            <Stack flexDirection="row">
              <Stack sx={{ marginRight: "10px" }}>
                <Typography>Pet Name: {pet.name}</Typography>
                <Typography>Birthdate: {pet.birthdate}</Typography>
                <Typography>Gender: {pet.gender}</Typography>
              </Stack>
              <Stack>
                <Typography>Specie: {specie.specie}</Typography>
                <Typography>Breed: {breed.breed}</Typography>
                <Typography>Color: {pet.color}</Typography>
              </Stack>
            </Stack>
          </Stack>
          {/* qrcode */}
          <Stack>
            <Box
              sx={{
                ml: 10,
                width: "170px",
                height: "170px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "whitesmoke",
              }}
            >
              <QrCodeGenerator
                qr={qr}
                GenerateQRCode={GenerateQRCode}
                petname={pet.name}
              />
            </Box>
          </Stack>
        </Stack>
        <PetsModal
          open={open}
          onClick={closepopup}
          onClose={closepopup}
          onSubmit={onSubmit}
          breeds={breeds}
          pet={pet}
          setPet={setPet}
          petownerid={pet.petowner_id}
          errors={errors}
          isUpdate={pet.id}
          addImage={pet.id === null}
          handleImage={handleImage}
          selectedSpecie={selectedSpecie}
          handleSpecieChange={handleSpecieChange}
          species={species}
          specie={breed.specie_id}
        />

        <PetImageModal
          open={upload}
          onClick={closepopup}
          onClose={closepopup}
          handleImage={handleImage}
          submitImage={submitImage}
          uploadError={uploadError}
        />

        <PetTabs />
      </Paper>
    </div>
  );
}
