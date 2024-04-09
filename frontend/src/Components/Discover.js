import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../CSS/Discover.css";

const Discover = () => {
  const [posts, ] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [selectedDesc, setSelectedDesc] = useState(null);

  const imgPopUp = (post) => {
    setOpenModal(!openModal);
    setSelectedPost(post);
    setSelectedTitle(post.title);
    setSelectedArtist(post.artist);
    setSelectedDesc(post.description);
  };

  const [StyleAll, setStyleAll] = useState("contAll");
  const [StyleImage, setStyleImage] = useState("contVideo");
  const [StyleVideo, setStyleVideo] = useState("contVideo");

  const changeStyleAll = () => {
    setStyleAll("contAll");
    setStyleImage("contVideo");
    setStyleVideo("contVideo");
  };
  const changeStyleImage = () => {
    setStyleAll("contVideo");
    setStyleImage("contAll");
    setStyleVideo("contVideo");
  };
  const changeStyleVideo = () => {
    setStyleAll("contVideo");
    setStyleImage("contVideo");
    setStyleVideo("contAll");
  };
  return (
    <>
      <Navbar />
      <div className="discover">
        <div className="discoverBar">
          <select name="filter" className="custom-select" id="filter">
            <option value="newestPost">Newest Posts</option>
            <option value="mostLiked">Most Liked</option>
            <option value="simpleDesign">Simple Design</option>
            <option value="creativeDesign">Creative Design</option>
            <option value="faces">Faces</option>
            <option value="architectures">Architectures</option>
            <option value="weapons">Weapons</option>
            <option value="others">Others</option>
            <option value="shapianSpecial">Shapian's Special</option>
          </select>
          <div className="searchBar">
            <input id="searchBox" type="search" placeholder="   Search..." />
            <button id="searchBtn">
              <i className="fa fa-search" />
            </button>
          </div>
          <div className="lola">
            <div className={StyleAll} id="all" onClick={changeStyleAll}>
              All
            </div>
            <div className={StyleImage} id="images" onClick={changeStyleImage}>
              Images
            </div>
            <div className={StyleVideo} id="videos" onClick={changeStyleVideo}>
              Videos
            </div>
          </div>
        </div>
        <Link className="float" to="/post/image">
          <i className="fa fa-plus my-float"></i>
        </Link>
        <div className="content">
          {openModal && selectedPost ? (
            <div id="myModal">
              <span className="close" onClick={() => setOpenModal(false)}>
                &times;
              </span>
              <div id="info">
                <img src={selectedPost.imgURL} alt="" id="imgModal" />
                <div className="imgDes">
                  <div id="titleSection">
                    <div className="label">Title</div>
                    <div className="titleModal">{selectedTitle}</div>
                  </div>
                  <div id="artistSection">
                    <div className="label">Artist</div>
                    <div className="artistModal">{selectedArtist}</div>
                  </div>
                  <div id="descSection">
                    <div className="label">Description</div>
                    <div className="descModal">{selectedDesc}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {posts.map((post) => {
            if (post.type === "image") {
              return (
                <div className="imgContent" key={post.id}>
                  <img
                    src={post.imgURL}
                    alt="chalk carving"
                    id="imgChalk"
                    onClick={() => imgPopUp(post)}
                  />
                  <div className="craftName">{post.title}</div>
                  <div className="artistName">{post.artist}</div>
                </div>
              );
            } else if (post.type === "video") {
              return (
                <div className="vidContent" key={post.id}>
                  <img
                    src={post.imgCoverURL}
                    alt="chalk carving"
                    id="vidChalk"
                  />
                  <div className="craftName">{post.title}</div>
                  <div className="artistName">{post.artist}</div>
                </div>
              );
            } else {
              return null; // Post type not recognized
            }
          })}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Discover;
