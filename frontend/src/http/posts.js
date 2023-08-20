import axios from "axios";
import Interceptor from "./interceptor";
import { toast } from "react-toastify";

const API_URL = process.env.REACT_APP_API_URL;

// We get posts with the ability to edit and delete them depending on the logged in user
export const getPostsAuth = async (setCurrentUser, page) => {
  try {
    const interceptor = new Interceptor(setCurrentUser);
    // In this custom axios request, we pass a token by which we receive all the data with posts,
    // if the access token has expired, then an attempt is being made to update it with a refresh token
    // but if it has expired, the user's log out will occur.

    const response = await interceptor.get("api/data", {
      params: { page: page, limit: 5 },
    });
    const data = response.data;
    const posts = data.responsePosts;
    const hasMore = data.hasMore;
    return {
      hasMore: hasMore,
      posts: posts,
    };
  } catch (error) {
    if (error.response && error.response.status === 403) {
      toast.error(
        "You must activate your account via email before using the site"
      );
    }
    console.error(error);
  }
};

// We get a post with the ability to edit and delete it
export const getPost = async (
  postId,
  setCurrentUser,
) => {
  try {
    const interceptor = new Interceptor(setCurrentUser);
    // In this custom axios request, we pass a token by which we receive all the data with post,
    // if the access token has expired, then an attempt is being made to update it with a refresh token
    // but if it has expired, the user's log out will occur.
    const response = await interceptor.get(`api/products/${postId}`);
    const data = response.data.result;
    return data
  } catch (error) {
    if (error.response && error.response.status === 403) {
      toast.error(
        "You must activate your account via email before using the site"
      );
    }
    console.error(error);
  }
};

//Post remove function
export const removePost = async (_id) => {
  const token = localStorage.getItem("token");
  //We delete all comments from post, before deleting the posts themselves
  try {
    const response = await axios.delete(`${API_URL}/api/comments/post/${_id}`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status >= 400) {
      throw new Error("Server responds with error!");
    }
  } catch (error) {
    console.error(error);
  }

  //Backend fetch
  try {
    const response = await axios.delete(`${API_URL}/api/products/${_id}`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status >= 400) {
      throw new Error("Server responds with error!");
    }
  } catch (error) {
    console.error(error);
  }
};

//Create new post function
export const createNewPost = async (allData) => {
  const token = localStorage.getItem("token");
  try {
    const { username, title, body, thumbnailUrl, commentsInPost } =
      allData.allData;
    const response = await axios.post(
      `${API_URL}/api/products`,
      {
        username,
        title,
        body,
        thumbnailUrl,
        commentsInPost,
      },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status >= 400) {
      throw new Error("Server responds with an error!");
    }

    const newItem = response.data.result;
    return newItem;
  } catch (error) {
    console.error("Error creating new product:", error);
    throw error;
  }
};

//Edit Post function
export const editCurrentPost = async (updatedPost) => {
  const token = localStorage.getItem("token");
  // make request to backend
  try {
    const { _id, title, body } = updatedPost.updatedPost;
    const response = await axios.put(
      `${API_URL}/api/products/${_id}`,
      {
        title,
        body,
      },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status >= 400) {
      throw new Error("Server responds with error!");
    }
    const newItem = response.data.result;
    return newItem;
  } catch (error) {
    console.error(error);
  }
};
