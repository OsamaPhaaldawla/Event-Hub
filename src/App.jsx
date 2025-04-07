import { createBrowserRouter, RouterProvider } from "react-router";

import HomePage from "./routes/HomePage";
import Events from "./routes/Events";
import Login from "./routes/Login";
import Layout from "./routes/Layout";

import { loader as eventsLoader } from "./components/RecentlyEvents";
import { loader as eventDetailsLoader } from "./routes/EventDetails";
import EventDetails from "./routes/EventDetails";
import Error from "./routes/Error";
import Host, { action as hostAction, editDataLoader } from "./routes/Host";
import { loader as hostLoader } from "./components/Form/Step2";
import { AuthProvider } from "./context";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <HomePage />,
        loader: eventsLoader,
      },
      {
        path: "/events",
        element: <Events />,
        loader: eventsLoader,
      },
      {
        path: "/events/:eventId",
        element: <EventDetails />,
        loader: eventDetailsLoader,
      },
      {
        path: "/host",
        element: <Host key="host-event" />,
        loader: hostLoader,
        action: hostAction,
      },
      {
        path: "/events/:eventId/edit",
        element: <Host edit key="edit-event" />,
        loader: editDataLoader,
        action: hostAction,
      },
      {
        path: "/events/:eventId/login",
        element: <Login header="Event Login" key="edit-login" />,
        loader: eventDetailsLoader,
      },
      {
        path: "/admin",
        element: <Login header="Admin Login" key="admin-login" />,
      },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
