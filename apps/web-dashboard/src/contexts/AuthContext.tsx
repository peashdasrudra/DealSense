import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  isAdmin: boolean;
  apiKey: string | null;
  login: (key: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKey, setApiKey] = useState<string | null>(() => {
    return localStorage.getItem("dealsense_api_key");
  });

  const isAdmin = !!apiKey;

  const login = (key: string) => {
    localStorage.setItem("dealsense_api_key", key);
    setApiKey(key);
  };

  const logout = () => {
    localStorage.removeItem("dealsense_api_key");
    setApiKey(null);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, apiKey, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
