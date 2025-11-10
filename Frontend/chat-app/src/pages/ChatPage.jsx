import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ChatRoom from "../components/ChatRoom";
import MessageInput from "../components/MessageInput";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { activateSocket, disconnectSocket } from "../services/socket";

export default function ChatPage() {
  const { user, token } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const clientRef = useRef(null);

  useEffect(() => {
    fetchRooms();
    return () => disconnectSocket();
  }, []);
  async function fetchRooms() {
    try {
      const res = await api.get("/rooms");
      setRooms(res.data || []);
      if ((res.data || []).length) setCurrentRoom(res.data[0]);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    if (!token || !user) return;
    const client = activateSocket({ token });
    clientRef.current = client;
    client.onConnect = () => {
      // subscribe to room and presence
      if (currentRoom) subscribeRoom(client, currentRoom);
      try {
        client.subscribe("/topic/presence", (m) => {
          const body = JSON.parse(m.body);
          setOnlineUsers(body.online || []);
        });
      } catch (e) {}
    };

    client.activate();
    return () => {
      try {
        client.deactivate();
      } catch (e) {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user, currentRoom]);

  function subscribeRoom(client, room) {
    // unsubscribe previous
    if (client._lastSubscribed)
      try {
        client._lastSubscribed.unsubscribe();
      } catch (e) {}
    const sub = client.subscribe(
      `/topic/rooms/${room.id || room.name}`,
      (m) => {
        const b = JSON.parse(m.body);
        setMessages((prev) => [...prev, b]);
      }
    );
    client._lastSubscribed = sub;
  }

  async function loadRoomHistory(room) {
    try {
      const res = await api.get(
        `/rooms/${room.id || room.name}/messages?limit=50`
      );
      setMessages(res.data || []);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    if (currentRoom) loadRoomHistory(currentRoom);
  }, [currentRoom]);

  async function handleCreateRoom(name) {
    try {
      const res = await api.post("/rooms", { name });
      setRooms((prev) => [res.data, ...prev]);
      setCurrentRoom(res.data);
    } catch (e) {
      console.error(e);
    }
  }

  function handleSend(text) {
    if (!clientRef.current || !clientRef.current.connected) {
      setMessages((prev) => [
        ...prev,
        {
          id: `local-${Date.now()}`,
          senderName: user.username,
          content: text,
          timestamp: Date.now(),
        },
      ]);
      return;
    }
    const payload = {
      roomId: currentRoom.id || currentRoom.name,
      senderId: user.id || user.username,
      senderName: user.username,
      content: text,
      timestamp: Date.now(),
    };
    clientRef.current.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify(payload),
    });
  }

  return (
    <div className="chat-page-root">
      <Navbar />
      <div className="chat-main">
        <Sidebar
          rooms={rooms}
          currentRoom={currentRoom}
          onSelectRoom={(r) => {
            setCurrentRoom(r);
          }}
          onlineUsers={onlineUsers}
          onCreateRoom={handleCreateRoom}
        />
        <div className="chat-panel">
          <div className="chat-panel-header">
            {currentRoom ? currentRoom.name : "No room selected"}
          </div>
          <ChatRoom messages={messages} />
          <MessageInput onSend={handleSend} />
        </div>
      </div>
    </div>
  );
}
