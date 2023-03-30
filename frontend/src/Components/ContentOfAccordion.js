import { AccordionDetails, Typography, Avatar, IconButton } from "@mui/material";
import React from "react";
import { Comment } from "./Comment";




export const InsideAccordion = ({ arrayWithCommentsForPost, setMappedComments,updateComment, loggedInUser, postControls, }) => {

  if (!Array.isArray(arrayWithCommentsForPost) || !arrayWithCommentsForPost.length)
    return <AccordionDetails></AccordionDetails>;
  else
    return arrayWithCommentsForPost.map((commentStuff) => {
      const {_id, body, postId} = commentStuff
      return (
        <Comment
          postControls={postControls}
          loggedInUser={loggedInUser}
          commentId={_id}
          commentBody={body}
          postId={postId}
          updateComment={updateComment}
          setMappedComments={setMappedComments}
          arrayWithCommentsForPost={arrayWithCommentsForPost}
        />
      );
    });
};
