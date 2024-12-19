import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { REACT_APP_SERVER } from "../Services/Constant";

let x = require("../Resources/x.png");
let notFound = require("../Resources/notfound.png");

const PostComponent = ({ post, email, token, openModal, setOpenModal }) => {
  const navigate = useNavigate();

  const [postDetails, setPostDetails] = useState(null);
  const [postLikes, setPostLikes] = useState([]);
  const [postLikedByUser, setPostLikedByUser] = useState(false);

  useEffect(() => {
    if (post) {
      // Fetch post details including likes when the component mounts
      const fetchPost = async () => {
        try {
          const response = await fetch(`${REACT_APP_SERVER}/api/post/${post}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch post details");
          }

          const data = await response.json();
          setPostDetails(data.post);
          setPostLikes(data.post.likes);
          setPostLikedByUser(data.post.likes.includes(email)); // Check if the user has liked the post
        } catch (error) {
          navigate("/discover");
          setOpenModal(false);
          toast.error("Post not found. Please try again after Logout.", {
            position: "top-left",
            autoClose: 2000,
          });
        }
      };

      fetchPost();
    }
  }, [post, token, email, navigate, setOpenModal]);

  if (!postDetails) {
    return <div>Post not found</div>;
  }

  const handleShare = () => {
    const shareURL = `${window.location}`;

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
    // Optimistically update the like status and count
    const newLikes = postLikedByUser
      ? postLikes.filter((like) => like !== email)
      : [...postLikes, email];
    setPostLikes(newLikes);
    setPostLikedByUser(!postLikedByUser);

    // Optimistically update the like count
    const newLikeCount = postLikedByUser
      ? postDetails.likes.length - 1
      : postDetails.likes.length + 1;

    // Update the like count in the UI
    const updatedPostDetails = {
      ...postDetails,
      likes: newLikes,
      likeCount: newLikeCount,
    };

    setPostDetails(updatedPostDetails);

    try {
      const response = await fetch(
        `${REACT_APP_SERVER}/api/post/toggleLike/${post}`,
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
      // Revert state if API call fails
      setPostLikes(postLikes);
      setPostLikedByUser(!postLikedByUser);
      setPostDetails({
        ...postDetails,
        likeCount: postDetails.likes.length,
      });
      toast.error(
        "Failed to toggle like on the post. Please try again after Logout.",
        {
          position: "top-left",
          autoClose: 2000,
        }
      );
    }
  };

  const handleDiscuss = () => {
    const sharedLink = `${window.location}`;
    navigate(`/forum?sharedLink=${encodeURIComponent(sharedLink)}`);
  };

  return (
    <div>
      {/* Modal */}
      <div id="myModal" style={{ display: openModal ? "block" : "none" }}>
        <div className="right">
          <div className="type">
            <div className="postType">Post Type:</div>
            <div className="postTypeModal">{postDetails.postType}</div>
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
                  postLikedByUser ? "fa-heart" : "fa-heart-o"
                } likeLogo`}
              />
              <span className="likeCount">{postDetails.likes.length}</span>
              <span className="buttonLabel">
                {postLikedByUser ? "Unlike" : "Like"}
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
          {(postDetails.imageUrl || postDetails.coverImageUrl) && (
            <div className="imageAndDetails">
              <a
                href={postDetails.imageUrl || postDetails.coverImageUrl}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={postDetails.imageUrl || postDetails.coverImageUrl}
                  alt={`${postDetails.title} by ${postDetails.artist}`}
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
                    <div className="titleModal">{postDetails.title}</div>
                  </div>
                  <div className="detailRow">
                    <div className="label">Artist:</div>
                    <div className="artistModal">{postDetails.artist}</div>
                  </div>
                  <div className="detailRow">
                    <div className="label">Tools Used:</div>
                    <div className="toolsModal">{postDetails.toolsUsed}</div>
                  </div>
                  <div className="detailRow">
                    <div className="label">Filters:</div>
                    <div className="filtersModal">
                      {postDetails.filters.join(", ")}
                    </div>
                  </div>
                  {postDetails.videoLink && (
                    <div className="detailRow">
                      <div className="label">Video Link:</div>
                      <div className="videoLinkModal">
                        <a
                          href={postDetails.videoLink}
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
            <div className="descModal">{postDetails.description}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostComponent;
