import axios from "axios";
import { logOut } from "../Components/authentication/authFunctions"


const API_URL = process.env.REACT_APP_API_URL

class Interceptor {
   //required parameters
  constructor(setCurrentUser) {  
    this.interceptor = axios.create({
      withCredentials: true,
      baseURL: API_URL,
    });

    this.interceptor.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
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
            const response = await axios.get(`${API_URL}/auth/refresh`, {
              withCredentials: true,
            });
            localStorage.setItem("token", response.data.accessToken);
            return this.interceptor.request(originalRequest);
          } catch (e) {
          //if the server gives us the 404 or 401 status twice, then a logout will happen
            logOut(setCurrentUser);
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

//with the addition of tanstack query, some limitations have appeared due to which I cannot use my usual interceptor, 
//so I will take out the token update function separately.
  const apiForRefresh = axios.create({
    baseURL: API_URL,
    withCredentials: true,
  });
  
  const maxRetryAttempts = 2;
  const retryDelay = 1000; // delay in milliseconds
  
  apiForRefresh.interceptors.request.use((config) => {
    config.retryAttempts = config.retryAttempts || 0;
    return config;
  });
  
  apiForRefresh.interceptors.response.use(undefined, async (error) => {
    const { config, response } = error;
   // check if the status is not authorized or forbidden
    if ((response && response.status === 401) || response.status === 403) {
      // We retry the request only if the number of attempts is less than maxRetryAttempts
      if (config && config.retryAttempts < maxRetryAttempts) {
        const newConfig = {
          ...config,
          retryAttempts: config.retryAttempts + 1,
        };
  
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
  
        // Resending the request with new configuration
        return apiForRefresh(newConfig);
      }
    }
    // If the repeated request attempts are exhausted or the error is not related to the server response, we return an error
    return Promise.reject(error);
  });
// Function for refreshing tokens 
export  const refreshTokens = async () => {
  try {
    const response = await apiForRefresh.get(`${API_URL}/auth/refresh`, {
      withCredentials: true,
    });
    localStorage.setItem("token", response.data.accessToken);
    return response.data.accessToken;
  } catch (error) {
    throw new Error('Failed to refresh access token');
  }
};

export default Interceptor;
