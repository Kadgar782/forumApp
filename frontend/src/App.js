import React, { useState, useEffect, createContext } from "react";
import {
  Box,
  IconButton,
  Typography,
  Toolbar,
  AppBar,
  Button,
  Modal,
} from "@mui/material";
import {  Routes, Route, Link } from "react-router-dom";
import { PostFields } from "./Components/CreatePost.js";
import { EditPostFields } from "./Components/editPost.js";
import { PostSchema } from "./Components/PostBlueprint.js";
import MenuIcon from "@mui/icons-material/Menu";
import { LoginFields } from "./Components/loginUser.js";
import { RegistrationFields } from "./Components/registrationFields.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

//Context
export const userContext = createContext("without user provider");
export const CommentContext = createContext("without comment provider");

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [mappedPosts, setMappedPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [userList, setUser] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [idForEditing, setID] = useState([]);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  // eslint-disable-next-line  no-unused-vars
  const [token, setToken] = useState("");//taking a token from local storage is faster than from a  useState, but I still need a setToken

  //Getting Post content
  useEffect(() => {
    // declare the async data fetching function
    const fetchData = async (url) => {
      // get the data from the api
      const response = await fetch(url);
      // convert the data to json
      const json = await response.json();

      // set state with the result
      return json;
    };
    //Getting Comments
    const getComments = async () => {
      const resComments = await fetchData("http://localhost:5001/api/comments");

      const comments = resComments.result;

      setComments(comments);
    };

    const getPostsAuth = async (bearerToken) => {
      const response = await fetch("http://localhost:5001/api/data", {
        headers: {
          Authorization: `Bearer ${bearerToken}`, // передаем токен в заголовке
        },
      });
      const post = await response.json();
      const revPost = post.data.reverse();
      setMappedPosts(revPost);
    };

    // checking whether the user has already been logged in
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setCurrentUser(loggedInUser);
    }

    // checcking user token
    const localToken = localStorage.getItem("token");
    if (localToken) {
      setToken(localToken);
    }

    getPostsAuth(localToken)
      .then(() => getComments())
      .then(() => setIsLoading(false));
  }, [currentUser]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const checkAuth = async () => {
        try {
          const response = await fetch("http://localhost:5001/auth/refresh", {
            method: "GET",
            credentials: "include",
          });
          const responseJSON = await response.json();
          localStorage.setItem("token", responseJSON.accessToken);
        } catch (error) {
          console.log(error);
          notify("error");
        }
      };
      checkAuth();
    }
  }, []);

  //Notify
  const notify = (status) => {
    switch (status) {
      case "success":
        toast.success("Post was deleted");
        break;
      case "error":
        toast.error("Something went wrong");
        break;
      default:
        break;
    }
  };

  //Post remove function
  const removeElement = async (_id) => {
    //We delete all comments from post, before deleting the posts themselves
    try {
      const response = fetch(`http://localhost:5001/api/comments/post/${_id}`, {
        method: "DELETE",
      });
      if (response.status >= 400) {
        throw new Error("Server responds with error!");
      }
    } catch (error) {
      console.error(error);
      notify("error");
    }

    //Backend fetch
    try {
      const response = fetch(`http://localhost:5001/api/products/${_id}`, {
        method: "DELETE",
      });
      if (response.status >= 400) {
        throw new Error("Server responds with error!");
      }
      notify("success");
    } catch (error) {
      console.error(error);
      notify("error");
    }
    const newPosts = mappedPosts.filter(
      (mappedPosts) => mappedPosts._id !== _id
    );


    setMappedPosts(newPosts);
  };

  // Modal changes
  const handleEditableModalToggle = () => setEditOpen(!editOpen);
  //Registration Modal
  const handleRegistrationModalToggle = () => {
    setRegistrationOpen(!registrationOpen);
  };
  //Login Modal
  const handleLoginModalToggle = () => {
    setLoginOpen(!loginOpen);
  };

  //Search for a post by ID via the button
  const checkId = (event) => {
    setID(event.currentTarget.id);
    handleEditableModalToggle();
  };

  //Logging out and clearing the local storage
  const logOut = async () => {
    try {
      const response = await fetch("http://localhost:5001/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status >= 400) {
        notify("error", "");
        throw new Error("Server responds with error!");
      }
    } catch (error) {
      console.error(error);
      notify("error");
    }
    setCurrentUser("");
    localStorage.clear();
  };

  // //Set current User
  // const setTheUser = (username) => {
  //   setCurrentUser(username);
  // };

  //Сhanging a post with a specific id
  const updatePost = (updatedPost) => {
    setMappedPosts(
      mappedPosts.map((post) =>
        post._id === idForEditing ? updatedPost : post
      )
    );
  };

  //Changing comment
  const updateComment = (updatedComment, commentId) => {
    setComments(
      comments.map((comment) =>
        comment._id === commentId ? updatedComment : comment
      )
    );
  };

  //Adding new data from a component
  //in theory, these three functions can be replaced with one with two parameters, but it was faster this way
  const addingToMappedPosts = (added) => {
    setMappedPosts([added, ...mappedPosts]);
  };
  const addingToUserList = (added) => {
    setUser([added, ...userList]);
  };
  const addingToComments = (added) => {
    setComments([added, ...comments]);
  };

  // Creating Post with JSX
  return (
    <CommentContext.Provider value={[comments, setComments]}>
      <userContext.Provider value={currentUser}>
        <div className="outer">
          <Box sx={{ flexGrow: 1, mb: 1 }}>
            <AppBar position="static">
              <Toolbar sx={{ minHeight: "54px !important" }}>
                <IconButton
                  component={Link}
                  to="/"
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                      ZAP
                </IconButton>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ flexGrow: 1 }}
                ></Typography>
                {currentUser === "" ? null : (
                  <Button color="inherit" component={Link} to="/editor">
                    Create new post
                  </Button>
                )}
                {currentUser === "" ? (
                  <Button color="inherit" onClick={handleLoginModalToggle}>
                    Login
                  </Button>
                ) : (
                  <Button color="inherit" onClick={logOut}>
                    Log out
                  </Button>
                )}
                {currentUser === "" ? (
                  <Button
                    color="inherit"
                    onClick={handleRegistrationModalToggle}
                  >
                    Registration
                  </Button>
                ) : null}
              </Toolbar>
            </AppBar>
          </Box>

          <Routes>
            <Route
              path="/editor"
              element={
                <PostFields
                  userName={currentUser}
                  arrayForAdding={mappedPosts}
                  addingToArray={addingToMappedPosts}
                />
              }
            />
            <Route
              path="/"
              element={
                isLoading ? (
                  <div>IS loading...</div>
                ) : (
                  <PostSchema
                    updateComment={updateComment}
                    presentUser={currentUser}
                    mainArrayWithComments={comments}
                    functionForAddingComments={addingToComments}
                    arrayWithPosts={mappedPosts}
                    checkingId={checkId}
                    deleteElement={removeElement}
                    setMappedComments={setComments}
                  />
                )
              }
            />
          </Routes>

          <Modal open={loginOpen} onClose={handleLoginModalToggle}>
            <LoginFields
              modalStatusChange={handleLoginModalToggle}
              setCurrentUser={setCurrentUser}
              setToken={setToken}
            />
          </Modal>

          <Modal
            open={registrationOpen}
            onClose={handleRegistrationModalToggle}
          >
            <RegistrationFields
              modalStatusChange={handleRegistrationModalToggle}
              addingToArray={addingToUserList}
            />
          </Modal>

          <Modal open={editOpen} onClose={handleEditableModalToggle}>
            <EditPostFields
              modalStatusChange={handleEditableModalToggle}
              specificId={idForEditing}
              allPosts={mappedPosts}
              updatePost={updatePost}
            />
          </Modal>
          <div>
            <ToastContainer />
          </div>
        </div>
      </userContext.Provider>
    </CommentContext.Provider>
  );
}
export default App;
