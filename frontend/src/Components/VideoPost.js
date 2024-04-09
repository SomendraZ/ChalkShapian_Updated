import React, { useState } from "react";
import "../CSS/VideoPost.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

let plus = require("../Resources/plus.png");

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB in bytes

const VideoPost = () => {
  const [title, setVideoTitle] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [toolsUsed, setVideoToolsUsed] = useState("");
  const [artist, setVideoArtist] = useState("");
  const [description, setVideoDescription] = useState("");
  // const [filters, setVideoFilters] = useState([]);
  const [selectedCoverImage, setSelectedCoverImage] = useState(null);
  const [selectedCoverImageFile, setSelectedCoverImageFile] = useState(null);
  // const type = "video";
  const navigate = useNavigate();

  const handleCoverImageChange = (e) => {
    const image = e.target.files[0];
    setSelectedCoverImageFile(image);
    setSelectedCoverImage(URL.createObjectURL(image));
  };

  const postVideo = async (e) => {
    e.preventDefault();

    // Check if required fields are not empty
    if (
      title === "" ||
      artist === "" ||
      selectedCoverImage === null ||
      videoLink === ""
    ) {
      toast.warning("Please fill in all required fields", {
        position: "top-left",
        autoClose: 1000,
      });
      return;
    }

    try {
      // Upload image and get download URL
      const image = selectedCoverImageFile;
      if (image.size > MAX_IMAGE_SIZE) {
        toast.warning("Image size should be less than 5 MB", {
          position: "top-left",
          autoClose: 1000,
        });
        return;
      }

      const data = 1;
      if (data === 1) {
        toast.success("Post sent successfully.", {
          position: "top-left",
          autoClose: 1000,
          onClose: () => navigate("/discover"),
        });
      } else if (data === 0) {
        toast.error("Post not sent.", {
          position: "top-left",
          autoClose: 1000,
        });
      }
    } catch (error) {
      toast.error("Something went wrong.", {
        position: "top-left",
        autoClose: 1000,
      });
    }
  };

  // const handleFilterChange = (e) => {
  //   const { value, checked } = e.target;
  //   if (checked) {
  //     setVideoFilters((prevFilters) => [...prevFilters, value]);
  //   } else {
  //     setVideoFilters((prevFilters) =>
  //       prevFilters.filter((filter) => filter !== value)
  //     );
  //   }
  // };

  return (
    <>
      <ToastContainer />
      <div className="video">
        <div className="videoDetails">
          <div className="addImage">
            Add Video Cover :
            <input
              type="file"
              id="imageAdd"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleCoverImageChange}
            />
            <label htmlFor="imageAdd">
              <div className="imageImage">
                {selectedCoverImage ? (
                  <img src={selectedCoverImage} alt="" id="imageImage" />
                ) : (
                  <img src={plus} alt="" id="imageImage" />
                )}
              </div>
            </label>
          </div>
          <div className="videoRight">
            <div className="videoTitle">Post Title :</div>
            <input
              id="videoTitle"
              placeholder="Post Title"
              value={title}
              onChange={(e) => setVideoTitle(e.target.value)}
            />
            <div className="videoLink">Video Link :</div>
            <input
              id="videoLink"
              placeholder="Video Link"
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
            />
            <div className="videoToolsUsed">Tools Used :</div>
            <input
              id="videoToolsUsed"
              placeholder="Tools Used"
              value={toolsUsed}
              onChange={(e) => setVideoToolsUsed(e.target.value)}
            />
            <div className="videoArtist">Artist Name :</div>
            <input
              id="videoArtist"
              placeholder="Artist Name"
              value={artist}
              onChange={(e) => setVideoArtist(e.target.value)}
            />
          </div>
        </div>
        <div id="filters">Filters :</div>
        <div className="filters">
          <label className="container">
            <input
              type="checkbox"
              className="checkbox"
              value="Simple Design"
              // onChange={handleFilterChange}
            />
            Simple Design
          </label>
          <label className="container">
            <input
              type="checkbox"
              className="checkbox"
              value="Creative Design"
              // onChange={handleFilterChange}
            />
            Creative Design
          </label>
          <label className="container">
            <input
              type="checkbox"
              className="checkbox"
              value="Faces"
              // onChange={handleFilterChange}
            />
            Faces
          </label>
          <label className="container">
            <input
              type="checkbox"
              className="checkbox"
              value="Architectures"
              // onChange={handleFilterChange}
            />
            Architectures
          </label>
          <label className="container">
            <input
              type="checkbox"
              className="checkbox"
              value="Weapons"
              // onChange={handleFilterChange}
            />
            Weapons
          </label>
          <label className="container">
            <input
              type="checkbox"
              className="checkbox"
              value="Others"
              // onChange={handleFilterChange}
            />
            Others
          </label>
        </div>
        <div className="description">
          <div className="videoDescription">Description :</div>
          <textarea
            id="videoDescription"
            placeholder="Description"
            value={description}
            onChange={(e) => setVideoDescription(e.target.value)}
          />
        </div>
        <div className="post" onClick={postVideo}>
          POST
        </div>
      </div>
    </>
  );
};

export default VideoPost;
