import { useState } from "react";
import "../CSS/ImagePost.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

let plus = require("../Resources/plus.png");

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB in bytes

const ImagePost = () => {
  const [title, setImageTitle] = useState("");
  const [toolsUsed, setImageToolsUsed] = useState("");
  const [artist, setImageArtist] = useState("");
  const [description, setImageDescription] = useState("");
  // const [filters, setImageFilters] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  // const type = "image";
  const navigate = useNavigate();

  function handleImageChange(e) {
    const image = e.target.files[0];
    setSelectedImageFile(image);
    setSelectedImage(URL.createObjectURL(image));
  }

  const postImage = async (e) => {
    e.preventDefault();

    // Check if required fields are not empty
    if (title === "" || artist === "" || selectedImage === null) {
      toast.warning("Please fill in all required fields", {
        position: "top-left",
        autoClose: 1000,
      });
      return;
    }

    toast.info("Posting...", {
      position: "top-left",
      autoClose: false,
      hideProgressBar: true,
    });

    try {
      const image = selectedImageFile;
      if (image.size > MAX_IMAGE_SIZE) {
        toast.warning("Image size should be less than 5 MB", {
          position: "top-left",
          autoClose: 1000,
        });
        return;
      }
      const data = 1; // Replace this with actual data
      if (data === 1) {
        toast.success("Post sent successfully.", {
          position: "top-left",
          autoClose: 1000,
          onClose: () => navigate("/discover"),
        });
      } else if (data !== 1) {
        toast.error("Post not sent.", {
          position: "top-left",
          autoClose: 1000,
        });
      }
    } catch (error) {
      toast.error("Post not sent.", {
        position: "top-left",
        autoClose: 1000,
      });
    }
  };

  // const handleFilterChange = (e) => {
  //   const { value, checked } = e.target;
  //   if (checked) {
  //     setImageFilters((prevFilters) => [...prevFilters, value]);
  //   } else {
  //     setImageFilters((prevFilters) =>
  //       prevFilters.filter((filter) => filter !== value)
  //     );
  //   }
  // };

  return (
    <>
      <ToastContainer />
      <div className="image">
        <div className="imageDetails">
          <div className="addImage">
            Add Image :
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
                  <img src={selectedImage} alt="" id="imageImage" />
                ) : (
                  <img src={plus} alt="" id="imageImage" />
                )}
              </div>
            </label>
          </div>

          <div className="imageRight">
            <div className="imageTitle">Post Title :</div>
            <input
              id="imageTitle"
              placeholder="Image Title"
              value={title}
              onChange={(e) => setImageTitle(e.target.value)}
            />
            <div className="imageToolsUsed">Tools Used :</div>
            <input
              id="imageToolsUsed"
              placeholder="Tools Used"
              value={toolsUsed}
              onChange={(e) => setImageToolsUsed(e.target.value)}
            />
            <div className="imageArtist">Artist Name :</div>
            <input
              id="imageArtist"
              placeholder="Artist Name"
              value={artist}
              onChange={(e) => setImageArtist(e.target.value)}
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
          <div className="imageDescription">Description :</div>
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
