import { useLoaderData } from "react-router";
import SelectInput from "./SelectInput";
import { useState } from "react";
import ImageGallary from "./ImageGallary";
import { validateStep2 } from "./Validatioin";

export default function Step2({ next, prev, oldData }) {
  let venues = useLoaderData();

  if (oldData) venues = venues.venuesData;

  const venuesNames = venues.map((venue) => venue.name);

  const [selectedVenue, setSelectedVenue] = useState(
    oldData ? venues.find((venue) => venue.name === oldData.venueName) : {}
  );

  const [errors, setErrors] = useState({});
  const [time, setTime] = useState(
    oldData
      ? selectedVenue.availableSlots.find((item) => item.date === oldData.date)
          .times
      : []
  );

  function handleChange(event) {
    const selectedVenue = venues.find(
      (venue) => venue.name === event.target.value
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

    const { validationErrors } = validateStep2(data, selectedVenue);
    if (validationErrors) {
      setErrors({ ...validationErrors });
    } else {
      next();
    }
  }

  return (
    <>
      <h2 className="text-xl mb-2 font-bold">Venue Selection: </h2>
      <SelectInput
        options={venuesNames}
        placeHolder={"Select a venue"}
        name={"venueName"}
        error={errors.venueName}
        onChange={handleChange}
        defaultValue={oldData ? oldData.venueName : ""}
      />
      {selectedVenue.name && (
        <>
          <ImageGallary selectedVenue={selectedVenue} />
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
                  defaultValue={oldData ? oldData.date : ""}
                />
              </div>
              <div className="w-1/2">
                <SelectInput
                  label="Available Time"
                  options={time}
                  name="time"
                  error={errors.time}
                  placeHolder="Reserve a time"
                  defaultValue={oldData ? oldData.time : ""}
                />
              </div>
            </div>
            <p className="mt-2">{selectedVenue.description}</p>
          </div>
        </>
      )}
      <div className="mt-10 flex justify-between mb-3">
        <button
          type="button"
          onClick={prev}
          className="bg-gray-500 px-4 py-2 text-white rounded"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleClick}
          className="bg-blue-500 px-4 py-2 text-white rounded"
        >
          Next
        </button>
      </div>
    </>
  );
}

export const loader = async () => {
  const res = await fetch("/api/venues");
  if (!res.ok)
    throw new Error("Failed to fetch venues please try to refresh the page.");
  const data = await res.json();
  return data;
};
