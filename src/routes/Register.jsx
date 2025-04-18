import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user", // default
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      login(data.token); // auto-login
      navigate("/");
    } else {
      alert(data.message || "Failed to register");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 max-w-md mx-auto bg-white rounded shadow-md"
    >
      <h2 className="text-2xl mb-4 font-bold text-center text-green-700">
        Register
      </h2>

      <input
        type="text"
        name="name"
        placeholder="Your Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full p-2 mb-3 border rounded"
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full p-2 mb-3 border rounded"
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="w-full p-2 mb-3 border rounded"
        required
      />

      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded"
      >
        <option value="user">User</option>
        <option value="hoster">Hoster</option>
      </select>

      <button
        type="submit"
        className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800"
      >
        Register
      </button>
      <Link
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-800 block text-center mt-3"
        to="/login"
        isActive={location.pathname === "/login"}
      >
        Login
      </Link>
    </form>
  );
}
