import {
  Accordion,
  AccordionSummary,
  Typography,
} from "@mui/material";
import { InsideAccordion } from "./InsideAccordion";
import { CommentFields } from "./commentEditor";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useContext, useState  } from "react";
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

  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const postId = useContext(postContext);
  const { currentUser } = useContext(userContext);
  // User is not logged in
  if (userIsLogged === "")
    return (
      <Accordion>
        <AccordionSummary         
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
      <Accordion expanded= {isOpen} onChange={handleToggle}>
        <AccordionSummary            
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
          _id={postId}
          userName={currentUser }
          addingToArray={addingComments}
        />
        <InsideAccordion
          accordionState={isOpen}
          loggedInUser={loggedInUser}
          arrayWithCommentsForPost={arrayWithCommentsForPost}
          setMappedComments={setMappedComments}
          updateComment={updateComment}
          postControls={postControls}
        />
      </Accordion>
    );
};
