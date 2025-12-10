import React, { useState } from "react";
import "./ChatInput.css";

// ChatInput component = used for inputting and sending chat messages
function ChatInput({ onSendMessage, onTyping }) {
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");

  // Handle send button click = sends the message to the parent component
  const handleSend = () => {
    if (message.trim() && username.trim()) {
      onSendMessage(message, username);
      setMessage("");
    }
  };

  // Handle Enter key press = sends the message when Enter is pressed
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Handle message input change = updates the message state and notifies typing
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    if (username.trim()) {
      onTyping(username);
    }
  };

  // Render the chat input UI
  return (
    <div className="chat-input-container">
      <input
        type="text"
        className="username-input"
        placeholder="Your name..."
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        className="message-input"
        placeholder="Type a message..."
        value={message}
        onChange={handleMessageChange}
        onKeyPress={handleKeyPress}
      />
      <button
        className="send-button"
        onClick={handleSend}
        disabled={!message.trim() || !username.trim()}
      >
        Send
      </button>
    </div>
  );
}

export default ChatInput; // ChatInput component = used for inputting and sending chat messages