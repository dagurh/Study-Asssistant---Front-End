import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

type AuthMode = "guest" | "user" | "demo";

interface AuthContextProps {
  mode: AuthMode;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  enterDemo: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    const token = localStorage.getItem("token");
    const expiry = localStorage.getItem("expiresAt");
    if (token && expiry && Date.now() < parseInt(expiry, 10)) {
      return token;
    }
    localStorage.removeItem("token");
    localStorage.removeItem("expiresAt");
    return null;
  });

  const [mode, setMode] = useState<AuthMode>(() => {
    const token = localStorage.getItem("token");
    const expiry = localStorage.getItem("expiresAt");
    if (token && expiry && Date.now() < parseInt(expiry, 10)) {
      return "user";
    }
    return "guest";
  });

  useEffect(() => {
    if (!token) return;

    const expiry = localStorage.getItem("expiresAt");
    if (!expiry) return;

    const timeout = parseInt(expiry, 10) - Date.now();
    if (timeout <= 0) {
      logout();
      return;
    }

    const timer = setTimeout(() => {
      logout();
    }, timeout);

    return () => clearTimeout(timer);
  }, [token]);
  
  const login = (userToken: string) => {
    const expiresAt = Date.now() + 30 * 60 * 1000;
    setToken(userToken);
    localStorage.setItem("token", userToken);
    localStorage.setItem("expiresAt", expiresAt.toString());
    setMode("user");
  };
  
  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("expiresAt");
    setMode("guest");
  };

  const enterDemo = () => {
    setToken(null);
    setMode("demo");
  };

  return (
    <AuthContext.Provider value={{ mode, token, login, logout, enterDemo }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
