import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import Navbar from "../Components/Navbar";
import Profile from "../Resources/profile.png";
import "../CSS/Forum.css";

const Forum = ({ chalkName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const chatEndRef = useRef(null);
  const location = useLocation();

  const REACT_APP_FORUM_GET_API = process.env.REACT_APP_FORUM_GET_API;
  const REACT_APP_FORUM_SEND_API = process.env.REACT_APP_FORUM_SEND_API;
  const REACT_APP_SOCKET_SERVER = process.env.REACT_APP_SOCKET_SERVER;
  const socket = useRef(null);

  const token = localStorage.getItem("jwtToken");

  // Fetch messages on component mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(REACT_APP_FORUM_GET_API, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        toast.error("Please try again after Logout.", {
          position: "top-left",
          autoClose: 2000,
        });
      }
    };

    fetchMessages();
  }, [REACT_APP_FORUM_GET_API, chalkName, token]);

  // Connect to Socket.IO server on component mount
  useEffect(() => {
    socket.current = io(REACT_APP_SOCKET_SERVER, {
      query: { token }, // Send the token as query param
    });

    socket.current.on("newMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [REACT_APP_SOCKET_SERVER, token]);

  // Scroll to the bottom whenever messages are updated
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Wrap handleSend in useCallback to avoid unnecessary re-renders
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const sharedLink = urlParams.get("sharedLink");
    if (sharedLink) {
      // Format the message to include ":->" "Check out this POST"_[sharedLink]
      setNewMessage(`:->"Check out this POST!"_[${sharedLink}] `);
    }
  }, [location.search]);

  const handleSend = useCallback(
    async (message) => {
      if (!message.trim()) return;

      const currentTime = new Date().toLocaleString();

      // Regular expression to match the format ":->" "text"_[link]
      const linkRegex = /:->"([^"]+)"_\[([^\]]+)\]/g;

      // Replace the ":->" "text"_[link] with the appropriate <a> tag
      const messageWithLinks = message.replace(
        linkRegex,
        (match, text, url) => {
          return `<a href="${url}" id="specialLink" class="clickableLink" target="_blank" rel="noopener noreferrer">${text}</a>`;
        }
      );

      const messageData = {
        sender: chalkName,
        text: messageWithLinks, // Modified message with wrapped URLs
        datetime: currentTime,
      };

      try {
        const response = await fetch(REACT_APP_FORUM_SEND_API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(messageData),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        setNewMessage(""); // Clear the input after sending
      } catch (error) {
        toast.error("Please try again after Logout.", {
          position: "top-left",
          autoClose: 2000,
        });
      }
    },
    [chalkName, token, REACT_APP_FORUM_SEND_API]
  );

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(newMessage);
    }
  };

  const renderMessage = (text) => {
    // Regular expression to match anchor tags with the specific id and class
    const linkRegex =
      /<a href="([^"]+)" id="specialLink" class="clickableLink"[^>]*>([^<]+)<\/a>/g;

    // Split the text into an array of plain text and anchor tags
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      // Add the plain text before the link
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          content: text.slice(lastIndex, match.index),
        });
      }

      // Add the link as a separate part
      parts.push({ type: "link", href: match[1], content: match[2] });

      lastIndex = linkRegex.lastIndex;
    }

    // Add any remaining plain text after the last link
    if (lastIndex < text.length) {
      parts.push({ type: "text", content: text.slice(lastIndex) });
    }

    // Render the parts
    return parts.map((part, index) =>
      part.type === "text" ? (
        <span key={index}>{part.content}</span>
      ) : (
        <a
          key={index}
          href={part.href}
          id="specialLink"
          className="clickableLink"
          target="_blank"
          rel="noopener noreferrer"
        >
          {part.content}
        </a>
      )
    );
  };

  const handleAreaFocus = () => {
    if (dropdownOpen) {
      setDropdownOpen(false);
    }
  };

  return (
    <>
      <Navbar dropdownOpen={dropdownOpen} setDropdownOpen={setDropdownOpen} />
      <div className="forumPage" onFocus={handleAreaFocus}>
        <div className="chat">
          <div className="chats">
            {messages.length === 0 ? (
              <div className="noPostFound">No Messages found.</div>
            ) : (
              messages.map((msg, index) =>
                msg.sender === chalkName ? (
                  <div className="me" key={index}>
                    <div className="meDateTime">{msg.datetime}</div>
                    <div className="meSend">{renderMessage(msg.text)}</div>
                  </div>
                ) : (
                  <div className="notMe" key={index}>
                    <div className="notMeDateTime">{msg.datetime}</div>
                    <div className="notMeProfile">
                      <img src={Profile} alt="" className="notMeProfileImage" />
                      <div className="notMeProfileName">
                        {msg.sender || "Unknown"}
                      </div>
                    </div>
                    <div className="notMeSend">{renderMessage(msg.text)}</div>
                  </div>
                )
              )
            )}
            <div ref={chatEndRef} /> {/* Invisible element to scroll to */}
          </div>
        </div>
        <div className="chatMe">
          <textarea
            placeholder="Send Message..."
            id="chatMe"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <div className="separation"></div>
          <button id="sendBtn" onClick={() => handleSend(newMessage)}>
            <i className="fa fa-send" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Forum;
