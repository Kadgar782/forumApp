import {
  Box,
  Typography,
  LinearProgress,
  Paper,
  Grid,
  Button,
} from "@mui/material";
import { getCommentsForPost } from "../http/comments";
import { Comment } from "../Components/Comment";
import { CommentFields } from "../Components/commentEditor";
import { useParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useState } from "react";

export const SinglePostCommentField = ({
  currentUser,
  setCurrentUser,
  postControls,
}) => {
  const [comments, setComments] = useState([]);
  const [hasMoreComments, setHasMoreComments] = useState(false);

  const { postId } = useParams();

  // Getting Comments
  const {
    isFetchingNextPage,
    fetchNextPage,
    data,
    isSuccess,
    isLoading,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ["singlePostComments", postId],
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
      console.log(comments);
      console.log(data);
    },
  });

  if (isLoading) {
    return <LinearProgress />;
  }
  if (isSuccess) {
    return (
      <Box>
        {currentUser === "" ? null : (
          <CommentFields postIdFromSinglePost={postId} />
        )}
        {isRefetching && <LinearProgress />}
        {comments ? (
          comments.map((commentStuff) => {
            const { _id, body, postId } = commentStuff;
            return (
              <Comment
                key={_id}
                postControls={postControls}
                commentId={_id}
                commentBody={body}
                postId={postId}
                arrayWithCommentsForPost={comments}
              />
            );
          })
        ) : (
          <Box>
            <Typography>No comments yet</Typography>
          </Box>
        )}
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
      </Box>
    );
  }
};
