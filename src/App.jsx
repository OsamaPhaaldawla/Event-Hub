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
import { loader as venuesLoader } from "./components/Form/Step2";
import { AuthProvider } from "./context";
import CreateVenue, { action as createVenueAction } from "./routes/CreateVenue";
import Venues from "./routes/Venues";
import VenueDetails, {
  loader as venueDetailsLoader,
} from "./routes/VenueDetails";

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
        loader: venuesLoader,
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
      {
        path: "/venues",
        element: <Venues />,
        loader: venuesLoader,
      },
      {
        path: "/venues/:venueId",
        element: <VenueDetails />,
        loader: venueDetailsLoader,
      },
      {
        path: "/venues/new",
        element: <CreateVenue />,
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
