import React, { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import Navbar from "../Components/Navbar";
import Profile from "../Resources/profile.png";
import "../CSS/Forum.css";

const chalkName = localStorage.getItem("chalkName");

const Forum = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef(null);

  const REACT_APP_FORUM_GET_API = process.env.REACT_APP_FORUM_GET_API;
  const REACT_APP_FORUM_SEND_API = process.env.REACT_APP_FORUM_SEND_API;
  const REACT_APP_SOCKET_SERVER = process.env.REACT_APP_SOCKET_SERVER;
  const socket = useRef(null);

  // Fetch messages on component mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`${REACT_APP_FORUM_GET_API}`);
        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error.message);
      }
    };

    fetchMessages();
  }, [REACT_APP_FORUM_GET_API]);

  // Connect to Socket.IO server on component mount
  useEffect(() => {
    socket.current = io(REACT_APP_SOCKET_SERVER);
    socket.current.on("newMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [REACT_APP_SOCKET_SERVER]);

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
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error.message);
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
