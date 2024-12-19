import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../CSS/VideoPost.css";
import { uploadImageToCloudinary } from "../Services/CloudinaryService";
import { REACT_APP_SERVER } from "../Services/Constant";

let plus = require("../Resources/plus.png");

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB in bytes

const VideoPost = () => {
  const [selectedCoverImage, setSelectedCoverImage] = useState(null);
  const [selectedCoverImageFile, setSelectedCoverImageFile] = useState(null);
  const [title, setVideoTitle] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [toolsUsed, setVideoToolsUsed] = useState("");
  const [artist, setVideoArtist] = useState(
    localStorage.getItem("chalkName") || ""
  );
  const [description, setVideoDescription] = useState("");
  const [filters, setVideoFilters] = useState([]);
  const [isPosting, setIsPosting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const chalkName = localStorage.getItem("chalkName");
    if (chalkName) {
      setVideoArtist(chalkName);
    }
  }, []);

  const handleCoverImageChange = (e) => {
    const image = e.target.files[0];
    setSelectedCoverImageFile(image);
    setSelectedCoverImage(URL.createObjectURL(image));
  };

  const handleFilterChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setVideoFilters((prevFilters) => [...prevFilters, value]);
    } else {
      setVideoFilters((prevFilters) =>
        prevFilters.filter((filter) => filter !== value)
      );
    }
  };

  const validateFields = () => {
    let isValid = true;

    if (!title) {
      toast.error("Post Title is required", {
        position: "top-left",
        autoClose: 1000,
      });
      isValid = false;
    }
    if (!videoLink) {
      toast.error("Video Link is required", {
        position: "top-left",
        autoClose: 1000,
      });
      isValid = false;
    }
    if (!artist) {
      toast.error("Artist Name is required", {
        position: "top-left",
        autoClose: 1000,
      });
      isValid = false;
    }
    if (!selectedCoverImage) {
      toast.error("Video Cover Image is required", {
        position: "top-left",
        autoClose: 1000,
      });
      isValid = false;
    }
    if (!toolsUsed) {
      toast.error("Tools Used are required", {
        position: "top-left",
        autoClose: 1000,
      });
      isValid = false;
    }
    if (filters.length === 0) {
      toast.error("At least one filter must be selected", {
        position: "top-left",
        autoClose: 1000,
      });
      isValid = false;
    }
    if (!description) {
      toast.error("Description is required", {
        position: "top-left",
        autoClose: 1000,
      });
      isValid = false;
    }

    return isValid;
  };

  // Retrieve JWT token from localStorage
  const token = localStorage.getItem("jwtToken");

  const postVideo = async (e) => {
    e.preventDefault();

    // Prevent multiple requests
    if (isPosting) return;

    // Validate all fields
    if (!validateFields()) {
      return;
    }

    setIsPosting(true); // Set loading state
    toast.info("Posting...", {
      position: "top-left",
      autoClose: false,
      hideProgressBar: true,
    });

    try {
      const image = selectedCoverImageFile;
      if (image.size > MAX_IMAGE_SIZE) {
        toast.error("Image size should be less than 5 MB", {
          position: "top-left",
          autoClose: 1000,
        });
        setIsPosting(false);
        return;
      }

      const email = localStorage.getItem("email");
      const chalkName = localStorage.getItem("chalkName");

      // Upload the image and get the URL from Cloudinary
      const coverImageUrl = await uploadImageToCloudinary(image, email);

      // Create the post data object
      const postData = {
        title: title,
        toolsUsed: toolsUsed,
        artist: artist,
        description: description,
        filters: filters,
        videoLink: videoLink,
        coverImageUrl: coverImageUrl,
        email: email,
        chalkName: chalkName,
      };

      // Send POST request to the backend API with JSON payload
      const response = await fetch(`${REACT_APP_SERVER}/api/post/video`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (data.message === "Video post created successfully.") {
        toast.success("Post sent successfully.", {
          position: "top-left",
          autoClose: 1000,
          onClose: () => navigate("/discover"),
        });
      } else {
        toast.error("Post not sent.", {
          position: "top-left",
          autoClose: 1000,
        });
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again after Logout.", {
        position: "top-left",
        autoClose: 1000,
      });
    } finally {
      setIsPosting(false);
    }
  };

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
                  <img src={selectedCoverImage} alt="Cover" id="imageImage" />
                ) : (
                  <img src={plus} alt="Placeholder" id="imageImage" />
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
              onChange={handleFilterChange}
            />
            Simple Design
          </label>
          <label className="container">
            <input
              type="checkbox"
              className="checkbox"
              value="Creative Design"
              onChange={handleFilterChange}
            />
            Creative Design
          </label>
          <label className="container">
            <input
              type="checkbox"
              className="checkbox"
              value="Faces"
              onChange={handleFilterChange}
            />
            Faces
          </label>
          <label className="container">
            <input
              type="checkbox"
              className="checkbox"
              value="Architectures"
              onChange={handleFilterChange}
            />
            Architectures
          </label>
          <label className="container">
            <input
              type="checkbox"
              className="checkbox"
              value="Weapons"
              onChange={handleFilterChange}
            />
            Weapons
          </label>
          <label className="container">
            <input
              type="checkbox"
              className="checkbox"
              value="Others"
              onChange={handleFilterChange}
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
