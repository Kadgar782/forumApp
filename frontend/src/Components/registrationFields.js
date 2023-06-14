import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import React, { useState, forwardRef } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "20rem",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export const RegistrationFields = forwardRef(
  ({ addingToArray, modalStatusChange }, ref) => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const isPasswordTooShort = password.length < 6 & password.length !== 0;
    const isPasswordTooLong = password.length > 20;

    // Function for button
    const registrationNewUser = (email, username, password) => {
      const allData = { email, username, password };

      const clearEmailValue = () => setEmail("");
      const clearUsernameValue = () => setUsername("");
      const clearPasswordValue = () => setPassword("");

      clearEmailValue();
      clearUsernameValue();
      clearPasswordValue();

      // make request to backend

      fetch("http://localhost:5001/auth/registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(allData),
      })
        .then((response) => response.json())
        .then((result) => {
          addingToArray(result.result);
        })
        .catch((error) => {
          console.error(error);
        });

      modalStatusChange();
    };

    //Modal content

    return (
      <Box sx={style} ref={ref}>
        <TextField
          autoFocus
          label="Email"
          value={email}
          multiline={true}
          onChange={(newValue) => setEmail(newValue.target.value)}
          sx={{
            marginBottom: 1,
            width: 5 / 6,
          }}
        ></TextField>
        <TextField
          label="Username"
          value={username}
          multiline={true}
          onChange={(newValue) => setUsername(newValue.target.value)}
          sx={{
            marginBottom: 1,
            width: 5 / 6,
          }}
        ></TextField>
        <TextField
          label="Password"
          helperText={
            isPasswordTooShort
              ? "Password is too short"
              : isPasswordTooLong
              ? "Password is too long"
              : ""
          }
          error={isPasswordTooShort || isPasswordTooLong}
          multiline={true}
          value={password}
          onChange={(newValue) => setPassword(newValue.target.value)}
          sx={{
            width: 5 / 6,
          }}
        ></TextField>
        <Button
          disabled={
            !email.replace(/\s/g, "").length ||
            !username.replace(/\s/g, "").length ||
            !password.replace(/\s/g, "").length
          }
          onClick={() => registrationNewUser(email, username, password)}
        >
          Confirm
        </Button>
      </Box>
    );
  }
);
