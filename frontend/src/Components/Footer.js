import React from "react";
import Chalk from "../Resources/chalk_shapian.PNG";
import "../CSS/Footer.css";

let instaLink = "https://www.instagram.com/chalkshapian/";
let insta = require("../Resources/insta.png");
let youtubeLink = "https://www.youtube.com/@ChalkShapian";
let youtube = require("../Resources/youtube.png");
let twitterLink = "https://x.com/ChalkShapian";
const twitter = require("../Resources/twitter.png");

const Footer = () => {
  return (
    <>
      <div className="footer">
        <hr />
        <div id="footer">
          <div className="inc">
            <img src={Chalk} alt="" id="incLogo" />
            <div id="incName">
              <div className="white">Copyright © 2023&nbsp;</div>
              <div className="yellow">C</div>
              <div className="green">ha</div>
              <div className="yellow">lk</div>
              <div className="green">S</div>
              <div className="yellow">ha</div>
              <div className="green">pian</div>
              <div className="white">, Inc.</div>
            </div>
          </div>
          <div className="vLine" />
          <div className="follow">
            <div id="follow">
              <div className="white">Follow us at:&nbsp;</div>
              <div className="media">
                &nbsp;&nbsp;&nbsp;
                <a href={instaLink} target="_blank" rel="noreferrer">
                  <img id="insta" src={insta} alt="" />
                </a>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <a href={youtubeLink} target="_blank" rel="noreferrer">
                  <img id="youtube" src={youtube} alt="" />
                </a>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <a href={twitterLink} target="_blank" rel="noreferrer">
                  <img id="twitter" src={twitter} alt="" />
                </a>
              </div>
            </div>
            <div className="hFooterLine" />
            <div id="contact">
              <div className="white">Contact us at:&nbsp;</div>
              <a
                href="mailto:shapianchalk@gmail.com?subject=Inquiry&body=Hello%20Shapian%20Team,"
                className="contact"
                target="_blank"
                rel="noreferrer"
              >
                <span className="green">s</span>
                <span className="yellow">ha</span>
                <span className="green">pian</span>
                <span className="yellow">c</span>
                <span className="green">ha</span>
                <span className="yellow">lk</span>
                <span className="white">@gmail.com</span>
              </a>
            </div>
          </div>
          <div className="vLine" />
          <div className="terms">
            <div id="terms">Terms & Conditions</div>
            <div id="privacy">Privacy Policy</div>
            <div id="about">About</div>
          </div>
          <div className="vLine" />
          <div className="ads">
            <div id="ads"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
