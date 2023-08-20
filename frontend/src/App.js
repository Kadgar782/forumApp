import React, { useState, useEffect, createContext, useRef } from "react";
import {
  Box,
  IconButton,
  Typography,
  Toolbar,
  AppBar,
  Button,
  Modal,
  LinearProgress,
} from "@mui/material";
import { Routes, Route, Link } from "react-router-dom";
import { PostFields } from "./Pages/CreatePost.js";
import { EditPostFields } from "./Components/editPost.js";
import { PostSchema } from "./Components/PostBlueprint.js";
import MenuIcon from "@mui/icons-material/Menu";
import { LoginFields } from "./Components/authentication/loginUser.js";
import { RegistrationFields } from "./Components/authentication/registrationFields.js";
import { ToastContainer, toast } from "react-toastify";
import { logOut } from "./Components/authentication/authFunctions.js";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getPostsAuth, removePost } from "./http/posts.js";
import { SinglePost } from "./Pages/singlePost.js";
import { NotFound } from "./Pages/NotFound.js";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { refreshTokens } from "./http/interceptor.js";
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

  //Getting Post content
  useEffect(() => {
    // if there is no data in local storage, that will not happen
    // checking whether the user has already been logged in
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setCurrentUser(loggedInUser);
    }
  }, [currentUser]);

  // We use this to get all posts and update them on the background
  const { isFetchingNextPage, fetchNextPage, isRefetching } = useInfiniteQuery({
    queryKey: ["responsePosts", "infinite"],
    queryFn: ({ pageParam = 0 }) =>
      getPostsAuth(setCurrentUser, pageParam),
    refetchInterval: 1000 * 60 * 2,
    refetchOnReconnect: "always",
    getNextPageParam: (lastPage, allPages) => {
      const allPagesWithoutIndex = [];
      allPages.forEach((item) => {
        const posts = item.posts;
        allPagesWithoutIndex.push(...posts);
      });
      const nextPage =
        lastPage.posts.length === 5
          ? allPagesWithoutIndex.length + 1
          : undefined;
      return nextPage;
    },

    onSuccess: (responseData) => {
      const allPosts = [];
      responseData.pages.forEach((item) => {
        const posts = item.posts;
        const hasMore = item.hasMore;
        setHasMore(hasMore);
        allPosts.push(...posts);
      });
      setMappedPosts(allPosts);
      setIsLoading(false);
    },
  });

  //Refs
  const loginFieldsRef = useRef(null);
  
  //Post remove function

  const queryClient = useQueryClient();

  const deletePostMutation = useMutation({
    mutationFn: (_id) => removePost(_id),
    retry: 1,
    onSuccess: () => {
      queryClient.invalidateQueries(["responsePosts"]);
      toast.success("Post was deleted");
    },
    // if an error happened, then either user has no rights or tokens are outdated
    onError: (error) => {
      refreshTokens();
      toast.error("Something went wrong",{
      });
      console.log(error);
    },
  });

  const deletePost = async (_id) => {
    deletePostMutation.mutate(_id);
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

  //Adding new data from a component
  // this function is designed for potential future interactions with the user list, at the time of writing it does about nothing
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
                disableTouchRipple
                sx={{ mr: 2 }}
              >
                <MenuIcon
                 sx={{ pr: 2 }} />
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
                  component={Link}
                  to="/"
                  onClick={() => logOut(setCurrentUser)}
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
            {isLoading && <LinearProgress/>}
            {isRefetching && <LinearProgress/>}
          </AppBar>
        </Box>

        {/*here we define paths for pages. In this project I have only two pages, the main page and the editor for creating posts. 
           I was planning to add more features to the editor*/}
        <Routes>
          {/* This path leads to the editor */}
          <Route
            path="/editor"
            element={<PostFields userName={currentUser} />}
          />
          {/* This path leads to the main page */}
          <Route
            path="/"
            element={
              <>
                <PostSchema
                  currentUser={currentUser}
                  arrayWithPosts={mappedPosts}
                  checkingId={checkId}
                  fetchNextPage={fetchNextPage}
                />
                <ToastContainer />
                {/* even on an emulated slow connection, my posts in a couple of lines load fast enough and the loading line appears for a few milliseconds,
                 but however it is there */}
                {isFetchingNextPage && <LinearProgress />}
                {hasMore === false && (
                  <div className="inner">No more posts to load</div>
                )}
              </>
            }
          />
          <Route
            path="/:postId"
            element={
              <>
                <SinglePost
                  checkingId={checkId}
                  deleteElement={deletePost}
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                />
                <ToastContainer />
              </>
            }
          />
          <Route path='/error/404' element={<NotFound />}/>
          <Route path='*' element={<NotFound />}/>
        </Routes>

        {/* Modal windows for logging in, registering and editing posts.*/}

        <Modal open={loginOpen} onClose={handleLoginModalToggle}>
          <LoginFields
            ref={loginFieldsRef}
            modalStatusChange={handleLoginModalToggle}
            setCurrentUser={setCurrentUser}
          />
        </Modal>

        <Modal open={registrationOpen} onClose={handleRegistrationModalToggle}>
          <RegistrationFields
            ref={loginFieldsRef}
            modalStatusChange={handleRegistrationModalToggle}
            addingToArray={addingToUserList}
          />
        </Modal>

        <Modal open={editOpen} onClose={handleEditableModalToggle}>
          <EditPostFields
            modalStatusChange={handleEditableModalToggle}
            specificId={idForEditing}
            allPosts={mappedPosts}
          />
        </Modal>
      </div>
    </userContext.Provider>
  );
}
export default App;
