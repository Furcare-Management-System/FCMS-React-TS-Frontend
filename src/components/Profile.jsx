import React, { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Stack from "@mui/material/Stack";
import { Avatar, Divider, Menu, Typography } from "@mui/material";
import { useStateContext } from "../contexts/ContextProvider";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axiosClient from "../axios-client";
import UserEdit from "./modals/UserEdit";
import Swal from "sweetalert2";

export default function Profile() {
  const { user, setToken, updateUser, staffuser } = useStateContext();
  const navigate = useNavigate();

  //for modal
  const [errors, setErrors] = useState(null);
  const [loading, setloading] = useState(false);

  const [userprofile, setUserprofile] = useState({
    id: null,
    email: "",
    password: "",
    password_confirmation: "",
    role_id: null,
  });

  const [openchange, setopenchange] = useState(false);

  const [roles, setRoles] = useState([]);

  //for menuitem

  const logoutmodal = () => {
    setAnchorEl(null);
    Swal.fire({
      icon: "question",
      title: "Do you want to logout?",
      showDenyButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosClient.post(`/logout/${user.id}`).then(() => {
          setToken(null);
          updateUser({});
          navigate("/login");
        });
      }
    });
  };

  const closepopup = () => {
    setopenchange(false);
  };

  const getUser = () => {
    setloading(true);
    axiosClient
      .get(`/users/${user.id}`)
      .then(({ data }) => {
        setUserprofile(data);
        setloading(false);
      })
      .catch(() => {
        setloading(false);
      });
  };

  const onEdit = () => {
    setErrors(null);
    setopenchange(true);
    getUser();
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (userprofile.id) {
      axiosClient
        .patch(`/users/${userprofile.id}`, userprofile)
        .then((response) => {
          setopenchange(false);
          updateUser(response.data);
          window.location.reload(false);
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post(`/users`, userprofile)
        .then(() => {
          // setNotification("User was successfully created");
          setopenchange(false);
          // getUsers();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Stack direction="row" spacing={2}>
      <div>
        <Button
          onClick={handleClick}
        >
          <Avatar sx={{ width: 30, height: 30, margin: "5px" }} />
          {staffuser && (
            <Typography
              variant="span"
              color="white"
              sx={{ display: { xs: "none", md: "block" } }}
            >
              {staffuser.firstname && staffuser.lastname !== "null"
                ? `${staffuser.firstname} ${staffuser.lastname}`
                : "ADMIN"}
            </Typography>
          )}
        </Button>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          sx={{ width: "50%", height: "70%",
         }}
        >
          {staffuser && (
            <MenuItem
              variant="span"
              color="white"
              sx={{ display: { md: "none" } }}
            >
              {staffuser.firstname && staffuser.lastname !== "null"
                ? `${staffuser.firstname} ${staffuser.lastname}`
                : "ADMIN"}
            </MenuItem>
          )}
          <Divider sx={{ display: { md: "none" } }} />
          {user.role_id === "1" && [
            <MenuItem key="edit" onClick={onEdit}>
              Edit Account
            </MenuItem>,
            <MenuItem
              key="settings"
              onClick={() => navigate("/admin/settings")}
            >
              Settings
            </MenuItem>,
          ]}
          {user.role_id === "2" && [
            <MenuItem
              key="profile"
              onClick={() => navigate("/admin/myprofile")}
            >
              Profile
            </MenuItem>,
          ]}
          {user.role_id === "3" && [
            <MenuItem
              key="petProfile"
              onClick={() => navigate("/petowner/myprofile")}
            >
              Profile
            </MenuItem>,
          ]}
          <MenuItem onClick={logoutmodal} key="logout">
            Logout
          </MenuItem>
        </Menu>
      </div>
      <UserEdit
        open={openchange}
        onClick={closepopup}
        onClose={closepopup}
        onSubmit={onSubmit}
        loading={loading}
        roles={roles}
        user={userprofile}
        setUser={setUserprofile}
        errors={errors}
        isUpdate={userprofile.id}
      />
    </Stack>
  );
}
