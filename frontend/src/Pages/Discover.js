import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import PostComponent from "../Components/PostComponent.js";
import "../CSS/Discover.css";

let notFound = require("../Resources/notfound.png");

const Discover = () => {
  const [posts, setPosts] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPostID, setSelectedPostID] = useState(null);
  const [StyleAll, setStyleAll] = useState("contAll");
  const [StyleImage, setStyleImage] = useState("contVideo");
  const [StyleVideo, setStyleVideo] = useState("contVideo");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { postId } = useParams();
  const navigate = useNavigate();
  const email = localStorage.getItem("email");
  const token = localStorage.getItem("jwtToken");
  const role = localStorage.getItem("isAdmin");

  const REACT_APP_POST_ALL_API = process.env.REACT_APP_POST_ALL_API;
  const REACT_APP_POST_DELETE_API = process.env.REACT_APP_POST_DELETE_API;

  useEffect(() => {
    if (!token) {
      //redirect to login
      navigate("/login");
    }
  }, [token, navigate]);

  // Fetching posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(REACT_APP_POST_ALL_API, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error.message);
        toast.error("Please try again after Logout.", {
          position: "top-left",
          autoClose: 2000,
        });
      }
    };

    fetchPosts();
  }, [REACT_APP_POST_ALL_API, token, role]);

  // Filters Styling
  const changeStyleAll = () => {
    setStyleAll("contAll");
    setStyleImage("contVideo");
    setStyleVideo("contVideo");
    setFilterType("all");
    handleAreaFocus();
  };

  const changeStyleImage = () => {
    setStyleAll("contVideo");
    setStyleImage("contAll");
    setStyleVideo("contVideo");
    setFilterType("image");
    handleAreaFocus();
  };

  const changeStyleVideo = () => {
    setStyleAll("contVideo");
    setStyleImage("contVideo");
    setStyleVideo("contAll");
    setFilterType("video");
    handleAreaFocus();
  };

  // Filter posts based on search query and selected filter type (all, image, or video)
  const filteredPosts = posts.filter((post) => {
    const lowerQuery = searchQuery.toLowerCase();

    // Match search query
    const matchesSearch =
      post.title.toLowerCase().includes(lowerQuery) ||
      post.artist.toLowerCase().includes(lowerQuery) ||
      post.chalkName?.toLowerCase().includes(lowerQuery);

    // Match postType filter (All, Images, or Videos)
    const matchesType = filterType === "all" || post.postType === filterType;

    // Match dropdown category
    const matchesCategory =
      selectedCategory === "all" || post.filters.includes(selectedCategory);

    return matchesSearch && matchesType && matchesCategory;
  });

  // If postId exists in the URL, fetch post details by ID
  useEffect(() => {
    if (postId) {
      setSelectedPostID(postId);
      setDropdownOpen(false);
      setOpenModal(true);
    }
  }, [postId]);

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const response = await fetch(`${REACT_APP_POST_DELETE_API}${postId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete the post");
        }

        // Remove the deleted post from the state
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== postId)
        );

        toast.success("Post deleted successfully!", {
          position: "top-left",
          autoClose: 2000,
        });
      } catch (error) {
        console.error("Error deleting post:", error.message);
        toast.error(
          "Failed to delete the post. Please try again after Logout.",
          {
            position: "top-left",
            autoClose: 2000,
          }
        );
      }
    }
  };

  const handleAreaFocus = () => {
    if (dropdownOpen) {
      setDropdownOpen(false);
    }
  };

  return (
    <>
      <ToastContainer />
      {/* Overlay for modal */}
      <div className={`overlay ${openModal ? "active" : ""}`} />
      <div className={`wrapper ${openModal ? "blurred" : ""}`}>
        <Navbar dropdownOpen={dropdownOpen} setDropdownOpen={setDropdownOpen} />
        <div className="discover" onFocus={handleAreaFocus}>
          <div className="discoverBar">
            <select
              name="filter"
              className="custom-select"
              id="filter"
              value={selectedCategory} // Bind to state
              onChange={(e) => setSelectedCategory(e.target.value)} // Update state on selection
            >
              <option value="all">All Posts</option>
              {/* Other filter options */}
              <option value="Simple Design">Simple Design</option>
              <option value="Creative Design">Creative Design</option>
              <option value="Faces">Faces</option>
              <option value="Architectures">Architectures</option>
              <option value="Weapons">Weapons</option>
              <option value="Others">Others</option>
            </select>

            <div className="searchBar">
              <input
                id="searchBox"
                type="search"
                placeholder="Search..."
                value={searchQuery} // Bind input to search query
                onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
              />
              <button id="searchBtn">
                <i className="fa fa-search" />
              </button>
            </div>
            <div className="lola">
              <div className={StyleAll} id="all" onClick={changeStyleAll}>
                All
              </div>
              <div
                className={StyleImage}
                id="images"
                onClick={changeStyleImage}
              >
                Images
              </div>
              <div
                className={StyleVideo}
                id="videos"
                onClick={changeStyleVideo}
              >
                Videos
              </div>
            </div>
          </div>
          <div className="content">
            {/* Mapping filtered posts */}
            {filteredPosts.length === 0 ? (
              <div className="noPostFound">No posts found.</div>
            ) : (
              filteredPosts.map((post) => (
                <div
                  className={
                    post.postType === "image" ? "imgContent" : "vidContent"
                  }
                  key={post._id}
                  onClick={() => navigate(`/discover/${post._id}`)}
                >
                  <img
                    src={post.imageUrl || post.coverImageUrl}
                    alt={`${post.title} by ${post.artist}`}
                    id={post.postType === "image" ? "imgChalk" : "vidChalk"}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = notFound;
                    }}
                  />
                  <div className="craftName">{post.title}</div>
                  <div className="artistName">{post.artist}</div>

                  {/* Show delete button for post owner or admin */}
                  {(post.email === email || role === "true") && (
                    <button
                      className="deleteBtn"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the popUp
                        handleDeletePost(post._id); // Call delete handler
                      }}
                    >
                      <i className="fa fa-trash" aria-hidden="true"></i>
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        <Footer />
      </div>

      {/* Conditionally render PostComponent when openModal is true and selectedPost is set */}
      {openModal && (
        <PostComponent
          post={selectedPostID} // Pass selectedPost correctly here
          email={email}
          token={token}
          openModal={openModal}
          setOpenModal={setOpenModal}
        />
      )}
    </>
  );
};

export default Discover;
