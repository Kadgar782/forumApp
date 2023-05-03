import {
  Accordion,
  AccordionSummary,
  Typography,
} from "@mui/material";
import { InsideAccordion } from "./InsideAccordion";
import { CommentFields } from "./commentEditor";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useContext, } from "react";
import { postContext } from "./PostBlueprint";
import { userContext } from "../App.js";


export const MuiAccordion = ({
  updateComment,
  addingComments,
  arrayWithCommentsForPost,
  setMappedComments,
  postControls,
}) => {


  const postId = useContext(postContext);
  const { currentUser } = useContext(userContext);
  // User is not logged in
  if (currentUser === "")
    return (
      <Accordion>
        <AccordionSummary         
          key={postId}
          expandIcon={<ExpandMoreIcon  />}
          sx={{
            flexDirection: 'row-reverse',
            backgroundColor: "#cbcccc",
            borderBottom: 1,
          }}
        >
          <Typography>{`Comments ${arrayWithCommentsForPost.length}`}</Typography>
        </AccordionSummary>
        <InsideAccordion
          currentUser={currentUser}
          arrayWithCommentsForPost={arrayWithCommentsForPost}
          setMappedComments={setMappedComments}
          updateComment={updateComment}
        />
      </Accordion>
    );
  else
  // User is logged in
    return (
      <Accordion >
        <AccordionSummary            
          key={postId}
          expandIcon={<ExpandMoreIcon/>}

          sx={{
            flexDirection: 'row-reverse',
            backgroundColor: "#cbcccc",
            borderBottom: 1,
          }}
        >
          <Typography>{`Comments ${arrayWithCommentsForPost.length}`}</Typography>
        </AccordionSummary>
        <CommentFields
          _id={postId}
          userName={currentUser }
          addingToArray={addingComments}
        />
        <InsideAccordion
          loggedInUser={currentUser}
          arrayWithCommentsForPost={arrayWithCommentsForPost}
          setMappedComments={setMappedComments}
          updateComment={updateComment}
          postControls={postControls}
        />
      </Accordion>
    );
};
