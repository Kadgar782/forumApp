
  export const login = async ( setToken, setCurrentUser, modalStatusChange, allData, username, notify) => { 
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
          notify("error", "")
          throw new Error("Server responds with error!");   
        } 
        // The received tokens from the login are stored in cookies and local storage
          const data = await response.json()
          const token = data.token;
          setToken(token.accessToken);
          setCurrentUser(username);
          localStorage.setItem("user", username);
          localStorage.setItem("token", token.accessToken)  
          notify("success", username)
         } catch  (error) { 
          console.error(error);
          notify("error");
          }
      modalStatusChange();
    }

    
  //Logging out and clearing the local storage
    export const logOut = async (setCurrentUser, notify) =>{
        try {
          const response = await fetch("http://localhost:5001/auth/logout", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (response.status >= 400) {
            notify("error", "");
            throw new Error("Server responds with error!");
          }
        } catch (error) {
          console.error(error);
          notify("error");
        }
        setCurrentUser("");
        localStorage.clear();
      };
    



