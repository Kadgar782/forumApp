import {
  Accordion,
  AccordionSummary,
  Typography,
} from "@mui/material";
import { InsideAccordion } from "./InsideAccordion";
import { CommentFields } from "./commentEditor";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useContext } from "react";
import { postContext } from "./PostBlueprint";
import { userContext } from "../App.js";

export const MuiAccordion = ({
  updateComment,
  addingComments,
  arrayWithCommentsForPost,
  userIsLogged,
  setMappedComments,
  loggedInUser,
  postControls,
}) => {
  const postId = useContext(postContext);
  const username = useContext(userContext);
  const halfPostId = postId.slice(postId.length / 2)
  const quarterId = postId.slice(halfPostId.length / 2)
  // User is not logged in
  if (userIsLogged === "")
    return (
      <Accordion>
        <AccordionSummary          // This will be only 1 in post 
          key={postId}
          expandIcon={<ExpandMoreIcon />}
          sx={{
            backgroundColor: "#cbcccc",
            borderBottom: 1,
          }}
        >
          <Typography>Comments</Typography>
        </AccordionSummary>
        <InsideAccordion
          key={halfPostId}
          loggedInUser={loggedInUser}
          arrayWithCommentsForPost={arrayWithCommentsForPost}
          setMappedComments={setMappedComments}
          updateComment={updateComment}
        />
      </Accordion>
    );
  else
  // User is logged in
    return (
      <Accordion>
        <AccordionSummary              // This will be only 1 in post 
          key={postId}
          expandIcon={<ExpandMoreIcon />}
          sx={{
            backgroundColor: "#cbcccc",
            borderBottom: 1,
          }}
        >
          <Typography>Comments</Typography>
        </AccordionSummary>
        <CommentFields
          key={quarterId}
          _id={postId}
          userName={username}
          addingToArray={addingComments}
        />
        <InsideAccordion
          key={halfPostId}
          loggedInUser={loggedInUser}
          arrayWithCommentsForPost={arrayWithCommentsForPost}
          setMappedComments={setMappedComments}
          updateComment={updateComment}
          postControls={postControls}
        />
      </Accordion>
    );
};
