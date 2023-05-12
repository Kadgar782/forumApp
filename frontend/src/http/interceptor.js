import axios from "axios";
import { logOut } from "../Components/authentication/authFunctions";

export const API_URL = `http://localhost:5001/`;

class Interceptor {
   //required parameters
  constructor(setCurrentUser, notify) {  
    this.interceptor = axios.create({
      withCredentials: true,
      baseURL: API_URL,
    });

    this.interceptor.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
      return config;
    });

    this.interceptor.interceptors.response.use(
      (config) => {
        return config;
      },
      //if the server gives us the 404 status twice, then a logout will happen
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response.status === 404 &&
          error.config &&
          !error.config._isRetry
        ) {
          originalRequest._isRetry = true;
          try {
            const response = await axios.get(`${API_URL}auth/refresh`, {
              withCredentials: true,
            });
            localStorage.setItem("token", response.data.accessToken);
            return this.interceptor.request(originalRequest);
          } catch (e) {
            logOut(setCurrentUser, notify);
            console.log("The user is not logged in");
          }
        }
        throw error;
      }
    );
  }

  get(url, config) {
    return this.interceptor.get(url, config);
  }
}

export default Interceptor;
