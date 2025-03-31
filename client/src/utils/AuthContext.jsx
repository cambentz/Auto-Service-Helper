import React, { createContext, useContext, useState } from "react";

// Context for managing mock authentication.
// Backend devs: Replace localStorage and fake login logic with real token-based auth later.

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // On load, check localStorage for simulated login info
  const [user, setUser] = useState(() => {
    const name = localStorage.getItem("userName");
    const loggedIn = localStorage.getItem("userLoggedIn") === "true";
    return loggedIn && name ? { name } : null;
  });

  // Simulated login — just stores name and a flag locally
  // Backend devs: Replace with real auth token + user profile from API
  const login = (firstNameInput) => {
    const first = firstNameInput || localStorage.getItem("userName") || "Gary";
    setUser({ name: first });
    localStorage.setItem("userName", first);
    localStorage.setItem("userLoggedIn", "true");
  };

  // Simulated logout — clears login flag but keeps name for demo continuity
  // Backend devs: Clear auth token here
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
