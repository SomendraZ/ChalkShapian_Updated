import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import Chalk from "../Resources/chalk_shapian.PNG";
import Profile from "../Resources/profile.png";
import "../CSS/Navbar.css";
import { useAuth } from "../AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { loggedIn, chalkName, logout: authLogout } = useAuth();

  const [activeLink, setActiveLink] = useState("");
  const [open, setOpen] = useState(false);

  const handleYourPost = () => {
    setOpen(false);
    navigate("/yourPost");
  };

  const handlePostYourChalk = () => {
    setOpen(false);
    navigate("/post/image");
  };

  const handleLogout = () => {
    authLogout();
    setOpen(false);
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const currentPathname = window.location.pathname;
    if (currentPathname === "/discover") {
      setActiveLink("Discover");
    } else if (currentPathname === "/forum") {
      setActiveLink("Forum");
    }
  }, [loggedIn]);

  const handleLinkClick = (linkName) => {
    if (linkName === "Forum") {
      navigate("/forum");
    } else if (linkName === "Discover") {
      navigate("/discover");
    }
  };

  const profileOpen = () => {
    setOpen(!open);
  };

  return (
    <>
      <div className="navbar">
        <Link to="/discover">
          <img id="chalk" src={Chalk} alt="" />
        </Link>
        <div className="bar">
          <div className="disfor">
            <Link
              id="discover"
              className={
                activeLink === "Discover" ? "contToggle" : "contNotToggle"
              }
              onClick={() => handleLinkClick("Discover")}
              to="/discover"
              exact="true"
            >
              Discover
            </Link>
            <Link
              id="forum"
              className={
                activeLink === "Forum" ? "contToggle" : "contNotToggle"
              }
              onClick={() => handleLinkClick("Forum")}
              to="/forum"
            >
              Forum
            </Link>
          </div>
          <div id="profile" onClick={profileOpen}>
            <>
              Hi,&nbsp;<u>{chalkName}</u>&nbsp;&nbsp;
              <img className="profile" src={Profile} alt="" />
            </>
          </div>
        </div>
      </div>
      {open ? (
        <div className="profileDrop">
          <div className="closeProfile" onClick={profileOpen}>
            X
          </div>
          <div className="pfl">
            <div className="yourPosts" onClick={handleYourPost}>
              Your Posts
            </div>
            <div className="postYourChalkLink" onClick={handlePostYourChalk}>
              Post Your “CHALK”
            </div>
            <div className="logout" onClick={handleLogout}>
              Logout
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Navbar;
