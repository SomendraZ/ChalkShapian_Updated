import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "../CSS/Discover.css";

let x = require("../Resources/x.png");
let notFound = require("../Resources/notfound.png");

const Discover = () => {
  const [posts, setPosts] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [StyleAll, setStyleAll] = useState("contAll");
  const [StyleImage, setStyleImage] = useState("contVideo");
  const [StyleVideo, setStyleVideo] = useState("contVideo");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const API_URL = process.env.REACT_APP_POST_ALL_API;

  // Fetching posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error.message);
      }
    };

    fetchPosts();
  }, [API_URL]);

  // Modal Toggle
  const popUp = (post) => {
    setOpenModal(!openModal);
    setSelectedPost(post);
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

    console.log(matchesCategory);
    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <>
      {/* Overlay for modal */}
      <div className={`overlay ${openModal ? "active" : ""}`} />
      <div className={`wrapper ${openModal ? "blurred" : ""}`}>
        <Navbar />
        <div className="discover">
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
              {/* <option value="shapianSpecial">Shapian's Special</option> */}
            </select>

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
          <Link className="float" to="/post/image">
            <i className="fa fa-plus my-float"></i>
          </Link>
          <div className="content">
            {/* Mapping filtered posts */}
            {filteredPosts.map((post) => (
              <div
                className={
                  post.postType === "image" ? "imgContent" : "vidContent"
                }
                key={post._id}
                onClick={() => popUp(post)}
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
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>

      {/* Modal */}
      {openModal && selectedPost ? (
        <div id="myModal">
          <div className="right">
            <div className="type">
              <div className="postType">Post Type:</div>
              <div className="postTypeModal">{selectedPost.postType}</div>
            </div>
            <img
              className="close"
              src={x}
              alt="close"
              onClick={() => setOpenModal(false)}
            />
          </div>

          <div id="info">
            {(selectedPost.imageUrl || selectedPost.coverImageUrl) && (
              <div className="imageAndDetails">
                <a
                  href={selectedPost.imageUrl || selectedPost.coverImageUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={selectedPost.imageUrl || selectedPost.coverImageUrl}
                    alt={`${selectedPost.title} by ${selectedPost.artist}`}
                    className="imageContainer"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = notFound;
                    }}
                  />
                </a>
                <div className="detailsContainer">
                  <div className="details">
                    <div className="detailRow">
                      <div className="label">Title:</div>
                      <div className="titleModal">{selectedPost.title}</div>
                    </div>
                    <div className="detailRow">
                      <div className="label">Artist:</div>
                      <div className="artistModal">{selectedPost.artist}</div>
                    </div>
                    <div className="detailRow">
                      <div className="label">Tools Used:</div>
                      <div className="toolsModal">{selectedPost.toolsUsed}</div>
                    </div>
                    <div className="detailRow">
                      <div className="label">Filters:</div>
                      <div className="filtersModal">
                        {selectedPost.filters.join(", ")}
                      </div>
                    </div>
                    {selectedPost.videoLink && (
                      <div className="detailRow">
                        <div className="label">Video Link:</div>
                        <div className="videoLinkModal">
                          <a
                            href={selectedPost.videoLink}
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
              <div className="descModal">{selectedPost.description}</div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Discover;
