import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("me"));
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(
    () => localStorage.getItem("accessToken") || ""
  );

  useEffect(() => {
    if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    else delete api.defaults.headers.common["Authorization"];
  }, [token]);

  const login = async ({ usernameOrEmail, password }) => {
    const res = await api.post("/auth/login", { usernameOrEmail, password });
    const accessToken = res.data.accessToken || res.data.token;
    const me = res.data.user || { username: usernameOrEmail };
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("me", JSON.stringify(me));
    setToken(accessToken);
    setUser(me);
    return me;
  };

  const register = async ({ username, email, password }) => {
    await api.post("/auth/register", { username, email, password });
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("me");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
