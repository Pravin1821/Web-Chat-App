import React from "react";
import ChatMessage from "./ChatMessage";

export default function ChatRoom({ messages }) {
  return (
    <div className="chat-room">
      <div className="messages">
        {messages.map((m, i) => (
          <ChatMessage key={m.id || i} message={m} />
        ))}
      </div>
    </div>
  );
}
