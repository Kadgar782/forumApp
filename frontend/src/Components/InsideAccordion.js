import { AccordionDetails, Typography } from "@mui/material";
import React from "react";
import {Comment} from "./Comment"

export const InsideAccordion = ({
  arrayWithCommentsForPost,
  setComments,
  updateComment,
  currentUser,
  postControls,
}) => {

  const commentsExist = Array.isArray(arrayWithCommentsForPost) && arrayWithCommentsForPost.length > 0;


  return commentsExist ? (
    arrayWithCommentsForPost.map((commentStuff) => {
      const { _id, body, postId } = commentStuff;
      return (
          <Comment
            key={_id}
            postControls={postControls}
            currentUser={currentUser}
            commentId={_id}
            commentBody={body}
            postId={postId}
            updateComment={updateComment}
            setComments={setComments}
            arrayWithCommentsForPost={arrayWithCommentsForPost}
          />
      );
    })
  ) : (
    <AccordionDetails  
      sx={{ 
        padding: 0,
        backgroundColor: "#cbcccc",
    }}
    >
     <Typography> No comments yet</Typography> 
    </AccordionDetails>
  );
};