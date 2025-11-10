import React from "react";

export default function Sidebar({
  rooms,
  currentRoom,
  onSelectRoom,
  onlineUsers,
  onCreateRoom,
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <h4>Rooms</h4>
        <ul className="room-list">
          {rooms.map((r) => (
            <li
              key={r.id || r.name}
              className={
                currentRoom &&
                (currentRoom.id === r.id || currentRoom.name === r.name)
                  ? "active"
                  : ""
              }
              onClick={() => onSelectRoom(r)}
            >
              {r.name}
            </li>
          ))}
        </ul>
        <CreateRoom onCreate={onCreateRoom} />
      </div>

      <div className="sidebar-section">
        <h4>Online</h4>
        <ul className="user-list">
          {onlineUsers.map((u) => (
            <li key={u}>{u}</li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

function CreateRoom({ onCreate }) {
  const [name, setName] = React.useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (name.trim()) {
          onCreate(name.trim());
          setName("");
        }
      }}
      className="create-room"
    >
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New room"
      />
      <button type="submit">+</button>
    </form>
  );
}
