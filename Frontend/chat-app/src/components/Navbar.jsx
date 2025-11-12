import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg text-white h-16 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="text-2xl font-bold">💬 ChatApp</div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold">👤 {user?.username}</span>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold transition-colors duration-200 text-white"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
