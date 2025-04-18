import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import logo from "../assets/logo.png";

export default function Footer() {
  return (
    <>
      <div className="bg-black text-white px-5 py-3">
        <div className="flex flex-col md:flex-row items-center justify-center mb-4">
          <h1 className="text-2xl mr-4 font-bold text-blue-600 flex items-center cursor-pointer">
            <img
              src={logo}
              width={30}
              height={30}
              alt="logo"
              className="mr-1"
            />{" "}
            <span className="text-white">Event</span> Hub
          </h1>
          <p className="text-gray-400 italic text-center">
            Your one-stop event platform for organizing and attending memorable
            moments.
          </p>
        </div>
        <div className="flex-col justify-center items-center">
          <h3 className="font-semibold mb-2 text-center">Contact</h3>
          <div className="flex flex-col justify-center items-center gap-1 sm:flex-row sm:gap-4">
            <p>Email: eventhub@gmail.com</p>
            <p>Phone: +249 xxx xxx xxx</p>
          </div>
          <div className="flex gap-4 text-xl justify-center mt-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook className="hover:text-blue-500 transition duration-300" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter className="hover:text-sky-500 transition duration-300" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="hover:text-pink-500 transition duration-300" />
            </a>
          </div>
        </div>
        <div className="text-center  text-gray-400 mt-8">
          EventHub. All rights reserved &copy; 2025
        </div>
      </div>
    </>
  );
}
