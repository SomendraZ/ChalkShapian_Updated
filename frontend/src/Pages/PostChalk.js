import React, { useState, useEffect, useCallback } from "react";
import "../CSS/PostChalk.css";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import ImagePost from "../Components/ImagePost";
import VideoPost from "../Components/VideoPost";
import { useNavigate } from "react-router-dom";

const PostChalk = () => {
  const navigate = useNavigate();
  const [isImage, setIsImage] = useState(true);
  const [PostChalkImage, setPostChalkImage] = useState("contChalkImage");
  const [PostChalkVideo, setPostChalkVideo] = useState("contChalkVideo");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleAreaFocus = useCallback(() => {
    if (dropdownOpen) {
      setDropdownOpen(false);
    }
  }, [dropdownOpen]);

  const changePostChalkImage = useCallback(() => {
    setIsImage(true);
    navigate("/post/image");
    setPostChalkImage("contChalkImage");
    setPostChalkVideo("contChalkVideo");
    handleAreaFocus();
  }, [navigate, handleAreaFocus]);

  const changePostChalkVideo = useCallback(() => {
    navigate("/post/video");
    setIsImage(false);
    setPostChalkImage("contChalkVideo");
    setPostChalkVideo("contChalkImage");
    handleAreaFocus();
  }, [navigate, handleAreaFocus]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [changePostChalkImage, changePostChalkVideo]);

  return (
    <>
      <Navbar dropdownOpen={dropdownOpen} setDropdownOpen={setDropdownOpen} />
      <div id="name" onFocus={handleAreaFocus}>
        <div className="postBar">
          <div className="postYourChalk">Post Your “CHALK”</div>
          <div className="lolala">
            <div
              className={PostChalkImage}
              id="image"
              onClick={changePostChalkImage}
            >
              Image
            </div>
            <div
              className={PostChalkVideo}
              id="video"
              onClick={changePostChalkVideo}
            >
              Video
            </div>
          </div>
        </div>
        {isImage ? <ImagePost /> : <VideoPost />}
      </div>
      <Footer />
    </>
  );
};

export default PostChalk;
