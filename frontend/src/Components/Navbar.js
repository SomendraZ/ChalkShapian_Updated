import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import Chalk from "../Resources/chalk_shapian.PNG";
import Profile from "../Resources/profile.png";
import "../CSS/Navbar.css";
import { useAuth } from "../AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { chalkName, logout: authLogout } = useAuth();

  const [activeLink, setActiveLink] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Update activeLink state based on the current route
    if (location.pathname === "/discover") {
      setActiveLink("Discover");
    } else if (location.pathname === "/forum") {
      setActiveLink("Forum");
    }
  }, [location]);

  const handleLogout = () => {
    authLogout();
    setOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <>
      <div className="navbar">
        <Link to="/discover">
          <img id="chalk" src={Chalk} alt="Chalk Logo" />
        </Link>
        <div className="bar">
          <div className="disfor">
            <Link
              id="discover"
              className={
                activeLink === "Discover" ? "contToggle" : "contNotToggle"
              }
              to="/discover"
            >
              Discover
            </Link>
            <Link
              id="forum"
              className={
                activeLink === "Forum" ? "contToggle" : "contNotToggle"
              }
              to="/forum"
            >
              Forum
            </Link>
          </div>
          <div id="profile" onClick={() => setOpen(!open)}>
            <>
              Hi,&nbsp;<u>{chalkName}</u>&nbsp;&nbsp;
              <img className="profile" src={Profile} alt="Profile" />
            </>
          </div>
        </div>
      </div>
      {open && (
        <div className="profileDrop">
          <div className="closeProfile" onClick={() => setOpen(false)}>
            X
          </div>
          <div className="pfl">
            <div className="yourPosts" onClick={() => navigate("/yourPost")}>
              Your Posts
            </div>
            <div
              className="postYourChalkLink"
              onClick={() => navigate("/post/image")}
            >
              Post Your “CHALK”
            </div>
            <div className="logout" onClick={handleLogout}>
              Logout
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
