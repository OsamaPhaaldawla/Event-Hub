// AuthContext.js
import { createContext, useContext, useState } from "react";

const AuthContext = createContext({
  isloggedIn: "",
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  const login = () => {
    localStorage.setItem("isLoggedIn", true);
    setIsLoggedIn(true);
  };

  const logout = () => {
    console.log("logout");
    localStorage.setItem("isLoggedIn", false);
    setIsLoggedIn(false);
  };

  const temp = isLoggedIn;

  return (
    <AuthContext.Provider value={{ temp, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
