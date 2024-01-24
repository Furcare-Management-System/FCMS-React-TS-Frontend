import React, { useEffect, useState } from "react";
import { Notifications } from "@mui/icons-material";
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";
import { useNavigate } from "react-router-dom";

const NotifIcon = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user } = useStateContext();
  const [notifs, setNotifs] = useState([]);
  const [count, setCount] = useState([]);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");

  const getNotifications = () => {
    setNotifs([]);
    setMessage(null);
    axiosClient
      .get(`/notifications/${user.id === 2 ? 1 : user.id}`)
      .then(({ data }) => {
        setNotifs(data.data);
      })
      .catch((mes) => {
        const response = mes.response;
        if (response && response.status == 404) {
          setMessage(response.data.message);
        }
      });
  };

  const getNotificationcount = () => {
    setCount([]);
    setMessage(null);
    axiosClient
      .get(`/notifications-count/${user.id === 2 ? 1 : user.id}`)
      .then(({ data }) => {
        setCount(data.count);
      })
      .catch((mes) => {
        const response = mes.response;
        if (response && response.status == 404) {
          setCount(response.data.message);
        }
      });
  };

  const updateNotifs = () => {
    axiosClient
      .post(`/notifications-opened/${user.id === 2 ? 1 : user.id}`)
      .then(() => {
        getNotificationcount();
      })
      .catch((mes) => {
        const response = mes.response;
        if (response && response.status == 404) {
          alert(response.data.message);
        }
      });
  };

  const handleClick = (event) => {
    getNotifications();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    updateNotifs();
  };

  const handleBadgeClick = () => {
    getNotifications();
  };

  const handleDetails = (n) => {
    if (n.type === "Appointment") {
      navigate("/admin/appointments");
    }
  };

  useEffect(() => {
    getNotificationcount();
  }, []);

  return (
    <div>
      <IconButton onClick={handleClick} color="inherit">
        <Badge
          //  badgeContent={anchorEl && count ?  null: count}
          badgeContent={count ? count : null}
          color="primary"
          style={{ color: anchorEl ? "gray" : "inherit" }}
        >
          <Notifications />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{
          width: isMobile ? "100%" : "50%",
          height: "70%",
          // overflowX: "auto",
        }}
      >
        {notifs.map((n) => (
          <MenuItem
            key={n.id}
            value={n.id}
            // onClick={() => handleDetails(n)}
            sx={{
              backgroundColor: n.status === 1 ? "whitesmoke" : null,
              whiteSpace: isMobile ?"normal" :null, // Word wrap
              wordWrap: "break-word", // Word wrap
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: "14px",
              }}
            >
              <strong>{n.type}</strong>
              <span>{n.message}</span>
              <small>
                {n.date}{" "}
                {n.status === 1 && <span style={{ color: "red" }}>•</span>}
              </small>
            </div>
          </MenuItem>
        ))}
        {message && (
          <MenuItem>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: "15px",
                // whiteSpace: "normal", // Word wrap
                wordWrap: "break-word", // Word wrap
              }}
            >
              <span>{message}</span>
            </div>
          </MenuItem>
        )}
      </Menu>
    </div>
  );
};

export default NotifIcon;
