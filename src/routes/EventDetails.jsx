import { Link, useLoaderData } from "react-router";
import { FaCalendar } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { PiChairFill } from "react-icons/pi";
import Button from "../UI/Button";
import { IoIosTime } from "react-icons/io";
export default function EventDetails() {
  const event = useLoaderData();
  const adminLoggin = window.localStorage.getItem("isLoggedIn");

  return (
    <>
      {event ? (
        <div className="container mx-auto px-4 py-10">
          <div className="flex justify-between items-center relative">
            <Link
              to={adminLoggin === "true" ? `edit` : "login"}
              className="absolute left-0 top-3 border border-blue-600 rounded-lg px-2 py-1 cursor-pointer text-xl hover:bg-blue-600 hover:text-white duration-300"
              type="button"
            >
              Edit
            </Link>
            <div className="flex flex-col w-1/2 items-center ">
              <h1 className="text-5xl font-bold mb-2">{event.title}</h1>
              {event.subtitle && (
                <h3 className="text-2xl font-semibold mb-2">
                  {event.subtitle}
                </h3>
              )}
              <div className="flex justify-between items-center text-2xl mt-4 mb-4">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 mr-5 flex items-center">
                    <FaCalendar className="text-blue-600/80 mr-2 w-4" />
                    {event.date}
                  </p>
                  <p className="text-gray-600 ml-8 flex items-center ">
                    <IoIosTime className="text-blue-600/80 mr-2 w-4 scale-[160%]" />
                    {event.time}
                  </p>
                </div>
              </div>
              <a
                href={event.url}
                target="_blank"
                className="flex items-center text-2xl mb-3 underline text-blue-600"
              >
                <FaLocationDot className="w-4 mr-2 text-blue-600/80" />
                {event.location}
              </a>
              <p className="mb-4 uppercase text-3xl">
                Type:{" "}
                <span className="text-blue-600 font-bold tracking-widest">
                  {event.type}
                </span>
              </p>
            </div>
            <img
              src={event.image}
              alt={event.title}
              className="w-1/2 h-90 object-cover rounded-2xl mb-6"
            />
          </div>

          <p className="text-xl text-center mt-12">{event.description}</p>
          {event.accessType === "open" && (
            <p className="text-2xl text-center mt-6">
              Open Doors, Open Vibes —{" "}
              <span className="border-b-2 border-blue-600">
                No Ticket Needed!
              </span>
            </p>
          )}
          {event.accessType === "free-limited" && (
            <div>
              <p className="text-2xl text-center mt-6">
                First Come, First Served —{" "}
                <span className="border-b-2 border-blue-600">
                  Book Your Free Ticket Now!
                </span>
              </p>
              <div className="flex justify-center mt-5 text-lg">
                <p>
                  <PiChairFill className="inline text-black mr-2" />
                  <span className="text-orange-900">
                    {event.seats - event.bookedSeats}
                  </span>{" "}
                  / <span className="text-orange-900">{event.seats} </span>Seats{" "}
                  <span className="text-blue-600">Left</span>
                </p>
              </div>
              <div className="flex justify-center mt-6">
                <Button disable={event.seats - event.bookedSeats === 0}>
                  Reserve Your Seat
                </Button>
              </div>
            </div>
          )}
          {event.accessType === "paid" && (
            <div>
              <p className="text-2xl text-center mt-6">
                <span className="border-b-2 border-blue-600">
                  Ticket Required
                </span>{" "}
                — Make It Yours!
              </p>
              <div className="flex justify-center mt-5 text-lg">
                <p>
                  <PiChairFill className="inline text-black mr-2" />
                  <span className="text-orange-900">
                    {event.seats - event.bookedSeats}
                  </span>{" "}
                  / <span className="text-orange-900">{event.seats} </span>Seats{" "}
                  <span className="text-blue-600">Left</span> |
                  <span className="text-orange-900">
                    {" "}
                    <span className="text-black">price:</span> ${event.price}
                  </span>
                </p>
              </div>
              <div className="flex justify-center mt-6">
                <Button disable={event.seats - event.bookedSeats === 0}>
                  Buy Ticket
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>Loading event details...</p>
      )}
    </>
  );
}

export const loader = async ({ params }) => {
  const res = await fetch(`http://localhost:5000/events/${params.eventId}`);

  if (!res.ok) {
    throw { message: "Could not fetch event details" };
  } else {
    const data = await res.json();
    return data;
  }
};
