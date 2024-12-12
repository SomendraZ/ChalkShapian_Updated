import React, { useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
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
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const protectedRoutes = [
      "/discover",
      "/forum",
      "/post/image",
      "/post/video",
      "/chalkName",
      "/yourPost",
    ];
    const authRoutes = ["/login", "/signup"];

    if (!loggedIn) {
      if (protectedRoutes.includes(location.pathname)) {
        navigate("/login", { replace: true });
      }
    } else {
      if (authRoutes.includes(location.pathname)) {
        navigate("/discover", { replace: true });
      }
    }
  }, [loggedIn, navigate, location.pathname]);

  return (
    <Routes>
      <Route
        path="*"
        element={<Navigate to={loggedIn ? "/discover" : "/login"} replace />}
      />
      <Route
        path="/login"
        element={loggedIn ? <Navigate to="/discover" replace /> : <Login />}
      />
      <Route
        path="/signup"
        element={loggedIn ? <Navigate to="/discover" replace /> : <SignUp />}
      />
      <Route
        path="/discover"
        element={loggedIn ? <Discover /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/discover/post/:postId"
        element={loggedIn ? <Discover /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/forum"
        element={loggedIn ? <Forum /> : <Navigate to="/login" replace />}
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
