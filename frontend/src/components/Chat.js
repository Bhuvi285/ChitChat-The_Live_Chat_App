import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import "./Chat.css";

// Initialize socket connection = connects to the server for real-time communication
const socket = io(process.env.REACT_APP_SOCKET_URL);


// Chat component = main chat interface handling messages and user status
function Chat() {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const [currentUser, setCurrentUser] = useState("");

  //useEffect to handle socket events = used for setting up and cleaning up socket event listeners
  useEffect(() => {
    // Socket event listeners
    // Handle connect event = updates connection status on successful connection
    socket.on("connect", () => {
      setIsConnected(true);
      console.log("Connected to server");
    });
    // Handle disconnect event = updates connection status on disconnection
    socket.on("disconnect", () => {
      setIsConnected(false);
      console.log("Disconnected from server");
    });

    // Handle incoming messages = updates message list when a new message is received
    socket.on("message", (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...data, type: "system" },
      ]);
    });

    // Handle received chat messages = updates message list with user messages
    socket.on("receiveMessage", (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...data, type: "message" },
      ]);
    });
// Handle typing notifications = shows who is currently typing
    socket.on("userTyping", (data) => {
      setTypingUser(data.user);
      setTimeout(() => setTypingUser(""), 2000);
    });

    // Cleanup on component unmount = removes socket event listeners for memory management
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("message");
      socket.off("receiveMessage");
      socket.off("userTyping");

    };
  }, []);
// Send message to server = used for sending chat messages to the server for broadcasting to other users
  const sendMessage = (text, user) => {
    if (text.trim()) {
      if (!currentUser) {
        setCurrentUser(user);
      }
      socket.emit("sendMessage", { text, user }); // Emit message to server
    }
  };
// Handle typing event = used for notifying other users when someone is typing
  const handleTyping = (user) => {
    if (!currentUser && user) {
      setCurrentUser(user);
    }
    socket.emit("typing", { user }); // Emit typing notification to server
  };


  // Render the chat UI
  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="header-left">
          <div className="header-icon">💬</div>
          <div className="header-info">
            <h1>Real-Time Chat</h1>
            {/* 🗑️ REMOVED - Online count display */}
          </div>
        </div>
        <div className="status">
          <div
            className={`status-dot ${
              isConnected ? "connected" : "disconnected"
            }`}
          ></div>
          <span>{isConnected ? "Connected" : "Disconnected"}</span>
        </div>
      </div>

      <MessageList messages={messages} currentUser={currentUser} />

      {typingUser && typingUser !== currentUser && (
        <div className="typing-indicator">
          <div className="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span>{typingUser} is typing...</span>
        </div>
      )}

      <ChatInput onSendMessage={sendMessage} onTyping={handleTyping} />
    </div>
  );
}

export default Chat;