import { Typography, Avatar, IconButton, } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { getPost } from "../http/posts";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { NotFound } from "./NotFound";
import { Box } from "@mui/material";
import { Skeleton } from "@mui/material";
import {
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";
import { removePost } from "../http/posts";
import { toast } from "react-toastify";
import { refreshTokens } from "../http/interceptor";
import React from "react";
import { SinglePostCommentField } from "../Components/singlePostCommentsField";

export const SinglePost = ({ currentUser, setCurrentUser, checkingId }) => {

  const { postId } = useParams();

  const navigate = useNavigate();

  // Getting Post
  const { isLoading, isError, isSuccess, data } = useQuery({
    queryKey: ["post", postId],
    queryFn: ({ idForPost = postId }) => getPost(idForPost, setCurrentUser),
  });

  const queryClient = useQueryClient();

  // I'm using a separate delete mutation here because the version from app.js did not work correctly in this case
  const deletePostMutation = useMutation({
    mutationFn: (_id) => removePost(_id),
    retry: 1,
    onSuccess: () => {
      queryClient.invalidateQueries(["post", postId], {
        exact: true,
      });
      queryClient.invalidateQueries(["responsePosts", "infinite"], {
        exact: true,
      });
      toast.success("Post was deleted");
      navigate(`/`);
    },
    // if an error happened, then either user has no rights or tokens are outdated
    onError: (error) => {
      refreshTokens();
      toast.error("Something went wrong", {});
      console.log(error);
    },
  });

  const deletePost = async (_id) => {
    deletePostMutation.mutate(_id);
  };

  if (isError) {
    // If a request error occurred or the post was not found, we redirect to page 404
    return <NotFound />;
  }

  if (isLoading) {
    return (
      <div className="innerSinglePost">
        <Skeleton variant="rounded" animation="wave" width={750} height={250} />
      </div>
    );
  }


  if (isSuccess) {
    // If the user is an admin or the author of current post, he can see and click the buttons for editing
    if (data.controls === true || data.username === currentUser)
      return (
        <div className="innerSinglePost" key={data._id}>
          <Box
            sx={{ bgcolor: "#cbcccc", border: 2, borderRadius: "2px", mb: 4 }}
          >
            <Typography variant="h5">
              {data.title}
              <IconButton
                aria-label="Edit"
                disableRipple
                id={data._id}
                onClick={checkingId}
              >
                <EditIcon />
              </IconButton>

              <IconButton
                aria-label="delete"
                disableRipple
                onClick={() => deletePost(data._id)}
              >
                <DeleteIcon />
              </IconButton>
            </Typography>
            <Typography>{data.body}</Typography>
            <span>
              <Avatar
                alt="Placeholder"
                src={data.thumbnailUrl}
                variant="rounded"
                sx={{
                  maxWidth: 35,
                  maxHeight: 35,
                  marginRight: 0.5,
                }}
              />
              {data.username}
            </span>
          </Box>
          <Box sx={{ border: 2, borderRadius: "2px" }}>
          <SinglePostCommentField
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              postControls={data.controls}
            />
          </Box>
        </div>
      );
    // the user is not an admin and not the author of the post
    else {
      return (
        <div className="innerSinglePost" key={data._id}>
          <Box
            sx={{ bgcolor: "#cbcccc", border: 2, borderRadius: "2px", mb: 4 }}
          >
            <Typography variant="h5">{data.title}</Typography>
            <Typography>{data.body}</Typography>
            <span>
              <Avatar
                alt="Placeholder"
                src={data.thumbnailUrl}
                variant="rounded"
                sx={{
                  maxWidth: 35,
                  maxHeight: 35,
                  marginRight: 0.5,
                }}
              />
              {data.username}
            </span>
          </Box>
          <Box sx={{ border: 2, borderRadius: "2px" }}>
            <SinglePostCommentField
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              postControls={data.controls}
            />
          </Box>
        </div>
      );
    }
  }
};
