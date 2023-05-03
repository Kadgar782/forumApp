import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'
import React, { useState, useContext  } from "react";
import { Link, } from "react-router-dom";
import { userContext } from "../App.js";
import { postContext } from './PostBlueprint.js';

const style = {
  display: 'flex',
  position: 'relative',
  bgcolor: '#ededed',
  borderBottom: '2px solid #000' ,
  borderTop: '2px solid #000' ,
  flexDirection: 'column',
};

export const CommentFields = ({addingToArray,}) => {

  const [textFieldContentValue, setTextFieldContentValue] = useState("");

  const postId = useContext(postContext);
  const { currentUser } = useContext(userContext);



  // Function for button to create new comment

  const createNewComment = ( textFieldContentValue) => {
    const username = currentUser;
    const body = textFieldContentValue;
    const thumbnailUrl = "https://via.placeholder.com/150/54176f";

    const allData = {username,body,thumbnailUrl,postId}


    const clearContentValue = () => setTextFieldContentValue("");


    // make request to backend

      fetch("http://localhost:5001/api/comments", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(allData)
      })
      .then(response => response.json())
      .then(result => {
        addingToArray(result.result)
        clearContentValue();
      })
      .catch(error => {
        console.error(error);
      });
  }
  
  // //Modal content

  return (
  
    <Box flexGrow={2} sx={style}>
      <TextField
        label="Comment" variant="standard"
        multiline={true}
        value={textFieldContentValue}
        onChange={(newValue) => setTextFieldContentValue(newValue.target.value)}
        sx={{
          width: 1 / 1,
        }}
      ></TextField>
      <Button
        disabled={
          !textFieldContentValue.replace(/\s/g, "").length // button is inactive if the comment field is empty
        }
        component={Link}
        to="/"
        onClick={() => createNewComment(textFieldContentValue)}
      >
        Confirm
      </Button>
    </Box>
   
  );
}