import { useState } from "react";
import { useLoaderData } from "react-router";

const PendingVenues = () => {
  const pendingVenues = useLoaderData();
  const [venues, setVenues] = useState(pendingVenues);

  const token = localStorage.getItem("token");

  const updateVenueStatus = async (venueId, status) => {
    try {
      const res = await fetch(
        `http://localhost:3000/venues/${venueId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to update status to ${status}`);
      }

      // Refetch or filter out updated venue
      setVenues((prev) => prev.filter((v) => v.id !== venueId));
    } catch (err) {
      console.error(err);
      alert("There was an error updating the venue status.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Pending Venues</h2>
      <div className="space-y-4">
        {venues.map((venue) => (
          <div key={venue.id} className="border rounded-xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold">{venue.name}</h3>
            <p>
              <strong>Location:</strong> {venue.location}
            </p>
            <p>
              <strong>Capacity:</strong> {venue.capacity}
            </p>
            <p>
              <strong>Price:</strong> ${venue.price}
            </p>
            <p>
              <strong>Owner ID:</strong> {venue.owner_id}
            </p>
            <p>
              <strong>Description:</strong> {venue.description}
            </p>
            <p>
              <strong>Status:</strong> {venue.status}
            </p>

            <div className="mt-3 space-x-2">
              <button
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                onClick={() => updateVenueStatus(venue.id, "approved")}
              >
                Approve
              </button>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                onClick={() => updateVenueStatus(venue.id, "rejected")}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingVenues;

export const loader = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:3000/venues/pending", {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw { message: "Error fetching pending venues" };
  } else {
    const data = await res.json();
    return data;
  }
};

// const fetchPendingVenues = async () => {
//   try {
//     const res = await fetch("http://localhost:3000/venues/pending");
//     const data = await res.json();
//     console.log(data);
//     setPendingVenues(data);
//   } catch (err) {
//     console.error("Error fetching pending venues:", err);
//   }
// };
