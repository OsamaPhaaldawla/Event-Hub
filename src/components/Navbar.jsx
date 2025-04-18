import logo from "../assets/logo.png";
import { useLocation } from "react-router"; // useNavigate
import Navlink from "../UI/Navlink.jsx";
import { useAuth } from "../context/AuthContext.jsx";

import { ChevronDown } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md shadow-md z-50 ">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-x-1">
          <div className="text-2xl font-bold text-blue-600 flex items-center cursor-pointer">
            <img src={logo} width={45} height={45} alt="logo" />
            <h1 className="text-black hidden md:block">
              Event
              <span className="text-blue-600">Hub</span>
            </h1>
          </div>
          {user && (
            <p className="text-lg">
              Welcome,{" "}
              <span className="text-blue-600 font-semibold">
                {user.name || user.email}
              </span>{" "}
              ({user.role})
            </p>
          )}
        </div>
        <ul className="flex space-x-6">
          <Navlink to="/" isActive={location.pathname.endsWith("/")}>
            Home
          </Navlink>
          <Navlink to="/venues" isActive={location.pathname === "/venues"}>
            Venues
          </Navlink>
          <div className="relative group">
            <Navlink
              to={
                location.pathname === "/hoster/events"
                  ? "/hoster/events"
                  : "/events"
              }
              isActive={
                location.pathname === "/events" ||
                location.pathname === "/hoster/events"
              }
            >
              {location.pathname === "/hoster/events" ? "MyEvents" : "Events"}
              {user?.role === "hoster" && (
                <ChevronDown className="inline ml-0.5" />
              )}
            </Navlink>
            <div className="absolute hidden group-hover:block bg-white/90 backdrop-blur-md rounded-b-md shadow-md z-10 w-36 text-center left-1/2 -translate-x-1/2">
              {user?.role === "hoster" && (
                <Navlink
                  to={
                    location.pathname === "/hoster/events"
                      ? "events"
                      : "/hoster/events"
                  }
                  className="block px-2 hover:bg-gray-200"
                >
                  {location.pathname === "/hoster/events"
                    ? "Events"
                    : "MyEvents"}
                </Navlink>
              )}
            </div>
          </div>

          <Navlink to="/host" isActive={location.pathname === "/host"}>
            Host Event
          </Navlink>
          {user && user.role === "admin" && (
            <Navlink
              to="/create_venue"
              isActive={location.pathname === "/create_venue"}
            >
              Create Venue
            </Navlink>
          )}
          {user ? (
            <button
              className="text-2xl text-gray-700 hover:text-blue-600 duration-300 py-3 cursor-pointer"
              onClick={logout}
            >
              Logout
            </button>
          ) : (
            <Navlink
              to="/login"
              isActive={
                location.pathname === "/login" ||
                location.pathname === "/register"
              }
            >
              Login/Register
            </Navlink>
          )}
        </ul>
      </div>
    </nav>
  );
}
