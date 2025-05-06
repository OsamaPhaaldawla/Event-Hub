import { Link, useLoaderData } from "react-router";
import { jwtDecode } from "jwt-decode";
import { Sparkles } from "lucide-react";

const MyEvents = () => {
  const events = useLoaderData();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-x-2">
        My Events <Sparkles className="text-amber-600" />
      </h1>
      {events.length === 0 ? (
        <p>No events yet. Go create one!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="border rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold">{event.title}</h2>
              <p className="text-sm text-gray-600">{event.date}</p>
              <p className="mt-2 text-gray-700 line-clamp-3">
                {event.description}
              </p>
              <div className="mt-3 flex justify-between items-center">
                <Link
                  to={`/events/${event.id}/edit`}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </Link>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  {event.ticketsSold ?? 0} tickets sold
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEvents;

export const loader = async () => {
  const token = localStorage.getItem("token");
  const user = jwtDecode(token);
  const res = await fetch(
    `http://localhost:3000/events/hoster/${user.userId}`,
    {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) {
    throw {
      message: "Failed to fetch events.",
    };
  } else {
    return res;
  }
};
