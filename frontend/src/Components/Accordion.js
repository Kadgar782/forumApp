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
import React, { useContext, useState } from "react";
import { postContext } from "./PostBlueprint";
import { userContext } from "../App.js";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getCommentsForPost } from "../http/comments";

export const AccordionMui = ({ postControls, commentCount }) => {
  const postId = useContext(postContext);

  const { setCurrentUser, currentUser } = useContext(userContext);
  const [comments, setComments] = useState([]);
  const [showAccordion, setShowAccordion] = useState(false);
  const [hasMoreComments, setHasMoreComments] = useState(false);

  // We use this to get all posts and update them on the background

  const handleAccordionChange = () => {
    setShowAccordion((prev) => !prev);
  };
  const { isFetchingNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ["comments", postId],
    refetchOnReconnect: "always",
    staleTime: 1000 * 3,
    queryFn: ({ pageParam = 0 }) =>
      getCommentsForPost(setCurrentUser, postId, pageParam),
    refetchInterval: 1000 * 60,

    getNextPageParam: (lastPage, allPages) => {
      const allPagesWithoutIndex = [];
      allPages.forEach((item) => {
        const comments = item.comments;
        allPagesWithoutIndex.push(...comments);
      });
      const nextPage =
        lastPage.comments.length === 50
          ? allPagesWithoutIndex.length + 1
          : undefined;
      return nextPage;
    },

    onSuccess: (responseData) => {
      const allComments = [];
      responseData.pages.forEach((item) => {
        const comments = item.comments;
        const hasMore = item.hasMore;
        setHasMoreComments(hasMore);
        allComments.push(...comments);
      });
      setComments(allComments);
    },
  });

  // User is not logged in
  if (currentUser === "")
    return (
      <Accordion onChange={handleAccordionChange} expanded={showAccordion}>
        <AccordionSummary
          key={postId}
          expandIcon={<ExpandMoreIcon />}
          sx={{
            flexDirection: "row-reverse",
            backgroundColor: "#cbcccc",
            borderBottom: 1,
          }}
        >
          <Typography>{`Comments ${commentCount}`}</Typography>
        </AccordionSummary>
        <InsideAccordion arrayWithCommentsForPost={comments} />
        {hasMoreComments && (
          <Paper sx={{ backgroundColor: "#cbcccc" }}>
            <Grid container justifyContent="center">
              <Button
                color="inherit"
                fontWeight="bold"
                variant="text"
                disabled={isFetchingNextPage}
                onClick={fetchNextPage}
              >
                Load more comments
              </Button>
            </Grid>
          </Paper>
        )}
      </Accordion>
    );
  // User is logged in and can write comments
  else
    return (
      <Accordion onChange={handleAccordionChange} expanded={showAccordion}>
        <AccordionSummary
          key={postId}
          expandIcon={<ExpandMoreIcon />}
          sx={{
            flexDirection: "row-reverse",
            backgroundColor: "#cbcccc",
            borderBottom: 1,
          }}
        >
          <Typography>{`Comments ${commentCount || 0}`}</Typography>
        </AccordionSummary>
        {/* the only difference is in the input field */}
        <CommentFields />
        <InsideAccordion
          arrayWithCommentsForPost={comments}
          postControls={postControls}
        />
        {hasMoreComments && (
          <Paper sx={{ backgroundColor: "#cbcccc" }}>
            <Grid container justifyContent="center">
              <Button
                color="inherit"
                fontWeight="bold"
                variant="text"
                disabled={isFetchingNextPage}
                onClick={fetchNextPage}
              >
                Load more comments
              </Button>
            </Grid>
          </Paper>
        )}
      </Accordion>
    );
};
