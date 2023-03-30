// hooks.js
import { useState, useEffect } from "react";
 
const axios = require('axios').default;

export const useApiRequest = url => {
  const [data, setData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      axios
        .get(url)
        .then(response => {
          setIsLoaded(true);
          setData(response.data);
        })
        .catch(error => {
          setError(error);
        });
    };
    fetchData();
  }, [url]);

  return { error, isLoaded, data };
};
