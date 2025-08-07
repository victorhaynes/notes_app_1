import axios from "axios";
import Cookies from "js-cookie"

const axiosPublic = axios.create({
  baseURL: 'http://localhost:8000/api/',
  withCredentials: true
});

const axiosSecure = axios.create({
  baseURL: 'http://localhost:8000/api/',
  withCredentials: true,
})

axiosSecure.interceptors.request.use((config) => {
    const csrfToken = Cookies.get("csrftoken");
    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
    }
    return config
  }
)



export { axiosPublic, axiosSecure }