import React, { useState, useEffect, createContext, useRef } from "react";
import {
  Box,
  IconButton,
  Typography,
  Toolbar,
  AppBar,
  Button,
  Modal,
} from "@mui/material";
import { Routes, Route, Link } from "react-router-dom";
import { PostFields } from "./Components/CreatePost.js";
import { EditPostFields } from "./Components/editPost.js";
import { PostSchema } from "./Components/PostBlueprint.js";
import MenuIcon from "@mui/icons-material/Menu";
import { LoginFields } from "./Components/loginUser.js";
import { RegistrationFields } from "./Components/registrationFields.js";
import { ToastContainer, toast } from "react-toastify";
import { logOut } from "./Components/authentication/authFunctions.js";
import  Interceptor  from "./http/interceptor.js";
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
  const [token, setToken] = useState(""); //taking a token from local storage is faster than from a  useState, but I still need a setToken

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
      const resComments = await fetchData("http://localhost:5001/api/comments"); // наверно стоит это убрать, ведь я их буду брать отдельно к каждому посту

      const comments = resComments.result;

      setComments(comments);
    };

    // We get posts with the ability to edit and delete them depending on the logged in user
    const getPostsAuth = async () => {
      
      const interceptor = new Interceptor(setCurrentUser, notify);
      // In this custom axios request, we pass a token by which we receive all the data with posts,
      // if the access token has expired, then an attempt is being made to update it with a refresh token,
      // but if it has expired, the user's log out will occur.
      const response = await interceptor.get("api/data");
      const post = await response.data;
      const revPost = post.data.reverse();
      console.log(revPost)
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

  //Refs
  const loginFieldsRef = useRef(null);

  // Notify
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
      <userContext.Provider value={{ currentUser, setCurrentUser }}>
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

                {/*we check whether the user is authorized and, depending on this, we return the necessary buttons*/}

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
                  <Button
                    color="inherit"
                    onClick={() => logOut(setCurrentUser, notify)}
                  >
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

          {/*here we define paths for pages. In this project I have only two pages, the main page and the editor for creating posts. 
           I was planning to add more features to the editor*/}
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
                // we are waiting for data from the backend
                isLoading ? (
                  <div>IS loading...</div>
                ) : (
                  <PostSchema
                    updateComment={updateComment}
                    currentUser={currentUser}
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

          {/* Modal windows for logging in, registering and editing posts.
         It would be better to replace the modal post editing window with a page with an editor when I'll add more functionality to it. */}

          <Modal open={loginOpen} onClose={handleLoginModalToggle}>
            <LoginFields
              ref={loginFieldsRef}
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
          {/* Notify */}
          <div>
            <ToastContainer />
          </div>
        </div>
      </userContext.Provider>
    </CommentContext.Provider>
  );
}
export default App;
