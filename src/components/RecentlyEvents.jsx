import { useLoaderData, Await } from "react-router";
import EventCard from "../UI/EventCard";

export default function RecentlyEvents() {
  const events = useLoaderData();
  const recentlyEvents = events.slice(-3);

  return (
    <>
      <section className="my-24">
        <div className="container mx-auto px-4">
          <h2 className="text-black text-3xl font-semibold mb-10">
            Recently Added Events:
          </h2>
          {events.length === 0 ? (
            <p className="text-center text-lg italic text-gray-800">
              Sorry, There is no events yet wait until someone add one or create
              an event now.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentlyEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export const loader = async () => {
  const res = await fetch("http://localhost:3000/events");
  if (!res.ok) {
    throw {
      message: "Failed to fetch events.",
    };
  } else {
    return res;
  }
};
