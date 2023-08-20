import {
  AccordionDetails,
  Typography,
  Avatar,
  IconButton,
  Button,
} from "@mui/material";
import { Divider } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Textarea from "@mui/joy/Textarea";
import React, { useContext, useState, } from "react";
import { toast } from "react-toastify";
import { userContext } from "../App.js";
import { removeComment, editCurrentComment } from "../http/comments";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { refreshTokens } from "../http/interceptor";
import "react-toastify/dist/ReactToastify.css";

export function Comment({
  arrayWithCommentsForPost,
  commentId,
  commentBody,
  postId,
  postControls,
}) {

  let comment = arrayWithCommentsForPost.find(
    (comment) => comment._id === commentId
  );

  const [isEditable, setIsEditable] = useState(false);
  const [body, setBody] = useState(comment.body);
  const {currentUser} = useContext(userContext)

  const queryClient = useQueryClient();

 // Comment data
  const username = comment.username;
  const thumbnailUrl = "https://via.placeholder.com/150/54176f";
  const _id = commentId;
  const updatedComment = { _id, body, thumbnailUrl, postId, username };

  //editing
  const turnEditMode = () => {
    setIsEditable(!isEditable);
  };
 // Delete comment
  const deleteCommentMutation = useMutation({
    mutationFn: (_id) => removeComment(_id),
    retry: 1,
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", postId], {
        exact: true,
      });
      toast.success("Comment was deleted");
    },
    // if an error happened, then either user has no rights or tokens are outdated
    onError: (error) => {
      refreshTokens();
      toast.error("Something went wrong");
      console.log(error);  
    },
  });

  const deleteComment = async (_id) => {
    deleteCommentMutation.mutate(_id);
  };

//Edit comment
const editCommentMutation = useMutation({
  mutationFn: (updatedComment) => editCurrentComment(updatedComment),
  retry: 1,
  onSuccess: () => {
    queryClient.invalidateQueries(["comments", postId], {
      exact: true,
    });
    toast.success("Comment has been edited");
    turnEditMode();
  },
  // if an error happened, then either user has no rights or tokens are outdated
  onError: (error) => {
    refreshTokens();
    toast.error("Something went wrong");
    console.log(error);
  },
});

const editComment = async () => {
  editCommentMutation.mutate(updatedComment);
};

  if (postControls === true || username === currentUser) {
    //Return if user is admin or author of comment
    return (
      <AccordionDetails
        key={_id}
        sx={{
          padding: 0,
          backgroundColor: "#cbcccc",
        }}
      >
        <span>
          <Avatar
            alt="Placeholder"
            src={thumbnailUrl}
            variant="rounded"
            sx={{
              maxWidth: 35,
              maxHeight: 35,
              marginRight: 0.5,
            }}
          />
          {username}

          <IconButton
            aria-label="delete"
            disableRipple
            onClick={() => deleteComment(_id)}
          >
            <DeleteIcon />
          </IconButton>

          <IconButton
            aria-label="Edit"
            disableRipple
            id={_id}
            onClick={() => turnEditMode()}
          >
            <EditIcon />
          </IconButton>
        </span>
        {isEditable ? ( //true
          <div style={{ display: "flex", alignItems: "center" }}>
            <Textarea
              size="md"
              className="inputField"
              value={body}
              onChange={(newValue) => setBody(newValue.target.value)}
            >
              {" "}
            </Textarea>
            <Button onClick={() => editComment()}>Done</Button>
            <Button onClick={() => turnEditMode()}>Cancel</Button>
          </div>
        ) : (
          <Typography id={_id}> {commentBody}</Typography>
        )}

        <Divider sx={{ border: 1 }} />
      </AccordionDetails>
    );
  } else {
    //Return if user is not admin or author
    return (
      <AccordionDetails
        key={_id}
        sx={{
          padding: 0,
          backgroundColor: "#cbcccc",
        }}
      >
        <span>
          <Avatar
            alt="Placeholder"
            src={thumbnailUrl}
            variant="rounded"
            sx={{
              maxWidth: 35,
              maxHeight: 35,
              marginRight: 0.5,
            }}
          />
          {username}
        </span>
          <Typography id={_id}> {commentBody}</Typography>
        <Divider sx={{ border: 1 }} />
      </AccordionDetails>
    );
  }
}
