import Echo from "laravel-echo";
import Pusher from "pusher-js";

const token = localStorage.getItem("ACCESS_TOKEN");

const echo = new Echo({
  broadcaster: "pusher",
  key: "3c03e4699b6d84bed23b",
  cluster: "ap1",
  encrypted: true,
  forceTLS: true,
  authEndpoint: "http://localhost:8000/broadcasting/auth",
  auth: {
    headers: {
      Authorization: "Bearer " + token,
      // Add your access token here
      Aacept: "application/json",
    },
  },
  // bearerToken: token,
});

export default echo;
