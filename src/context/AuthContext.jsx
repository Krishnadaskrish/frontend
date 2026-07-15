import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSession = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get("/api/users/me/permissions");
        setUser(res.data.user);
      } catch (err) {
        console.error("Failed to load user session", err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };
    loadSession();
  }, [token]);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      const newToken = res.data.token;
      localStorage.setItem("token", newToken);
      setToken(newToken);
      const profileRes = await axios.get("/api/users/me/permissions");
      setUser(profileRes.data.user);
      return profileRes.data.user;
    } catch (err) {
      const errMsg = err.response?.data?.error || "Login failed. Please check your credentials.";
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const hasPermission = (permissionCode) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permissionCode);
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
