import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../AuthContext";

let x = require("../Resources/x.png");
let notFound = require("../Resources/notfound.png");

const PostComponent = ({ post, email, token, openModal, setOpenModal }) => {
  const [selectedPostLikes, setSelectedPostLikes] = useState([]);
  const [selectedPostLikedByUser, setSelectedPostLikedByUser] = useState(false);
  const [loading, setLoading] = useState(false);

  const { logout: authLogout } = useAuth();

  const REACT_APP_POST_TOGGLE_LIKE_API =
    process.env.REACT_APP_POST_TOGGLE_LIKE_API;

  const navigate = useNavigate();

  useEffect(() => {
    setSelectedPostLikes(post.likes);
    setSelectedPostLikedByUser(post.likes.includes(email));
  }, [post, email]);

  const handleShare = () => {
    const shareURL = `${window.location.origin}/discover/${post._id}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(shareURL)
        .then(() => {
          toast.info("Link copied to clipboard!", {
            position: "top-left",
            autoClose: 1000,
          });
        })
        .catch((error) => {
          console.error("Error copying to clipboard:", error.message);
          toast.error("Failed to copy link. Try again.", {
            position: "top-left",
            autoClose: 2000,
          });
        });
    } else {
      const tempInput = document.createElement("input");
      tempInput.value = shareURL;
      document.body.appendChild(tempInput);
      tempInput.select();
      tempInput.setSelectionRange(0, 99999);
      document.execCommand("copy");
      document.body.removeChild(tempInput);

      toast.info("Link copied to clipboard!", {
        position: "top-left",
        autoClose: 1000,
      });
    }
  };

  const handleToggleLike = async () => {
    if (loading) return;
    setLoading(true);

    // Optimistically update the state
    const newLikes = selectedPostLikedByUser
      ? selectedPostLikes.filter((like) => like !== email)
      : [...selectedPostLikes, email];
    setSelectedPostLikes(newLikes);
    setSelectedPostLikedByUser(!selectedPostLikedByUser);

    try {
      const response = await fetch(
        `${REACT_APP_POST_TOGGLE_LIKE_API}${post._id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to toggle like on the post.");
      }

      const data = await response.json();
      toast.info(data.message, {
        position: "top-left",
        autoClose: 1000,
      });
    } catch (error) {
      console.error("Error toggling like on post:", error.message);
      // Revert state if API call fails
      setSelectedPostLikes(selectedPostLikes);
      setSelectedPostLikedByUser(!selectedPostLikedByUser);
      authLogout();
      toast.error(
        "Failed to toggle like on the post. Please try again after Login.",
        {
          position: "top-left",
          autoClose: 2000,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDiscuss = () => {
    const sharedLink = `${window.location.origin}/discover/${post._id}`;
    navigate(`/forum?sharedLink=${encodeURIComponent(sharedLink)}`);
  };

  return (
    <div>
      {/* Modal */}
      <div id="myModal" style={{ display: openModal ? "block" : "none" }}>
        <div className="right">
          <div className="type">
            <div className="postType">Post Type:</div>
            <div className="postTypeModal">{post.postType}</div>
          </div>
          <div className="likeShareComment">
            <div
              className="actionItem"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleLike();
              }}
            >
              <i
                className={`fa ${
                  selectedPostLikedByUser ? "fa-heart" : "fa-heart-o"
                } likeLogo`}
              />
              <span className="likeCount">{selectedPostLikes.length}</span>
              <span className="buttonLabel">
                {selectedPostLikedByUser ? "Unlike" : "Like"}
              </span>
            </div>

            <div className="actionItem" onClick={handleShare}>
              <i className="fa fa-share shareLogo" />
              <span className="buttonLabel">Share</span>
            </div>
            <div className="actionItem" onClick={handleDiscuss}>
              <i className="fa fa-comment commentLogo" />
              <span className="buttonLabel">Discuss</span>
            </div>
          </div>
          <img
            className="close"
            src={x}
            alt="close"
            onClick={() => {
              setOpenModal(false);
              navigate("/discover");
            }}
          />
        </div>

        <div id="info">
          {(post.imageUrl || post.coverImageUrl) && (
            <div className="imageAndDetails">
              <a
                href={post.imageUrl || post.coverImageUrl}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={post.imageUrl || post.coverImageUrl}
                  alt={`${post.title} by ${post.artist}`}
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
                    <div className="titleModal">{post.title}</div>
                  </div>
                  <div className="detailRow">
                    <div className="label">Artist:</div>
                    <div className="artistModal">{post.artist}</div>
                  </div>
                  <div className="detailRow">
                    <div className="label">Tools Used:</div>
                    <div className="toolsModal">{post.toolsUsed}</div>
                  </div>
                  <div className="detailRow">
                    <div className="label">Filters:</div>
                    <div className="filtersModal">
                      {post.filters.join(", ")}
                    </div>
                  </div>
                  {post.videoLink && (
                    <div className="detailRow">
                      <div className="label">Video Link:</div>
                      <div className="videoLinkModal">
                        <a
                          href={post.videoLink}
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
            <div className="descModal">{post.description}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostComponent;
