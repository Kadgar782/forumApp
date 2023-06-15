import { AccordionDetails, Typography } from "@mui/material";
import React from "react";
import {Comment} from "./Comment"

export const InsideAccordion = ({
  arrayWithCommentsForPost,
  setComments,
  updateComment,
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