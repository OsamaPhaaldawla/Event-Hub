import { useLoaderData } from "react-router";
import EventCard from "../UI/EventCard";
import { useState } from "react";
import TypeSelector from "../UI/TypeSelector";

export default function Events() {
  const events = useLoaderData();
  const types = [...new Set(events.map((event) => event.type))];

  const [filteredEvents, setFilteredEvents] = useState(events);

  function handleClick(type) {
    let newEvents = [...events];
    if (type) {
      newEvents = events.filter((item) => item.type === type);
    }
    setFilteredEvents(newEvents);
  }

  return (
    <>
      <div className="container mx-auto px-4">
        <h1 className="text-3xl my-2 text-black/90 font-bold">
          Browse All Events:
        </h1>
        <p className="leading-3 text-base italic text-gray-400">
          Explore a wide range of events from tech meetups to unforgettable
          parties!
        </p>
        {events.length === 0 ? (
          <p className="text-center text-lg italic text-gray-800 mt-8">
            Sorry, There is no events yet wait until someone add one or create
            an event now.
          </p>
        ) : (
          <>
            <TypeSelector handleClick={handleClick} types={types} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-12">
              {events ? (
                filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))
              ) : (
                <p>Loading Events... </p>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
