import { Typography, Avatar, IconButton } from "@mui/material";
import { MuiAccordion } from "./MUIAccordion";
import { Divider } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import React, { createContext,  } from "react";
//Context

export const postContext = createContext("without provider");

export const PostSchema = ({
  currentUser,
  arrayWithPosts,
  checkingId,
  deleteElement,
}) => {
  return arrayWithPosts.map((post) => {
    //If the user is not logged in, he cannot create new posts or write comments

    if (currentUser === "")
      return (
        <postContext.Provider  key={post._id} value={post._id} >
          <div className="inner" key={post._id}>
            <Typography variant="h5">{post.title}</Typography>
            
            <Typography>{post.body} </Typography>

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
            <MuiAccordion
              postControls={post.controls}
              commentCount={post.commentsInPost}
              />
          </div>
        </postContext.Provider>
      );
    // If the user is an admin or the author of current post
    else if (post.controls === true || post.username === currentUser)
      return (
        <postContext.Provider  key={post._id} value={post._id}>
          <div className="inner" key={post._id}>
            <Typography variant="h5">
              {post.title}

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
            <p>{post.body}</p>

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
            <MuiAccordion
              postControls={post.controls}
              commentCount={post.commentsInPost}
              />
          </div>
        </postContext.Provider>
      );
    // if the user is not an admin and not the author of the post
    else
      return (
        <postContext.Provider  key={post._id} value={post._id}>
          <div className="inner" key={post._id}>
            <Typography variant="h5">{post.title}</Typography>
            <p>{post.body}</p>

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
            <MuiAccordion
              postControls={post.controls}
              commentCount={post.commentsInPost}
              />
          </div>
        </postContext.Provider>
      );
  });
};
