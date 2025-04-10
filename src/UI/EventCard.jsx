import { Link } from "react-router";

const EventCard = ({ event }) => {
  const formattedDate = new Date(event.date).toISOString().split("T")[0];
  const date = new Date(formattedDate + "T" + event.time);
  const formatted = date
    .toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
    .replace(",", " •");
  return (
    <div className="bg-gray-100 rounded shadow-md hover:scale-105 duration-300 flex flex-col p-2">
      <div className="relative">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-64 object-cover"
        />
        <span className="absolute left-0 top-0 bg-black/90 text-white px-5 py-3 rounded-br-lg">
          {event.accessType}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex flex-col flex-1">
          <div className="flex flex-col ">
            <span className="text-neutral-400 text-sm text-right">
              {formatted}
            </span>
            <h2 className="text-xl font-bold capitalize">{event.title}</h2>
          </div>
          <p className="text-gray-600 line-clamp-2">{event.description}</p>
        </div>
        <Link
          to={`/events/${event.id}`}
          className="mt-4 flex justify-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Show Details
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
