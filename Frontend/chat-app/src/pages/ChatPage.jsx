import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ChatRoom from "../components/ChatRoom";
import MessageInput from "../components/MessageInput";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import socketService, {
  connectSocket,
  getSocket,
  joinRoom,
  sendMessage,
} from "../services/socket";

export default function ChatPage() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    // connect socket when user is available
    if (user) {
      connectSocket(user.username);
    }

    const s = getSocket();
    if (!s) return;

    if (currentRoom && user) {
      joinRoom(String(currentRoom.id || currentRoom.name));
    }

    s.on("newMessage", (msg) => {
      if (msg.roomId === String(currentRoom?.id || currentRoom?.name)) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    s.on("userJoined", (payload) => {
      console.log("userJoined:", payload);
    });

    s.on("onlineUsers", (users) => {
      console.log("Online users:", users);
      setOnlineUsers(Array.from(users));
    });

    s.on("connect_error", (err) => console.error("socket error", err));

    return () => {
      s.off("newMessage");
      s.off("userJoined");
      s.off("onlineUsers");
    };
  }, [currentRoom, user]);

  async function fetchRooms() {
    try {
      const res = await api.get("/rooms");
      setRooms(res.data || []);
      if ((res.data || []).length) setCurrentRoom(res.data[0]);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleCreateRoom(name) {
    try {
      const res = await api.post("/rooms", { name });
      setRooms((prev) => [res.data, ...prev]);
      setCurrentRoom(res.data);
      // Auto-join the newly created room
      setTimeout(() => joinRoom(String(res.data.id)), 100);
    } catch (e) {
      console.error(e);
    }
  }

  function handleSend(text) {
    if (!currentRoom || !user) return;
    sendMessage(currentRoom.id, user.username, text);
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          rooms={rooms}
          currentRoom={currentRoom}
          onSelectRoom={(r) => setCurrentRoom(r)}
          onCreateRoom={handleCreateRoom}
          onlineUsers={onlineUsers}
        />
        <div className="flex-1 flex flex-col">
          <div className="bg-blue-50 border-b border-gray-300 px-6 py-4 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800">
              #{currentRoom ? currentRoom.name : "Select a room"}
            </h2>
            {currentRoom && (
              <p className="text-sm text-gray-600 mt-1">
                Room ID: {currentRoom.id}
              </p>
            )}
          </div>
          <ChatRoom messages={messages} />
          <MessageInput onSend={handleSend} />
        </div>
      </div>
    </div>
  );
}
