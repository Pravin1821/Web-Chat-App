import React from "react";

export default function ChatRoom({ messages }) {
  return (
    <div className="flex-1 overflow-y-auto bg-white p-6 space-y-4">
      {(!messages || messages.length === 0) && (
        <div className="h-full flex items-center justify-center text-gray-400">
          <p className="text-lg">No messages yet. Start the conversation! 💬</p>
        </div>
      )}
      {(messages || []).map((msg, index) => (
        <div
          key={index}
          className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
            <strong className="text-blue-700 font-semibold">
              {msg.sender || msg.senderName}
            </strong>
            <span className="text-xs text-gray-500 ml-auto">
              {new Date(msg.timestamp || Date.now()).toLocaleTimeString()}
            </span>
          </div>
          <p className="text-gray-800">{msg.content || msg.text}</p>
        </div>
      ))}
    </div>
  );
}
