import { Link } from "react-router";

export default function VenueCard({ venue }) {
  return (
    <div className="bg-gray-100 rounded shadow-md overflow-hidden hover:scale-105 duration-300 flex flex-col">
      <div className="relative">
        <img
          src={venue.images[0]}
          alt={venue.name}
          className="w-full h-64 object-cover "
        />
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex flex-col flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold capitalize">{venue.name}</h2>
            <a
              href={venue.url}
              target="_blank"
              className="text-neutral-500 text-sm underline"
            >
              {venue.location}
            </a>
          </div>
          <p className="text-gray-600 line-clamp-2">{venue.description}</p>
        </div>
        <Link
          to={`/venues/${venue.id}`}
          className="mt-4 flex justify-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Show Details
        </Link>
      </div>
    </div>
  );
}
