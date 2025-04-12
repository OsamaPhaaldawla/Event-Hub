import { createBrowserRouter, RouterProvider } from "react-router";

import HomePage from "./routes/HomePage";
import Events from "./routes/Events";
import Login from "./routes/Login";
import Layout from "./routes/Layout";
import AdminRegister from "./routes/AdminRegister";

import { loader as eventsLoader } from "./components/RecentlyEvents";
import { loader as eventDetailsLoader } from "./routes/EventDetails";
import EventDetails from "./routes/EventDetails";
import Error from "./routes/Error";
import Host, { action as hostAction, editDataLoader } from "./routes/Host";
import { loader as venuesLoader } from "./components/Form/Step2";
import { AuthProvider } from "./context/AuthContext";
import CreateVenue, { action as createVenueAction } from "./routes/CreateVenue";
import Venues from "./routes/Venues";
import VenueDetails, {
  loader as venueDetailsLoader,
} from "./routes/VenueDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./routes/Register";

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
        element: (
          <ProtectedRoute roles={["admin", "hoster"]}>
            <Host key="host-event" />
          </ProtectedRoute>
        ),
        loader: venuesLoader,
        action: hostAction,
      },
      {
        path: "/events/:eventId/edit",
        element: (
          <ProtectedRoute roles={["admin", "hoster"]}>
            <Host edit key="edit-event" />
          </ProtectedRoute>
        ),
        loader: editDataLoader,
        action: hostAction,
      },
      // {
      //   path: "/events/:eventId/login",
      //   element: <Login header="Event Login" key="edit-login" />,
      //   loader: eventDetailsLoader,
      // },
      // {
      //   path: "/admin",
      //   element: <Login header="Admin Login" key="admin-login" />,
      // },
      {
        path: "/admin-register",
        element: <AdminRegister />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/venues",
        element: <Venues />,
        loader: venuesLoader,
      },
      {
        path: "/venues/:venueId",
        element: (
          <ProtectedRoute roles={["admin", "hoster"]}>
            <VenueDetails />
          </ProtectedRoute>
        ),
        loader: venueDetailsLoader,
      },
      {
        path: "/venues/new",
        element: (
          <ProtectedRoute roles={["admin"]}>
            <CreateVenue />
          </ProtectedRoute>
        ),
        action: createVenueAction,
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
