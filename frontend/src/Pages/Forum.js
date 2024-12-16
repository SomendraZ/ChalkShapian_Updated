import React, { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import Navbar from "../Components/Navbar";
import Profile from "../Resources/profile.png";
import "../CSS/Forum.css";
import { useAuth } from "../AuthContext";

const Forum = ({ chalkName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef(null);

  const REACT_APP_FORUM_GET_API = process.env.REACT_APP_FORUM_GET_API;
  const REACT_APP_FORUM_SEND_API = process.env.REACT_APP_FORUM_SEND_API;
  const REACT_APP_SOCKET_SERVER = process.env.REACT_APP_SOCKET_SERVER;
  const socket = useRef(null);

  const { logout: authLogout } = useAuth();

  // Retrieve JWT token from localStorage
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
        console.error("Error fetching messages:", error.message);
        authLogout();
        toast.error("Please try again after Login.", {
          position: "top-left",
          autoClose: 2000,
        });
      }
    };

    fetchMessages();
  }, [REACT_APP_FORUM_GET_API, chalkName, token, authLogout]);

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

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const currentTime = new Date().toLocaleString();
    const messageData = {
      sender: chalkName,
      text: newMessage,
      datetime: currentTime,
    };

    try {
      const response = await fetch(REACT_APP_FORUM_SEND_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add token to the request header
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error.message);
      authLogout();
      toast.error("Please try again after Login.", {
        position: "top-left",
        autoClose: 2000,
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent adding a newline
      handleSend();
    }
  };

  return (
    <>
      <Navbar />
      <div className="forumPage">
        <div className="chat">
          <div className="chats">
            {messages.map((msg, index) =>
              msg.sender === chalkName ? (
                <div className="me" key={index}>
                  <div className="meDateTime">{msg.datetime}</div>
                  <div className="meSend">{msg.text}</div>
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
                  <div className="notMeSend">{msg.text}</div>
                </div>
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
          <button id="sendBtn" onClick={handleSend}>
            <i className="fa fa-send" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Forum;
