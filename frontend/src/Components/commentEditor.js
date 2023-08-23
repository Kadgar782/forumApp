import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'
import React, { useState, useContext  } from "react";
import { userContext } from "../App.js";
import { postContext } from './PostBlueprint.js';
import { toast } from "react-toastify";
import {createNewComment} from  '../http/comments';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { refreshTokens } from '../http/interceptor.js';

const style = {
  display: 'flex',
  position: 'relative',
  bgcolor: '#ededed',
  borderBottom: '2px solid #000' ,
  borderTop: '2px solid #000' ,
  flexDirection: 'column',
};

export const CommentFields = ({postIdFromSinglePost}) => {

  const [textFieldContentValue, setTextFieldContentValue] = useState("");

  const { currentUser, } = useContext(userContext);
  let postId = useContext(postContext);
  
  if (postId === "without provider"){
    postId = postIdFromSinglePost
  }

  const username = currentUser;
  const body = textFieldContentValue;
  const thumbnailUrl = "https://via.placeholder.com/150/54176f";

  const allData = {username,body,thumbnailUrl,postId}

  const queryClient = useQueryClient();
  const createCommentMutation = useMutation({
    mutationFn: (allData) => createNewComment(allData),
    onSuccess: (data) => {
      queryClient.setQueryData(["comments", data._id], data);
      queryClient.setQueryData(["singlePostComments", data._id], data);
      queryClient.invalidateQueries(["comments", postId], {
        exact: true,
      });
      queryClient.invalidateQueries(["singlePostComments", postId], {
        exact: true,
      });
      toast.success("Comment was published");
      setTextFieldContentValue("");
    },
    onError: () => {
      refreshTokens();
      toast.error("Something went wrong");
    },
  });

  // Function for button to create new comment

  const createComment= () =>{
    createCommentMutation.mutate({allData})
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
        onClick={() => createComment()}
      >
        Confirm
      </Button>
    </Box>
   
  );
}