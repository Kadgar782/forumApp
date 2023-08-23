import axios from "axios";
import Interceptor from "./interceptor";

const API_URL = process.env.REACT_APP_API_URL;

// We get comments with the ability to edit and delete them depending on the logged in user
export const getCommentsForPost = async (
  setCurrentUser,
  postId,
  page
) => {
  const interceptor = new Interceptor(setCurrentUser,);
  try {
    const token = localStorage.getItem("token");
    const response = await interceptor.get(
      `${API_URL}/api/comments/post/${postId}`,
      {
        params: { page: page, limit: 50 },
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = response.data;
    const posts = data.comments;
    const hasMore = data.hasMore;
    return {
      hasMore: hasMore,
      comments: posts,
    };
  } catch (error) {
    console.error(error);
  }
};

//Comment remove function
export const removeComment = async (_id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.delete(`${API_URL}/api/comments/${_id}`, {
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


//Create new comment function
export const createNewComment = async (allData) => {
  const token = localStorage.getItem("token");
  try {
    const { username, body, thumbnailUrl, postId  } =
      allData.allData;
    const response = await axios.post(
      `${API_URL}/api/comments`,
      {
        username,
        body,
        thumbnailUrl,
        postId,
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

//Edit comment function
export const editCurrentComment = async (updatedComment) => {
  const token = localStorage.getItem("token");
  // make request to backend
  try {
    const {  _id, title, body,} = updatedComment
    const response = await axios.put(
      `${API_URL}/api/comments/${_id}`,
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