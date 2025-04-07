import logo from "../assets/logo.png";
import { useLocation, useNavigate } from "react-router";
import Navlink from "../UI/Navlink.jsx";
import { useAuth } from "../context/index.jsx";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { temp, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md shadow-md z-50 ">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600 flex items-center cursor-pointer">
          <img src={logo} width={30} height={30} alt="logo" className="mr-1" />{" "}
          <span className="text-black">Event</span> Hub
        </h1>
        <ul className="flex space-x-6">
          <Navlink to="/" isActive={location.pathname.endsWith("/")}>
            Home
          </Navlink>
          <Navlink to="/events" isActive={location.pathname === "/events"}>
            Events
          </Navlink>
          <Navlink to="/host" isActive={location.pathname === "/host"}>
            Host an event
          </Navlink>
          {temp ? (
            <button
              className="text-2xl text-gray-700 hover:text-blue-600 duration-300 cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <Navlink to="/login" isActive={location.pathname === "/login"}>
              Login
            </Navlink>
          )}
        </ul>
      </div>
    </nav>
  );
}
