// src/pages/Login.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, NavLink, useNavigate } from "react-router";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      login(data);
      navigate("/"); // or dashboard
    } else {
      toast.error(data.error || "Login failed");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 max-w-md mx-auto shadow-md rounded"
    >
      <h2 className="text-2xl mb-4 font-bold text-center text-blue-600">
        Login
      </h2>
      <input
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full mb-2 p-2 border"
        required
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full mb-4 p-2 border"
        required
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700">
        Login
      </button>
      <button
        type="button"
        className="bg-green-700 text-white px-4 h-10 rounded ml-3 cursor-pointer hover:bg-green-800"
      >
        <Link
          className="h-full py-2"
          to="/register"
          isActive={location.pathname === "/login"}
        >
          Register
        </Link>
      </button>
    </form>
  );
}
