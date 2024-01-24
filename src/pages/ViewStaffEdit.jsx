import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { IconButton, Paper, Stack, Typography } from "@mui/material";
import { Edit } from "@mui/icons-material";
import PetOwnerEdit from "../components/modals/PetOwnerEdit";
import UserEdit from "../components/modals/UserEdit";
import Swal from "sweetalert2";
import { useStateContext } from "../contexts/ContextProvider";

export default function ViewStaffEdit() {
  const {staffuser}= useStateContext()
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  const [staff, setStaff] = useState({
    id: null,
    firstname: "",
    lastname: "",
    contact_num: "",
    address_id: null,
    user_id: null,
  });

  const [addressdata, setAddressdata] = useState({
    id: null,
    zipcode_id: null,
    barangay: "",
    zone: "",
  });

  const [userdata, setUserdata] = useState({
    id: null,
    email: "",
    password: "",
    password_confirmation: "",
    role_id: null,
  });

  const [zipcode, setZipcode] = useState({
    id: null,
    area: "",
    province: "",
    zipcode: "",
  });

  const [selectedZipcode, setSelectedZipcode] = useState(null);
  const [zipcodeerror, setZipcodeerror] = useState(null);

  const [openuser, openuserchange] = useState(false);
  const [openStaff, openStaffchange] = useState(false);

  const closepopup = () => {
    openuserchange(false);
    openStaffchange(false);
    getStaff();
  };

  const getStaff = () => {
    setStaff({});
    setAddressdata({});
    setZipcode({});
    setErrors(null);
    setLoading(true);
    setSelectedZipcode(null);

    axiosClient
      .get(`/staffs/${staffuser.id}`)
      .then(({ data }) => {
        setLoading(false);
        setStaff(data);
        setAddressdata(data.address);
        setZipcode(data.address.zipcode);
        setUserdata(data.user);
        setSelectedZipcode(data.address.zipcode.zipcode);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const onEdit = () => {
    getStaff();
    setErrors(null);
    openStaffchange(true);
    getZipcodeDetails(zipcode.zipcode);
  };

  const onEditUSer = () => {
    getStaff();
    setErrors(null);
    openuserchange(true);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setErrors(null);
    setLoading(true);

    const updateStaffPromise = axiosClient.put(`/staffs/${staff.id}`, staff);
    const updateAddressPromise = axiosClient.put(
      `/addresses/${staff.address_id}`,
      addressdata
    );

    Promise.all([updateStaffPromise, updateAddressPromise])
      .then(() => {
        Swal.fire({
          title: "Success",
          text: "Staff information was successfully updated.",
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            setLoading(false);
            openStaffchange(false);
            getStaff();
          }
        });
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      });
  };

  const onSubmitUser = (e) => {
    e.preventDefault();

    setErrors(null);
    axiosClient
      .patch(`/users/${staff.user_id}`, userdata)
      .then(() => {
        openuserchange(false);
        Swal.fire({
          title: "Success",
          text: "User account was successfully updated.",
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            getStaff();
          }
        });
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status == 422) {
          setErrors(response.data.errors);
        }
      });
  };

  useEffect(() => {
    getStaff();
  }, []);

  const getZipcodeDetails = (query) => {
    if (query) {
      setZipcodeerror(null);

      axiosClient
        .get(`/zipcodedetails/${query}`)
        .then(({ data }) => {
          setSelectedZipcode(data.data.zipcode);
          setZipcode(data.data);
          setAddressdata((prevStaff) => ({
            ...prevStaff,
            zipcode_id: data.data.id,
          }));
        })
        .catch((error) => {
          const response = error.response;
          if (response && response.status === 404) {
            setZipcodeerror(response.data.message);
          }
        });
    }
  };

  const handleZipcodeChange = (event) => {
    setSelectedZipcode(zipcode.zipcode);
    setSelectedZipcode(event.target.value);
  };

  useEffect(() => {
    let timerId;

    clearTimeout(timerId);

    timerId = setTimeout(() => {
      setZipcodeerror(null);
      getZipcodeDetails(selectedZipcode);
    }, 2000);

    return () => clearTimeout(timerId);
  }, [selectedZipcode]);

  return (
    <Paper
      sx={{
        minWidth: "90%",
        padding: "10px",
        margin: "10px",
      }}
    >
      <Stack flexDirection="row">
        <Stack p={2}>
          <Typography variant="h5">
            Staff Information{" "}
            <IconButton
              variant="contained"
              color="info"
              onClick={() => onEdit()}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Typography>
          <Typography>
            Name: {staff.firstname} {staff.lastname}
          </Typography>
          <Typography>
            Address: {addressdata.zone}, {addressdata.barangay}, {zipcode.area},{" "}
            {zipcode.province}, {zipcode.zipcode}
          </Typography>
          <Typography>Contact Number: +63{staff.contact_num}</Typography>
        </Stack>

        <Stack p={2}>
          <Typography variant="h5">
            User Account{" "}
            <IconButton
              variant="contained"
              color="info"
              onClick={() => onEditUSer()}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Typography>
          <Typography>Email: {userdata.email} </Typography>
        </Stack>
      </Stack>
      <PetOwnerEdit
        open={openStaff}
        onClose={closepopup}
        onClick={closepopup}
        onSubmit={onSubmit}
        loading={loading}
        petowner={staff}
        setPetowner={setStaff}
        address={addressdata}
        setAddress={setAddressdata}
        errors={errors}
        isUpdate={staffuser.id}
        zipcode={zipcode}
        selectedZipcode={selectedZipcode}
        handleZipcodeChange={handleZipcodeChange}
        zipcodeerror={zipcodeerror}
      />
      <UserEdit
        open={openuser}
        onClick={closepopup}
        onClose={closepopup}
        onSubmit={onSubmitUser}
        loading={loading}
        roles={[]}
        user={userdata}
        setUser={setUserdata}
        errors={errors}
        isUpdate={userdata.id}
      />
    </Paper>
  );
}
