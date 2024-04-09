import "./index.css";
import Login from "./Components/Login";
import SignUp from "./Components/SignUp";
import Discover from "./Components/Discover";
import PostChalk from "./Components/PostChalk";
import Forum from "./Components/Forum";
import ChalkName from "./Components/ChalkName";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

const App = () => {
  useEffect(() => {
    const name = sessionStorage.getItem("chalkName");
    if (name !== "Chalk Shapian") {
      sessionStorage.setItem("chalkName", name);
      sessionStorage.setItem("LoggedIn", true);
    } else {
      sessionStorage.setItem("chalkName", "Chalk Shapian");
      sessionStorage.setItem("LoggedIn", false);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Navigate to="/discover" replace />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/post/image" element={<PostChalk />} />
        <Route path="/post/video" element={<PostChalk />} />
        <Route path="/chalkName" element={<ChalkName />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
