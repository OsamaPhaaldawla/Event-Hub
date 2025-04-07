import { Outlet } from "react-router";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
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
