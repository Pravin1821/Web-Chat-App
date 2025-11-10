import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <div className="navbar">
      <div className="brand">ChatApp</div>
      <div className="nav-actions">
        <span className="user">{user?.username}</span>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
