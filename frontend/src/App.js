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
import InfiniteScroll from "react-infinite-scroll-component";
import Interceptor from "./http/interceptor.js";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

//Context
export const userContext = createContext("without user provider");
export const CommentContext = createContext("without comment provider");

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [mappedPosts, setMappedPosts] = useState([]);
  const [userList, setUser] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [idForEditing, setID] = useState([]);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(5);
  // eslint-disable-next-line  no-unused-vars
  const [token, setToken] = useState(""); //taking a token from local storage is faster than from a  useState, but I still need a setToken

  //Getting Post content
  useEffect(() => {
    // if there is no data in local storage, that will not happen
    // checking whether the user has already been logged in
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setCurrentUser(loggedInUser);
    }

    // checking user token
    const localToken = localStorage.getItem("token");
    if (localToken) {
      setToken(localToken);
    }
    // We get posts with the ability to edit and delete them depending on the logged in user
    const getPostsAuth = async () => {
      try {
        const interceptor = new Interceptor(
          setCurrentUser,
          notify,
        );
        // In this custom axios request, we pass a token by which we receive all the data with posts,
        // if the access token has expired, then an attempt is being made to update it with a refresh token
        // but if it has expired, the user's log out will occur.
        const response = await interceptor.get(`api/data?page=0&limit=5`);
        const data = response.data;
        const posts = data.responsePosts;
        //if we do not pass an empty array, then posts with the same keys will be duplicated
        setMappedPosts([]);
        setMappedPosts(posts);
        //check if there are any posts that haven't been uploaded yet
        setHasMore(data.hasMore);
      } catch (error) {
        if (error.response && error.response.status === 403) {
        notify("notActivated");
        }
        console.error(error);
      }
    };

    getPostsAuth(setHasMore, setMappedPosts).then(() => setIsLoading(false));
  }, [currentUser]);
// function for uploading posts when the user has already viewed all the originally uploaded ones and scrolls down
  const loadNextPosts = async () => {
    try {
      const interceptor = new Interceptor(
        setCurrentUser,
        notify,
        setMappedPosts
      );
      const response = await interceptor.get(
        `api/data?page=${pageNumber}&limit=2`
      );
      const data = response.data;
      const posts = data.responsePosts;
      setMappedPosts((prevPosts) => [...prevPosts, ...posts]);
      setPageNumber((prevPageNumber) => prevPageNumber + 2);
      //check if there are any posts that haven't been uploaded yet
      setHasMore(data.hasMore);
    } catch (error) {
      console.error(error);
    }
  };

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
      case "notActivated":
        toast.error("You must activate your account via email before using the site")
        break;
      default:
        break;
    }
  };

  //Post remove function
  const removeElement = async (_id) => {
    //We delete all comments from post, before deleting the posts themselves
    try {
      const interceptor = new Interceptor(
        setCurrentUser,
        notify,
      );
      const response = await interceptor.delete(`http://localhost:5001/api/comments/post/${_id}`)
      loadNextPosts();
      if (response.status >= 400) {
        throw new Error("Server responds with error!");
      }
    } catch (error) {
      console.error(error);
      notify("error");
    }

    //Backend fetch
    try {
      const interceptor = new Interceptor(
        setCurrentUser,
        notify,
      );
      const response = await interceptor.delete(`http://localhost:5001/api/products/${_id}`)
      if (response.status >= 400) {
        throw new Error("Server responds with error!");
      }
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

  //Changing a post with a specific id
  const updatePost = (updatedPost) => {
    setMappedPosts(
      mappedPosts.map((post) =>
        post._id === idForEditing ? updatedPost : post
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

  // Creating Post with JSX
  return (
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
                <Button color="inherit" onClick={handleRegistrationModalToggle}>
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
                addingToArray={addingToMappedPosts}
                setCurrentUser={setCurrentUser}
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
                <InfiniteScroll
                  dataLength={mappedPosts.length}
                  next={loadNextPosts}
                  hasMore={hasMore}
                  loader={<h2>Loading...</h2>}
                  endMessage={<p>No more posts to load.</p>}
                  style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                >
                  <PostSchema
                    currentUser={currentUser}
                    arrayWithPosts={mappedPosts}
                    checkingId={checkId}
                    deleteElement={removeElement}
                  />
                </InfiniteScroll>
              )
            }
          />
        </Routes>

        {/* Modal windows for logging in, registering and editing posts.*/}

        <Modal open={loginOpen} onClose={handleLoginModalToggle}>
          <LoginFields
            ref={loginFieldsRef}
            modalStatusChange={handleLoginModalToggle}
            setCurrentUser={setCurrentUser}
            setToken={setToken}
          />
        </Modal>

        <Modal open={registrationOpen} onClose={handleRegistrationModalToggle}>
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
            setCurrentUser={setCurrentUser}
          />
        </Modal>
        <div>
          <ToastContainer />
        </div>
      </div>
    </userContext.Provider>
  );
}
export default App;
