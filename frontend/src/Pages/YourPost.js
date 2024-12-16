import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "../CSS/YourPost.css";
import { useAuth } from "../AuthContext";

let x = require("../Resources/x.png");
let notFound = require("../Resources/notfound.png");

const YourPost = () => {
  const email = localStorage.getItem("email");
  const REACT_APP_USER_POST_API = process.env.REACT_APP_USER_POST_API + email;
  const REACT_APP_POST_DELETE_API = process.env.REACT_APP_POST_DELETE_API;

  const { logout: authLogout } = useAuth();

  // Retrieve JWT token from localStorage
  const token = localStorage.getItem("jwtToken");

  const [userPosts, setUserPosts] = useState([]);
  const [openUserModal, setOpenUserModal] = useState(false);
  const [selectedUserPost, setSelectedUserPost] = useState(null);
  const [StyleAll, setStyleAll] = useState("contAll");
  const [StyleImage, setStyleImage] = useState("contVideo");
  const [StyleVideo, setStyleVideo] = useState("contVideo");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Fetching posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(REACT_APP_USER_POST_API, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setUserPosts(data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error.message);
        authLogout();
        toast.error("Please try again after Login.", {
          position: "top-left",
          autoClose: 2000,
        });
      }
    };

    fetchPosts();
  }, [REACT_APP_USER_POST_API, token, authLogout]);

  // Modal Toggle
  const userPopUp = (post) => {
    setOpenUserModal(!openUserModal);
    setSelectedUserPost(post);
  };

  // Filters Styling
  const changeStyleAll = () => {
    setStyleAll("contAll");
    setStyleImage("contVideo");
    setStyleVideo("contVideo");
    setFilterType("all");
  };

  const changeStyleImage = () => {
    setStyleAll("contVideo");
    setStyleImage("contAll");
    setStyleVideo("contVideo");
    setFilterType("image");
  };

  const changeStyleVideo = () => {
    setStyleAll("contVideo");
    setStyleImage("contVideo");
    setStyleVideo("contAll");
    setFilterType("video");
  };

  // Filter user posts based on search query and selected filter type (all, image, or video)
  const filteredUserPosts = userPosts.filter((userPost) => {
    const searchQueryLower = searchQuery.toLowerCase();

    // Match search query
    const matchesSearchQuery =
      userPost.title.toLowerCase().includes(searchQueryLower) ||
      userPost.artist.toLowerCase().includes(searchQueryLower) ||
      userPost.chalkName.toLowerCase().includes(searchQueryLower);

    // Match User Posts filter (All, Image, Video)
    const matchesFilterType =
      filterType === "all" || userPost.postType === filterType;

    // Match Dropdown Category
    const matchesCategory =
      selectedCategory === "all" || userPost.filters.includes(selectedCategory);

    return matchesSearchQuery && matchesFilterType && matchesCategory;
  });

  // Handle delete post by ID
  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const response = await fetch(`${REACT_APP_POST_DELETE_API}/${postId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete the post");
        }

        // Remove the deleted post from the state
        setUserPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== postId)
        );

        toast.success("Post deleted successfully!", {
          position: "top-left",
          autoClose: 2000,
        });
      } catch (error) {
        console.error("Error deleting post:", error.message);
        authLogout();
        toast.error(
          "Failed to delete the post. Please try again after Login.",
          {
            position: "top-left",
            autoClose: 2000,
          }
        );
      }
    }
  };

  return (
    <>
      <ToastContainer />
      {/* Overlay for modal */}
      <div className={`overlay ${openUserModal ? "active" : ""}`} />
      <div className={`wrapper ${openUserModal ? "blurred" : ""}`}>
        <Navbar />
        <div className="discover">
          <div className="discoverBar" id="yourPostDiscoverBar">
            <div className="yourPostFilters">
              <div className="postYourChalk">“Your Posts”</div>
              <select
                name="filter"
                className="custom-select"
                id="filter"
                value={selectedCategory} // Bind to state
                onChange={(e) => setSelectedCategory(e.target.value)} // Update state on selection
              >
                <option value="all">All Posts</option>
                <option value="Simple Design">Simple Design</option>
                <option value="Creative Design">Creative Design</option>
                <option value="Faces">Faces</option>
                <option value="Architectures">Architectures</option>
                <option value="Weapons">Weapons</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div className="searchBarLola">
              <div className="searchBar">
                <input
                  id="searchBox"
                  type="search"
                  placeholder="   Search..."
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
          </div>
          <div className="content" id="yourPostContent">
            {/* Mapping filtered posts */}
            {filteredUserPosts.length === 0 ? (
              <div>No posts found</div>
            ) : (
              filteredUserPosts.map((post) => (
                <div
                  className={
                    post.postType === "image" ? "imgContent" : "vidContent"
                  }
                  key={post._id}
                  onClick={() => userPopUp(post)}
                >
                  <img
                    src={post.imageUrl || post.coverImageUrl}
                    alt={`${post.title} by ${post.artist}`}
                    id={post.postType === "image" ? "imgChalk" : "vidChalk"}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = notFound; // Fallback to notFound image
                    }}
                  />
                  <div className="craftName">{post.title}</div>
                  <div className="artistName">{post.artist}</div>
                  {/* Delete Icon: Show only if the post belongs to the logged-in user */}
                  {post.email === email && (
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
      </div>

      {/* Modal */}
      {openUserModal && selectedUserPost ? (
        <div id="myModal">
          <div className="right">
            <div className="type">
              <div className="postType">Post Type:</div>
              <div className="postTypeModal">{selectedUserPost.postType}</div>
            </div>
            <img
              className="close"
              src={x}
              alt="close"
              onClick={() => setOpenUserModal(false)}
            />
          </div>

          <div id="info">
            {(selectedUserPost.imageUrl || selectedUserPost.coverImageUrl) && (
              <div className="imageAndDetails">
                <a
                  href={
                    selectedUserPost.imageUrl || selectedUserPost.coverImageUrl
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={
                      selectedUserPost.imageUrl ||
                      selectedUserPost.coverImageUrl
                    }
                    alt={`${selectedUserPost.title} by ${selectedUserPost.artist}`}
                    className="imageContainer"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = notFound; // Fallback to notFound image
                    }}
                  />
                </a>
                <div className="detailsContainer">
                  <div className="details">
                    <div className="detailRow">
                      <div className="label">Title:</div>
                      <div className="titleModal">{selectedUserPost.title}</div>
                    </div>
                    <div className="detailRow">
                      <div className="label">Artist:</div>
                      <div className="artistModal">
                        {selectedUserPost.artist}
                      </div>
                    </div>
                    <div className="detailRow">
                      <div className="label">Tools Used:</div>
                      <div className="toolsModal">
                        {selectedUserPost.toolsUsed}
                      </div>
                    </div>
                    <div className="detailRow">
                      <div className="label">Filters:</div>
                      <div className="filtersModal">
                        {selectedUserPost.filters.join(", ")}
                      </div>
                    </div>
                    {selectedUserPost.videoLink && (
                      <div className="detailRow">
                        <div className="label">Video Link:</div>
                        <div className="videoLinkModal">
                          <a
                            href={selectedUserPost.videoLink}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Watch Video
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            <div className="descriptionModal">
              <div className="label">Description:</div>
              <div className="descModal">{selectedUserPost.description}</div>
            </div>
          </div>
        </div>
      ) : null}
      <Footer />
    </>
  );
};

export default YourPost;
