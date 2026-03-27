import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchMe = async () => {
    try {
      const res = await api.get("/api/auth/me");
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMe();
  }, []);
  const login = async (formData) => {
    const res = await api.post("/api/auth/login", formData);
    setUser(res.data.user);
  };
  const register = async (formData) => {
    const res = await api.post("/api/auth/register", formData);
    setUser(res.data.user);
  };
  const logout = async () => {
    await api.post("/api/auth/logout");
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);