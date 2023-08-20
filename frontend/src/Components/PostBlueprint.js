import { Typography, Avatar, IconButton } from "@mui/material";
import { AccordionMui } from "./Accordion";
import { Divider } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import React, { createContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
//Context

export const postContext = createContext("without provider");

export const PostSchema = ({
  currentUser,
  arrayWithPosts,
  checkingId,
  deleteElement,
  fetchNextPage,
}) => {
  const { ref, inView } = useInView({
    threshold: 0,
  });

  // We use this useEffect to fetch new posts as we scroll
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  return arrayWithPosts.map((post, index) => {
    // I tried to add a ref only to the last post counting it through the index,
    // but for some reason it was not applied. However, the fetch of the following posts occurs only after scrolling to the end of the feed.
    // If the user is an admin or the author of current post
    if (post.controls === true || post.username === currentUser)
      return (
        <postContext.Provider key={post._id} value={post._id}>
          <div className="inner" key={post._id} ref={ref}>
            <Typography variant="h5">
              <Link
                to={`/${post._id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {post.title}
              </Link>
              <IconButton
                aria-label="Edit"
                disableRipple
                id={post._id}
                onClick={checkingId}
              >
                <EditIcon />
              </IconButton>

              <IconButton
                aria-label="delete"
                disableRipple
                onClick={() => deleteElement(post._id)}
              >
                <DeleteIcon />
              </IconButton>
            </Typography>
            <Typography>{post.body}</Typography>
            <span>
              <Avatar
                alt="Placeholder"
                src={post.thumbnailUrl}
                variant="rounded"
                sx={{
                  maxWidth: 35,
                  maxHeight: 35,
                  marginRight: 0.5,
                }}
              />
              {post.username}
            </span>
            <Divider sx={{ border: 1 }} />
            <AccordionMui
              postControls={post.controls}
              commentCount={post.commentsInPost}
            />
          </div>
        </postContext.Provider>
      );
    // if the user is not an admin and not the author of the post
    else
      return (
        <postContext.Provider key={post._id} value={post._id}>
          <div className="inner" key={post._id} ref={ref}>
            <Typography variant="h5">
              <Link
                to={`/${post._id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {post.title}
              </Link>
            </Typography>
            <Typography>{post.body}</Typography>
            <span>
              <Avatar
                alt="Placeholder"
                src={post.thumbnailUrl}
                variant="rounded"
                sx={{
                  maxWidth: 35,
                  maxHeight: 35,
                  marginRight: 0.5,
                }}
              />
              {post.username}
            </span>
            <Divider sx={{ border: 1 }} />
            <AccordionMui
              postControls={post.controls}
              commentCount={post.commentsInPost}
            />
          </div>
        </postContext.Provider>
      );
  });
};
