import { InputAdornment, TextField, IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import React, { useState, forwardRef } from "react";
import { login } from "./authFunctions";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

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

export const LoginFields = forwardRef(
  ({ setCurrentUser, modalStatusChange }, ref) => {
    const [tfHeaderValue, setTFHeaderValue] = useState("");
    const [tfContentValue, setTFContentValue] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
      setShowPassword(!showPassword);
    };

    // Function for button to login
    const loginUser = async (upperValue, loverValue) => {
      const username = upperValue;
      const password = loverValue;

      const allData = { username, password };

      const clearHeaderValue = () => setTFHeaderValue("");
      const clearContentValue = () => setTFContentValue("");

      clearHeaderValue();
      clearContentValue();
      
      // make request to backend
      login(
        setCurrentUser,
        modalStatusChange,
        allData,
        username,
      );
    };

    //Modal content

    return (
      <Box sx={style} ref={ref}>
        <TextField
          autoFocus
          label="Username"
          value={tfHeaderValue}
          type="text"
          name="username"
          autoComplete="username"
          onChange={(newValue) => setTFHeaderValue(newValue.target.value)}
          sx={{
            marginBottom: 1,
            width: 5 / 6,
          }}
        />
        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          value={tfContentValue}
          name="current-password"
          onChange={(newValue) => setTFContentValue(newValue.target.value)}
          //here we add a button to display the password so that the user can make sure what he has entered in the field
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePassword} edge="end">
                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            width: 5 / 6,
          }}
        />
        <Button
          disabled={
            !tfHeaderValue.replace(/\s/g, "").length ||
            !tfContentValue.replace(/\s/g, "").length
          }
          onClick={() => loginUser(tfHeaderValue, tfContentValue)}
        >
          Confirm
        </Button>
      </Box>
    );
  }
);
