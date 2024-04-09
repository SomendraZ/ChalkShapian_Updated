import React from "react";
import Navbar from "./Navbar";
// import Footer from "./Footer";
import Profile from "../Resources/profile.png";
import "../CSS/Forum.css";

const Forum = () => {
  return (
    <>
      <Navbar />
      <div className="forumPage">
        <div className="chat">
          <div className="chats">
            <div className="me">
              <div className="meDateTime">14/3/2023-12:30 PM </div>
              <div className="meSend">Hi</div>
            </div>
            <div className="notMe">
              <div className="notMeDateTime">14/3/2023-12:30 PM</div>
              <div className="notMeProfile">
                <img src={Profile} alt="" className="notMeProfileImage" />
                <div className="notMrProfileName">Someone</div>
              </div>
              <div className="notMeSend">Hi</div>
            </div>
          </div>
        </div>
        <div className="chatMe">
          <textarea placeholder="Send Message..." id="chatMe" />
          <div className="separation"></div>
          <button id="sendBtn">
            <i className="fa fa-send" />
          </button>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default Forum;
