import axios from "axios";
import Cookies from "js-cookie"

const axiosPublic = axios.create({
  baseURL: 'http://localhost:8000/api/',
  withCredentials: true
});

const axiosAuthenticated = axios.create({
  baseURL: 'http://localhost:8000/api/',
  withCredentials: true,
})

axiosAuthenticated.interceptors.request.use((config) => {
    const csrfToken = Cookies.get("csrftoken");
    console.log(csrfToken)
    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
    }
    return config
  }
)



export { axiosPublic, axiosAuthenticated }