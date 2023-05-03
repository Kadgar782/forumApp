import { AccordionDetails } from "@mui/material";
import React from "react";
import {Comment} from "./Comment"

export const InsideAccordion = ({
  arrayWithCommentsForPost,
  setMappedComments,
  updateComment,
  currentUser,
  postControls,
}) => {

  const commentsExist = Array.isArray(arrayWithCommentsForPost) && arrayWithCommentsForPost.length > 0;

  // const Comment = lazy(() => import("./Comment"));

  return commentsExist ? (
    arrayWithCommentsForPost.map((commentStuff) => {
      const { _id, body, postId } = commentStuff;
      return (
        // <Suspense fallback={<div>Loading comments...</div>}>
          <Comment
            key={_id}
            postControls={postControls}
            currentUser={currentUser}
            commentId={_id}
            commentBody={body}
            postId={postId}
            updateComment={updateComment}
            setMappedComments={setMappedComments}
            arrayWithCommentsForPost={arrayWithCommentsForPost}
          />
        // </Suspense>
      );
    })
  ) : (
    <AccordionDetails  
      sx={{ 
      padding: 0,
    }}
    />
  );
};