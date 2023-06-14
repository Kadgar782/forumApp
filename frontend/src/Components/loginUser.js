import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import React, { useState, forwardRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { login } from "./authentication/authFunctions";

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


export const LoginFields =  forwardRef(({
  setToken,
  setCurrentUser,
  modalStatusChange,
}, ref) => {
  const [tfHeaderValue, setTFHeaderValue] = useState("");
  const [tfContentValue, setTFContentValue] = useState("");

  // Function for button to login
  const loginUser =  async (upperValue, loverValue) => {
    const username = upperValue;
    const password = loverValue;

    const allData = { username, password };

    const clearHeaderValue = () => setTFHeaderValue("");
    const clearContentValue = () => setTFContentValue("");

    clearHeaderValue();
    clearContentValue();

    //Toast notify
    const notify = (status, username) => {
      switch (status) {
        case "success":
          toast.success(`you have successfully logged in as ${username}`);
          break;
        case "error":
          toast.error("Something went wrong during login");
          break;
        default:
          break;
      }
    };

    // make request to backend
    login(setToken, setCurrentUser, modalStatusChange, allData, username, notify)   
  };
  

  //Modal content

  return (
    <Box sx={style} ref={ref}>
      <TextField
        autoFocus
        label="Username"
        value={tfHeaderValue}
        multiline={true}
        onChange={(newValue) => setTFHeaderValue(newValue.target.value)}
        sx={{
          marginBottom: 1,
          width: 5 / 6,
        }}
      ></TextField>
      <TextField
        label="Password"
        multiline={true}
        value={tfContentValue}
        onChange={(newValue) => setTFContentValue(newValue.target.value)}
        sx={{
          width: 5 / 6,
        }}
      ></TextField>
      <Button
        disabled={
          !tfHeaderValue.replace(/\s/g, "").length ||
          !tfContentValue.replace(/\s/g, "").length
        }
        onClick={() => loginUser(tfHeaderValue, tfContentValue)}
      >
        Confirm
      </Button>
      <div>
          <ToastContainer />
        </div>
    </Box>
  );
});
