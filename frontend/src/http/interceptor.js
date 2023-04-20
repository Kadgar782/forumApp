import axios from "axios";

export const API_URL = `http://localhost:5001/`;

const interceptor = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

interceptor.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config;
})

interceptor.interceptors.response.use(
  (config) => {
    return config;
  },

  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 404 && error.config && !error.config._isRetry
    ) {
      originalRequest._isRetry = true;
      try {
        const response = await axios.get (`${API_URL}auth/refresh`, { withCredentials: true });
        localStorage.setItem("token", response.data.accessToken);
        return interceptor.request(originalRequest);
      } catch (e) {
        console.log("The user is not logged in");
      }
    }
    throw error;
  }
);

export default interceptor;


