import { createBrowserRouter, RouterProvider } from "react-router";

import HomePage from "./routes/HomePage";
import Events from "./routes/Events";
import Login from "./routes/Login";
import Layout from "./routes/Layout";

import { loader as eventsLoader } from "./components/RecentlyEvents";
import { loader as eventDetailsLoader } from "./routes/EventDetails";
import EventDetails from "./routes/EventDetails";
import ErrorPage from "./routes/Error";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
        loader: eventsLoader,
        errorElement: <ErrorPage />,
      },
      { path: "/events", element: <Events />, loader: eventsLoader },
      {
        path: "/events/:eventId",
        element: <EventDetails />,
        loader: eventDetailsLoader,
      },
      { path: "/login", element: <Login /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
