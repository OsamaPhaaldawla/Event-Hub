import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <ToastContainer position="top-center" autoClose={3000} theme="light" />
      <div className="flex-1">
        <Navbar />
        <main className="pt-16">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
