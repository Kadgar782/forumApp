import { MuiAccordion } from "./MUIAccordion.js";
import { CommentFields } from "./commentEditor";
import React, { useContext } from "react";
import { postContext } from "./PostBlueprint";
import { userContext } from "../App.js";

export const CommentSchema = ({
  loggedInUser,
  addingComments,
  arrayWithCommentsForPost,
  setMappedComments,
  updateComment,
  postControls,
}) => {

  const postId = useContext(postContext);
  const username = useContext(userContext);

  // We only return post if it has no comments and is watched by an unauthorized person

  if (
    (!arrayWithCommentsForPost?.length || arrayWithCommentsForPost === undefined) &&
    loggedInUser === ""
  )
    return "";
  //If user is logged in, but post has no comments, we return field for entering comments
  else if (
    (!arrayWithCommentsForPost?.length || arrayWithCommentsForPost === undefined) &&
    loggedInUser !== ""
  )
    return (
      <CommentFields
        _id={postId}
        userName={username}
        addingToArray={addingComments}
      />
    );
  // Otherwise, we return accordion with comments and a field for entering comments
  else
    return (
      <MuiAccordion
        postControls={postControls}
        loggedInUser={loggedInUser}
        updateComment={updateComment}
        userIsLogged={loggedInUser}
        arrayWithCommentsForPost={arrayWithCommentsForPost}
        setMappedComments={setMappedComments}
        MuiAddingComments={addingComments}
      />
    );
};
