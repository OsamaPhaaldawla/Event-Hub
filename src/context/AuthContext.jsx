import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { Check } from "lucide-react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
    }
    setLoading(false); // 👈 move this outside the if
  }, []);

  function login(data) {
    localStorage.setItem("token", data.token);
    const decoded = jwtDecode(data.token);
    setUser(decoded);
    toast.success(`${data.message}, Welcome ${decoded.name}`, {
      style: {
        background: "oklch(0.623 0.214 259.815)",
        color: "#fff",
        height: "70px",
        padding: "auto 3px",
      },
      icon: <Check className="bg-green-600 rounded-full p-0.5" />,
    });
  }

  function logout() {
    localStorage.removeItem("token");
    toast.success("You logged out successfully!!", {
      style: {
        background: "oklch(0.623 0.214 259.815)",
        color: "#fff",
        height: "70px",
        padding: "auto 3px",
      },
      icon: <Check className="bg-green-600 rounded-full p-0.5" />,
    });
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
