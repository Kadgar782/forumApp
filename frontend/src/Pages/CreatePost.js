import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { FormGroup } from "@mui/material";
import React, { useState, } from "react";
import { toast } from "react-toastify";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createNewPost } from "../http/posts";
import "react-toastify/dist/ReactToastify.css";
import { refreshTokens } from "../http/interceptor";

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

export const PostFields = ({ userName }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const username = userName;
  const thumbnailUrl = "https://via.placeholder.com/150/54176f";
  const commentsInPost = {};
  const allData = { username, title, body, thumbnailUrl, commentsInPost };
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const createPostMutation = useMutation({
    mutationFn: (allData) => createNewPost(allData),
    onSuccess: (data) => {
      queryClient.setQueryData(["responsePosts", data._id], data);
      queryClient.invalidateQueries(["responsePosts", "infinite"], {
        exact: true,
      });
      toast.success("Post was published");
      navigate(`/${data._id}`);
    },
    onError: () => {
      refreshTokens();
      toast.error("Something went wrong, try refreshing the page or checking your internet connection");
    },
  });
  function handleSubmit(e) {
    e.preventDefault();
    createPostMutation.mutate({ allData });
  }

  //Modal content

  return (
    <div>
      <form method="post" onSubmit={handleSubmit}>
        <Box sx={style}>
          <FormGroup>
            <TextField
              label="the topic of the post"
              inputProps={{ maxLength: 170 }}
              multiline={true}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              sx={{
                marginBottom: 1,
                width: 1 / 1,
              }}
            ></TextField>
            <TextField
              label="content"
              multiline={true}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              sx={{
                width: 1 / 1,
              }}
            ></TextField>
            <Button
              type="submit"
              disabled={
                !title.replace(/\s/g, "").length ||
                !body.replace(/\s/g, "").length
              }
            >
              Confirm
            </Button>
          </FormGroup>
        </Box>
      </form>
    </div>
  );
};
