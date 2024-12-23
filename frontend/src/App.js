import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import Discover from "./Pages/Discover";
import Forum from "./Pages/Forum";
import PostChalk from "./Pages/PostChalk";
import YourPost from "./Pages/YourPost";
import OTPVerificationPage from "./Pages/OTPVerificationPage";

const App = () => {
  const { loggedIn, setLoggedIn } = useAuth();
  const chalkName = localStorage.getItem("chalkName");
  const jwtToken = localStorage.getItem("jwtToken");
  const email = localStorage.getItem("email");

  useEffect(() => {
    // If JWT token exists in localStorage, consider user as logged in
    if (jwtToken) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [jwtToken, setLoggedIn]);

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
      <Route
        path="/otpVerification"
        element={
          !loggedIn && email ? (
            <OTPVerificationPage />
          ) : (
            <Navigate to="/discover" replace />
          )
        }
      />

      {/* Protected Routes */}
      <Route
        path="/discover"
        element={loggedIn ? <Discover /> : <Navigate to="/login" replace />}
      />
      <Route path="/discover/:postId" element={<Discover />} />
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
        path="/yourPost"
        element={loggedIn ? <YourPost /> : <Navigate to="/login" replace />}
      />
      <Route path="/yourPost/:postId" element={<YourPost />} />
    </Routes>
  );
};

export default App;
