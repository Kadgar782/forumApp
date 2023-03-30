import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Divider,
  Avatar,
} from "@mui/material";
import { InsideAccordion } from "./ContentOfAccordion";
import { CommentFields } from "./commentEditor";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useContext } from "react";
import { postContext } from "./PostBlueprint";
import { userContext } from "../App.js";

export const MuiAccordion = ({
  updateComment,
  MuiAddingComments,
  arrayWithCommentsForPost,
  userIsLogged,
  setMappedComments,
  loggedInUser,
  postControls,
}) => {
  const postId = useContext(postContext);
  const username = useContext(userContext);
  if (userIsLogged === "")
    return (
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            backgroundColor: "#cbcccc",
            borderBottom: 1,
          }}
        >
          <Typography>Comments</Typography>
        </AccordionSummary>
        <InsideAccordion
          loggedInUser={loggedInUser}
          arrayWithCommentsForPost={arrayWithCommentsForPost}
          setMappedComments={setMappedComments}
          updateComment={updateComment}
        />
      </Accordion>
    );
  else
    return (
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            backgroundColor: "#cbcccc",
            borderBottom: 1,
          }}
        >
          <Typography>Comments</Typography>
        </AccordionSummary>
        <CommentFields
          _id={postId}
          userName={username}
          addingToArray={MuiAddingComments}
        />
        <InsideAccordion
          loggedInUser={loggedInUser}
          arrayWithCommentsForPost={arrayWithCommentsForPost}
          setMappedComments={setMappedComments}
          updateComment={updateComment}
          postControls={postControls}
        />
      </Accordion>
    );
};
