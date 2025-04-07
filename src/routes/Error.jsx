import { useRouteError, Link } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Error = () => {
  const error = useRouteError();
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <Navbar />
        <main className="pt-16">
          <div className="p-8 text-red-600">
            <h2 className="text-2xl font-bold">Oops! Something went wrong.</h2>
            <p>{error.message || "Not Found"}</p>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Error;
