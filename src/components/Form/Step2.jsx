import { useLoaderData } from "react-router";
import SelectInput from "./SelectInput";
import { useEffect, useState } from "react";
import { validateStep2 } from "./Validatioin";
import ImageGall from "../ImageGall";

export default function Step2({ next, prev, oldData, setVenueName, edit }) {
  let venues = useLoaderData();

  if (edit) venues = venues.venuesData;
  const venueData = venues.map((venue) => ({
    name: venue.name,
    id: venue.id,
  }));

  const [selectedVenue, setSelectedVenue] = useState(
    edit ? venues.find((venue) => venue.id === oldData.venue.id) : {}
  );

  useEffect(() => {
    if (edit) setVenueName(selectedVenue.name);
  }, [edit, selectedVenue, setVenueName]);

  const [errors, setErrors] = useState({});
  const [time, setTime] = useState(() => {
    if (!edit) return [];

    const oldDateOnly = oldData.date.slice(0, 10); // "2025-04-25"

    const matchedSlot = selectedVenue.availableSlots.find(
      (item) => item.date === oldDateOnly
    );

    return matchedSlot ? matchedSlot.times : [];
  });

  function handleChange(event) {
    const selectedVenue = venues.find(
      (venue) => venue.id === +event.target.value
    );
    setSelectedVenue(selectedVenue);
  }

  function handleTimeChange(event) {
    const item = selectedVenue.availableSlots.find(
      (item) => item.date === event.target.value
    );
    setTime(item.times);
  }

  function handleClick() {
    const fd = new FormData(document.querySelector("form"));
    const data = Object.fromEntries(fd.entries());

    if (edit && data.image.size === 0) delete data.image;

    const { validationErrors } = validateStep2(data, selectedVenue);
    if (validationErrors) {
      setErrors({ ...validationErrors });
    } else {
      setErrors({});
      next();
    }
  }

  return (
    <div className="mb-12">
      <h2 className="text-xl mb-2 font-bold">Venue Selection: </h2>
      <SelectInput
        options={venueData}
        venues={true}
        placeHolder={"Select a venue"}
        name={"venueId"}
        error={errors.venueName}
        onChange={handleChange}
        defaultValue={edit ? oldData.venueName : ""}
      />
      {selectedVenue.name && (
        <>
          <ImageGall images={selectedVenue.images} />
          <div>
            <div className="flex justify-between items-center mt-3 mb-2">
              <p className="text-xl">
                Capacity:{" "}
                <span className="text-emerald-500">
                  {selectedVenue.capacity}
                </span>
              </p>
              <a
                href={selectedVenue.url}
                target="_blank"
                className="underline text-blue-600 text-xl"
              >
                {selectedVenue.location}
              </a>
            </div>
            <p className="text-xl mb-2">
              Price per hour:{" "}
              <span className="text-emerald-500">{selectedVenue.price}</span>
            </p>
            <div className="flex gap-4">
              <div className="w-1/2">
                <SelectInput
                  label="Available date"
                  options={selectedVenue.availableSlots.map(
                    (item) => item.date
                  )}
                  onChange={handleTimeChange}
                  name="date"
                  error={errors.date}
                  placeHolder="Reserve a date"
                  defaultValue={edit ? oldData.date : ""}
                />
              </div>
              <div className="w-1/2">
                <SelectInput
                  label="Available Time"
                  options={time}
                  name="time"
                  error={errors.time}
                  placeHolder="Reserve a time"
                  defaultValue={edit ? oldData.time : ""}
                />
              </div>
            </div>
            <p className="mt-2 whitespace-pre-line" dir="auto">
              {selectedVenue.description}
            </p>
          </div>
        </>
      )}
      <div className="mt-6 flex justify-between mb-3">
        <button
          type="button"
          onClick={prev}
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg cursor-pointer"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={handleClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export const loader = async () => {
  const res = await fetch("http://localhost:3000/venues");
  if (!res.ok)
    throw new Error("Failed to fetch venues please try to refresh the page.");
  const data = await res.json();
  return data;
};
