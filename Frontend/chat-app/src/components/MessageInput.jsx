import React, { useState } from "react";

export default function MessageInput({ onSend, disabled }) {
  const [text, setText] = useState("");
  function submit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  }
  return (
    <form className="message-input" onSubmit={submit}>
      <textarea
        placeholder="Type a message"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={1}
      />
      <button type="submit" disabled={disabled}>
        Send
      </button>
    </form>
  );
}
