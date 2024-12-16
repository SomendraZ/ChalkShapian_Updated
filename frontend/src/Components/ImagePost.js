import React, { useState, useEffect } from "react";
import "../CSS/ImagePost.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { uploadImageToCloudinary } from "../Services/CloudinaryService";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../AuthContext";

let plus = require("../Resources/plus.png");

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB in bytes

const ImagePost = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [title, setImageTitle] = useState("");
  const [toolsUsed, setImageToolsUsed] = useState("");
  const [artist, setImageArtist] = useState(
    localStorage.getItem("chalkName") || ""
  );
  const [description, setImageDescription] = useState("");
  const [filters, setImageFilters] = useState([]);
  const [isPosting, setIsPosting] = useState(false);
  const navigate = useNavigate();

  const { logout: authLogout } = useAuth();

  useEffect(() => {
    const chalkName = localStorage.getItem("chalkName");
    if (chalkName) {
      setImageArtist(chalkName);
    }
  }, []);

  function handleImageChange(e) {
    const image = e.target.files[0];
    setSelectedImageFile(image);
    setSelectedImage(URL.createObjectURL(image));
  }

  const handleFilterChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setImageFilters((prevFilters) => [...prevFilters, value]);
    } else {
      setImageFilters((prevFilters) =>
        prevFilters.filter((filter) => filter !== value)
      );
    }
  };

  const validateFields = () => {
    let isValid = true;

    if (!title) {
      toast.error("Title is required", {
        position: "top-left",
        autoClose: 1000,
      });
      isValid = false;
    }
    if (!toolsUsed) {
      toast.error("Tools used are required", {
        position: "top-left",
        autoClose: 1000,
      });
      isValid = false;
    }
    if (!artist) {
      toast.error("Artist name is required", {
        position: "top-left",
        autoClose: 1000,
      });
      isValid = false;
    }
    if (!selectedImage) {
      toast.error("Image is required", {
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
    if (filters.length === 0) {
      toast.error("At least one filter is required", {
        position: "top-left",
        autoClose: 1000,
      });
      isValid = false;
    }

    return isValid;
  };

  // Retrieve JWT token from localStorage
  const token = localStorage.getItem("jwtToken");

  const postImage = async (e) => {
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
      const image = selectedImageFile;
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
      const imageUrl = await uploadImageToCloudinary(image, email);

      // Create the post data object
      const postData = {
        title: title,
        toolsUsed: toolsUsed,
        artist: artist,
        description: description,
        filters: filters,
        imageUrl: imageUrl,
        email: email,
        chalkName: chalkName,
      };

      // Send POST request to the backend API with JSON payload
      const response = await fetch(`${process.env.REACT_APP_POST_IMAGE_API}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (data.message === "Image post created successfully.") {
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
      authLogout();
      toast.error("Post not sent. Please try again after Login.", {
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
      <div className="image">
        <div className="imageDetails">
          <div className="addImage">
            Add Image:
            <input
              type="file"
              id="imageAdd"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            <label htmlFor="imageAdd">
              <div className="imageImage">
                {selectedImage ? (
                  <img src={selectedImage} alt="Selected" id="imageImage" />
                ) : (
                  <img src={plus} alt="Placeholder" id="imageImage" />
                )}
              </div>
            </label>
          </div>

          <div className="imageRight">
            <div className="imageTitle">Post Title:</div>
            <input
              id="imageTitle"
              placeholder="Image Title"
              value={title}
              onChange={(e) => setImageTitle(e.target.value)}
            />

            <div className="imageToolsUsed">Tools Used:</div>
            <input
              id="imageToolsUsed"
              placeholder="Tools Used"
              value={toolsUsed}
              onChange={(e) => setImageToolsUsed(e.target.value)}
            />

            <div className="imageArtist">Artist Name:</div>
            <input
              id="imageArtist"
              placeholder="Artist Name"
              value={artist}
              onChange={(e) => setImageArtist(e.target.value)}
            />
          </div>
        </div>

        <div id="filters">Filters:</div>
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
          <div className="imageDescription">Description:</div>
          <textarea
            id="imageDescription"
            placeholder="Description"
            value={description}
            onChange={(e) => setImageDescription(e.target.value)}
          />
        </div>

        <div className="post" onClick={postImage}>
          POST
        </div>
      </div>
    </>
  );
};

export default ImagePost;
