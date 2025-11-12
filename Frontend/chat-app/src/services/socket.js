import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:9092";

// We'll create the socket lazily so we can include the username in the handshake query.
let socket = null;

export function connectSocket(username) {
  if (socket && socket.connected) return socket;
  socket = io(SOCKET_URL, {
    transports: ["websocket", "polling"],
    query: { username },
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  // debug
  socket.on("connect_error", (err) => {
    console.error("Socket connect_error:", err);
  });

  return socket;
}

export function getSocket() {
  return socket;
}

// helper to join a room (server expects a String roomId)
export const joinRoom = (roomId) => {
  if (!socket) return;
  socket.emit("joinRoom", roomId);
};

// send message - server expects event name "sendMessage" with ChatMessageDto structure
export const sendMessage = (roomId, username, text) => {
  if (!socket) return;
  socket.emit("sendMessage", {
    roomId: String(roomId),
    sender: username,
    content: text,
    isPrivate: false,
  });
};

export default {
  connectSocket,
  getSocket,
  joinRoom,
  sendMessage,
};
