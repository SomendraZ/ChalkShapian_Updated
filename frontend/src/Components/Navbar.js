import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Chalk from "../Resources/chalk_shapian.PNG";
import Profile from "../Resources/profile.png";
import "../CSS/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState("");
  const [open, setOpen] = useState(false);
  const LoggedIn = sessionStorage.getItem("LoggedIn") === "true";
  const name = sessionStorage.getItem("chalkName")

  useEffect(() => {
    const currentPathname = window.location.pathname;
    if (
      currentPathname === "/discover" ||
      currentPathname === "/forum" ||
      currentPathname === "/post/image" ||
      currentPathname === "/post/video"
    ) {
      if (!LoggedIn) navigate("/login", { replace: true });
    }
  }, [LoggedIn, navigate]);

  function logout() {
    sessionStorage.setItem("LoggedIn", "false");
    sessionStorage.setItem("chalkName", "Chalk Shapian");
    setOpen(false);
    navigate("/login", { replace: true });
  }

  useEffect(() => {
    setActiveLink("Discover");
    const currentPathname = window.location.pathname;
    if (currentPathname === "/discover") {
      setActiveLink("Discover");
    } else if (currentPathname === "/forum") {
      setActiveLink("Forum");
    }
  }, [LoggedIn]);
  
  function handleLinkClick(linkName) {
    if (linkName === "Forum") {
      navigate("/forum");
    } else if (linkName === "Discover") {
      navigate("/discover");
    }
  }

  function profileOpen() {
    setOpen(!open);
  }

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
                Hi,&nbsp;<u>{name}</u>&nbsp;&nbsp;
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
              <div className="yourPosts">Your Posts</div>
              <div className="yourLiked">Your Liked Posts</div>
              <div className="logout" onClick={logout}>
                Logout
              </div>
            </div>
        </div>
      ) : null}
    </>
  );
};

export default Navbar;
  