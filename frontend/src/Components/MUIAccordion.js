import {
  Accordion,
  AccordionSummary,
  Typography,
  Paper,
  Button,
  Grid,
} from "@mui/material";
import { InsideAccordion } from "./InsideAccordion";
import { CommentFields } from "./commentEditor";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useContext, useState, } from "react";
import { postContext } from "./PostBlueprint";
import { userContext } from "../App.js";
import axios from "axios";


export const MuiAccordion = ({
  postControls,
  commentCount,
}) => {
  const postId = useContext(postContext);

  const { currentUser } = useContext(userContext);
  const [comments, setComments] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [showAccordion, setShowAccordion] = useState(false);
  const [hasMoreComments, setHasMoreComments] = useState(false);
  
  //We check if comments exist and get them from backend, we also show content of accordion.
  const handleAccordionChange = async (event, isExpanded) => {
    if (isExpanded && comments.length === 0) {
      try {
        const response = await axios.get(`http://localhost:5001/api/comments/post/${postId}?startIndex=${startIndex}&limit=3`);
        setComments(response.data.comments);
        setHasMoreComments(response.data.hasMore);
        setStartIndex(startIndex + response.data.comments.length);
        setShowAccordion(true);
      } catch (error) {
        console.error(error);
      }
    } else {
      setShowAccordion(isExpanded);
    }
  };

  //Function for displaying more comments to a post 
  const handleLoadMoreComments = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/comments/post/${postId}?startIndex=${startIndex}&limit=100`);
      setComments(prevComments => [...prevComments, ...response.data.comments]);
      setStartIndex(startIndex + response.data.comments.length);
      setHasMoreComments(response.data.hasMore);
    } catch (error) {
      console.error(error);
    }
  };

  //Changing comment
  const updateComment = (updatedComment, commentId) => {
    setComments(
      comments.map((comment) =>
        comment._id === commentId ? updatedComment : comment
      )
    );
  };

  //Adding comment to useState hook. We make backend fetch in CommentFields
  const addingToComments = (added) => {
    setComments([added, ...comments]);
  };


  // User is not logged in
  if (currentUser === "")
    return (
      <Accordion  onChange={handleAccordionChange} expanded={showAccordion}>
        <AccordionSummary         
          key={postId}
          expandIcon={<ExpandMoreIcon  />}
          sx={{
            flexDirection: 'row-reverse',
            backgroundColor: "#cbcccc",
            borderBottom: 1,
          }}
        >
          <Typography>{`Comments ${commentCount}`}</Typography>
        </AccordionSummary>
        <InsideAccordion
          arrayWithCommentsForPost={comments}
          setMappedComments={setComments}
          updateComment={updateComment}
        />
         {hasMoreComments && (
          <Paper sx={{backgroundColor: "#cbcccc",}}>
          <Grid   container justifyContent="center"  >
          <Button color="inherit"  fontWeight="bold"  variant="text" onClick={handleLoadMoreComments} >Load more comments</Button>
          </Grid>
          </Paper>
        )}
      </Accordion>
    );
  else
  // User is logged in and can write comments 
    return (
      <Accordion  onChange={handleAccordionChange} expanded={showAccordion} >
        <AccordionSummary            
          key={postId}
          expandIcon={<ExpandMoreIcon/>}

          sx={{
            flexDirection: 'row-reverse',
            backgroundColor: "#cbcccc",
            borderBottom: 1,
          }}
        >
            <Typography>{`Comments ${commentCount || 0}`}</Typography>
        </AccordionSummary>
        <CommentFields
          _id={postId}
          userName={currentUser }
          addingToArray={addingToComments}
        />
        <InsideAccordion
          loggedInUser={currentUser}
          arrayWithCommentsForPost={comments}
          setComments={setComments}
          updateComment={updateComment}
          postControls={postControls}
        />
         {hasMoreComments && (
          <Paper sx={{backgroundColor: "#cbcccc",}}>
          <Grid   container justifyContent="center"  >
          <Button color="inherit"   fontWeight="bold" variant="text" onClick={handleLoadMoreComments} >Load more comments</Button>
          </Grid>
          </Paper>
        )}
      </Accordion>
    );
};
