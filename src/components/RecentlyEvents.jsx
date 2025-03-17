import { useLoaderData } from "react-router";
import EventCard from "../UI/EventCard";

export default function RecentlyEvents() {
  const events = useLoaderData();
  const recentlyEvents = events.slice(0, 3);

  return (
    <>
      <section className="my-24">
        <div className="container mx-auto px-4">
          <h2 className="text-black text-3xl font-semibold mb-10">
            Recently Added Events:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentlyEvents ? (
              recentlyEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <p>Loading Events... </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export const loader = async () => {
  const res = await fetch("/api/events");
  if (!res.ok)
    throw new Error("Failed to fetch events please try to refresh the page.");
  const data = await res.json();
  return data;
};
