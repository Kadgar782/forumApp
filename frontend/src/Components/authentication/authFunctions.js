import { toast } from "react-toastify";

  export const login = async ( setCurrentUser, modalStatusChange, allData, username, ) => { 
        // make request to backend
        try {

           const response = await fetch("http://localhost:5001/auth/login", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(allData), //username and password
        });
        if (response.status >= 400) {
          toast.error("Something went wrong");
          throw new Error("Server responds with error!");   
        } 
        // The received tokens from the login are stored in cookies and local storage
          const data = await response.json()
          const token = data.token;
          setCurrentUser(username);
          localStorage.setItem("user", username);
          localStorage.setItem("token", token.accessToken)  
          toast.success(`You have successfully logged in as ${username} `);
         } catch  (error) { 
          console.error(error);
          toast.error("Something went wrong");
          }
      modalStatusChange();
    }

    
  //Logging out and clearing the local storage
    export const logOut = async (setCurrentUser) =>{
        try {
          const response = await fetch("http://localhost:5001/auth/logout", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (response.status >= 400) {
            toast.error("Something went wrong");
            throw new Error("Server responds with error!");
          }
        } catch (error) {
          console.error(error);
          toast.error("Something went wrong");
        }
        setCurrentUser("");
        localStorage.clear();
      };
    



