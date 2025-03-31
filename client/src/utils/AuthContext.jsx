import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const name = localStorage.getItem("userName");
    const loggedIn = localStorage.getItem("userLoggedIn") === "true";
    return loggedIn && name ? { name } : null;
  });

  const login = (firstNameInput) => {
    const first = firstNameInput || localStorage.getItem("userName") || "Gary";
    setUser({ name: first });
    localStorage.setItem("userName", first);
    localStorage.setItem("userLoggedIn", "true");
  };


  const logout = () => {
    setUser(null);
    localStorage.removeItem("userLoggedIn"); // Leave names in place
  };



  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
