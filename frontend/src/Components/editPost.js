import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import React, { useState, forwardRef } from "react";
import { toast } from "react-toastify";
import { editCurrentPost } from "../http/posts";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { refreshTokens } from "../http/interceptor";
import "react-toastify/dist/ReactToastify.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 750,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export const EditPostFields = forwardRef(({
  specificId,
  allPosts,
  modalStatusChange,
},ref) => {
  let thePost = allPosts.find((post) => post._id === specificId);

  const navigate = useNavigate();

  const [title, setTitle] = useState(thePost.title);
  const [body, setBody] = useState(thePost.body);

  const _id = specificId;


  const updatedPost = {
    _id,
    title,
    body,
  };

//Edit mutation
const queryClient = useQueryClient();
  const editPostMutation = useMutation({
    mutationFn: (updatedPost) => editCurrentPost(updatedPost),
    onSuccess: (data) => {
      console.log(data);
      queryClient.setQueryData(["responsePosts", data._id], data);
      queryClient.invalidateQueries(["post", _id], {
        exact: true,
      });
      queryClient.invalidateQueries(["responsePosts", "infinite"], {
        exact: true,
      });
      toast.success("you have successfully edited post");
      modalStatusChange();
      navigate(`/${data._id}`);
    },
    onError: () => {
      refreshTokens();
      toast.error("Something went wrong");
    },
  });


  // Function for button
  const handleSubmit = async() => {
    editPostMutation.mutate({updatedPost})
  };
  //Modal content

  return (
    // we have two fields for topic and content of post
    <Box sx={style}  ref={ref}>
      <TextField
        autoFocus
        label="the topic of the post"
        value={title}
        multiline={true}
        onChange={(newValue) => setTitle(newValue.target.value)}
        sx={{
          marginBottom: 1,
          width: 5 / 6,
        }}
      ></TextField>
      <TextField
        label="content"
        multiline={true}
        value={body}
        onChange={(newValue) => setBody(newValue.target.value)}
        sx={{
          width: 1 / 1,
        }}
      ></TextField>
      <Button
        disabled={
          // User can't leave fields empty
          !title.replace(/\s/g, "").length || !body.replace(/\s/g, "").length
        }
        onClick={() => handleSubmit()}
      >
        Confirm
      </Button>
    </Box>
  );
});
