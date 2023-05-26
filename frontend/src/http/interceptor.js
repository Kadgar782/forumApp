import axios from "axios";
import { logOut } from "../Components/authentication/authFunctions";

export const API_URL = `http://localhost:5001/`;

class Interceptor {
   //required parameters
  constructor(setCurrentUser, notify, ) {  
    this.interceptor = axios.create({
      withCredentials: true,
      baseURL: API_URL,
    });

    this.interceptor.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
      return config;
    });
    // without this we can lose context 
    this.get = this.get.bind(this);
    this.post = this.post.bind(this);
    this.put = this.put.bind(this);
    this.delete = this.delete.bind(this);

    this.interceptor.interceptors.response.use(
      (config) => {
        return config;
      },
      async (error) => {
        const originalRequest = error.config;
        //if we get a 404 or 401 status, then we will try to update the token
        if (
          (error.response.status === 404 &&
          error.config &&
          !error.config._isRetry) ||
          (error.response.status === 401 &&
          error.config &&
          !error.config._isRetry)
        ) {
          originalRequest._isRetry = true;
          try {
            const response = await axios.get(`${API_URL}auth/refresh`, {
              withCredentials: true,
            });
            localStorage.setItem("token", response.data.accessToken);
            return this.interceptor.request(originalRequest);
          } catch (e) {
          //if the server gives us the 404 or 401 status twice, then a logout will happen
            logOut(setCurrentUser, notify, );
            console.log("The user is not logged in");
          }
        }
        throw error;
      }     
    );
  }
  // Functions for http requests
  async get(url, config) {
    return await this.interceptor.get(url, config);
  }

  async post(url, data, config) {
    return await this.interceptor.post(url, data, config);
  }

  async put(url, data, config) {
    return await this.interceptor.put(url, data, config);
  }

  async delete(url, config) {
    return await this.interceptor.delete(url, config);
  }
}

export default Interceptor;
