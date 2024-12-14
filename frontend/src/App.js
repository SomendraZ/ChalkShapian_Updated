import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import Discover from "./Pages/Discover";
import Forum from "./Pages/Forum";
import PostChalk from "./Pages/PostChalk";
import ChalkName from "./Pages/ChalkName";
import YourPost from "./Pages/YourPost";

const App = () => {
  const { loggedIn } = useAuth();
  const chalkName = localStorage.getItem("chalkName");

  return (
    <Routes>
      {/* Redirects for any route not matched */}
      <Route
        path="*"
        element={<Navigate to={loggedIn ? "/discover" : "/login"} replace />}
      />

      {/* Auth routes */}
      <Route
        path="/login"
        element={loggedIn ? <Navigate to="/discover" replace /> : <Login />}
      />
      <Route
        path="/signup"
        element={loggedIn ? <Navigate to="/discover" replace /> : <SignUp />}
      />

      {/* Protected Routes */}
      <Route
        path="/discover"
        element={loggedIn ? <Discover /> : <Navigate to="/login" replace />}
      />
      <Route path="/discover/:postId" Component={Discover}/>
      <Route
        path="/forum"
        element={
          loggedIn ? (
            <Forum chalkName={chalkName} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/post/image"
        element={loggedIn ? <PostChalk /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/post/video"
        element={loggedIn ? <PostChalk /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/chalkName"
        element={loggedIn ? <ChalkName /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/yourPost"
        element={loggedIn ? <YourPost /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
};

export default App;
