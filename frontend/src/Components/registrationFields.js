import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'
import React, { useState,  } from "react";


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 750,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export const RegistrationFields = ({addingToArray, modalStatusChange}) => {

  const [tfHeaderValue,setTFHeaderValue ] = useState("");
  const [tfContentValue, setTFContentValue] = useState("");


  // Function for button
  const registrationNewUser = (username, password) => {


    const allData = {username, password }

    const clearHeaderValue = () => setTFHeaderValue("");
    const clearContentValue = () => setTFContentValue("");

    clearHeaderValue();
    clearContentValue();

    // make request to backend
   
      fetch("http://localhost:5001/auth/registration", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(allData)
      })
      .then(response => response.json())
      .then(result => {
        addingToArray(result.result)
      })
      .catch(error => {
        console.error(error);
      });

    

  

    modalStatusChange();
  }
  
  //Modal content

  return (
    <Box sx={style}>
      <TextField  label="Username" value={tfHeaderValue} multiline={true}
        onChange={(newValue) => setTFHeaderValue(newValue.target.value)}
        sx={{
          marginBottom: 1,
          width: 5 / 6,
        }}>
      </TextField>
      <TextField  label="Password" multiline={true} value={tfContentValue}
        onChange={(newValue) => setTFContentValue(newValue.target.value)}
        sx={{
          width: 1 / 1,
        }}>
      </TextField>
      <Button disabled={(!tfHeaderValue.replace(/\s/g, '').length) || (!tfContentValue.replace(/\s/g, '').length)} onClick={()=>registrationNewUser(tfHeaderValue, tfContentValue)}>Confirm</Button>
    </Box>
  )
}