import axios from "axios";
import Swal from "sweetalert2";

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("ACCESS_TOKEN");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const csrfToken = localStorage.getItem("CSRF_TOKEN");
  if (csrfToken) {
    config.headers["X-CSRF-Token"] = csrfToken;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    if (response && response.status === 401) {
      localStorage.removeItem("ACCESS_TOKEN");
    } else if (!response) {
      // Show error alert for network issues or unexpected responses
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error,
        confirmButtonText: "Reload",
      }).then((result) => {
        // Check if the "Reload" button was clicked
        if (result.isConfirmed) {
          // Reload the page
          location.reload();
        }
      });
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
