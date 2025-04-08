import { useLoaderData } from "react-router";
import VenueCard from "../UI/VenueCard";

export default function Venues() {
  const venues = useLoaderData();

  return (
    <>
      <div className="container mx-auto px-4">
        <h1 className="text-3xl my-2 text-black/90 font-bold">
          Discover Amazing Venues:
        </h1>
        <p className="leading-3 text-base italic text-gray-600">
          Find the perfect venue for your next big event — from elegant halls to
          open-air spaces!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-12">
          {venues ? (
            venues.map((venue) => <VenueCard key={venue.id} venue={venue} />)
          ) : (
            <p>Loading venues... </p>
          )}
        </div>
      </div>
    </>
  );
}
