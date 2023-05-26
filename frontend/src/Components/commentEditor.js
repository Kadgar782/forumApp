import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'
import React, { useState, useContext  } from "react";
import { Link, } from "react-router-dom";
import { userContext } from "../App.js";
import { postContext } from './PostBlueprint.js';
import { ToastContainer, toast } from "react-toastify";
import Interceptor from '../http/interceptor.js';

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
  const { currentUser, setCurrentUser } = useContext(userContext);



  // Function for button to create new comment

  const createNewComment = async ( textFieldContentValue) => {
    const username = currentUser;
    const body = textFieldContentValue;
    const thumbnailUrl = "https://via.placeholder.com/150/54176f";

    const allData = {username,body,thumbnailUrl,postId}
    const clearContentValue = () => setTextFieldContentValue("");

    const notify = (status) => {
      switch (status) {
        case "success":
          toast.success("Comment was published");
          break;
        case "error":
          toast.error("Something went wrong");
          break;
        default:
          break;
      }
    };

    // make request to backend
    try {
      const interceptor = new Interceptor(
        setCurrentUser,
        notify,
      );
      const response = await interceptor.post("http://localhost:5001/api/comments", allData, )
      if (response.status >= 400) {
        throw new Error("Server responds with error!");
      }
      const newItem = response.data.result;
      notify("success");
      addingToArray(newItem)
      clearContentValue();
    } catch (error) {
      console.error(error);
      notify("error");
    }
  
  
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
      <ToastContainer />
    </Box>
   
  );
}