import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import Chalk from "../Resources/chalk_shapian.PNG";
import Profile from "../Resources/profile.png";
import "../CSS/Navbar.css";
import { useAuth } from "../AuthContext";

const Navbar = ({ dropdownOpen, setDropdownOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { chalkName, logout: authLogout } = useAuth();

  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    if (location.pathname === "/discover") {
      setActiveLink("Discover");
    } else if (location.pathname === "/forum") {
      setActiveLink("Forum");
    }
  }, [location]);

  const handleLogout = () => {
    authLogout();
    setDropdownOpen(false);
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
          <div id="profile" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <>
              {isAdmin ? (
                <>
                  Hi Admin,&nbsp;<u>{chalkName}</u>&nbsp;&nbsp;
                </>
              ) : (
                <>
                  Hi,&nbsp;<u>{chalkName}</u>&nbsp;&nbsp;
                </>
              )}
              <img className="profile" src={Profile} alt="Profile" />
            </>
          </div>
        </div>
      </div>
      {dropdownOpen && (
        <div className="profileDrop">
          <div className="closeProfile" onClick={() => setDropdownOpen(false)}>
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
