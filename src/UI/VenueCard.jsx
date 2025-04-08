import { Link } from "react-router";
import { FaLocationDot } from "react-icons/fa6";

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
          <h2 className="text-2xl font-bold capitalize" dir="auto">
            {venue.name}
          </h2>
          <a
            href={venue.url}
            target="_blank"
            className="text-blue-600 text-md underline w-fit flex items-center gap-x-1"
            dir="auto"
          >
            <FaLocationDot />
            {venue.location}
          </a>
          <div className="flex items-center justify-between mb-2 text-lg text-neutral-700">
            <p>
              Capcity: <span className="text-sky-700">{venue.capacity}</span>
            </p>
            <p>
              price: <span className="text-sky-700">{venue.price}/Hour</span>
            </p>
          </div>
          <div className="w-full h-[1px] bg-gray-500 my-2" />
          <p className="text-black line-clamp-2" dir="auto">
            {venue.description}
          </p>
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
