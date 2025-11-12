import React, { useState } from "react";

export default function Sidebar({
  rooms,
  currentRoom,
  onSelectRoom,
  onlineUsers,
  onCreateRoom,
}) {
  const [newRoomName, setNewRoomName] = useState("");

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    onCreateRoom(newRoomName.trim());
    setNewRoomName("");
  };

  return (
    <div className="w-64 bg-gray-100 border-r border-gray-300 flex flex-col h-full">
      {/* Rooms Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 border-b border-gray-300">
          <h3 className="text-lg font-bold text-gray-800 mb-3">🏠 Rooms</h3>
          <ul className="space-y-2">
            {(rooms || []).map((room) => (
              <li
                key={room?.id || room?.name}
                onClick={() => onSelectRoom(room)}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 font-semibold ${
                  currentRoom === room
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-200 border border-gray-200"
                }`}
              >
                #{room?.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Create Room Form */}
        <form
          onSubmit={handleCreateRoom}
          className="p-4 border-b border-gray-300"
        >
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="New room..."
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg font-bold transition-colors duration-200"
            >
              +
            </button>
          </div>
        </form>
      </div>

      {/* Online Users Section */}
      <div className="p-4 border-t border-gray-300">
        <h3 className="text-lg font-bold text-gray-800 mb-3">👥 Online</h3>
        <ul className="space-y-2">
          {(onlineUsers || []).map((user) => (
            <li
              key={user}
              className="p-2 bg-green-100 text-green-800 rounded-lg text-sm font-semibold flex items-center gap-2"
            >
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              {user}
            </li>
          ))}
        </ul>
        {(!onlineUsers || onlineUsers.length === 0) && (
          <p className="text-gray-500 text-sm">No users online</p>
        )}
      </div>
    </div>
  );
}
