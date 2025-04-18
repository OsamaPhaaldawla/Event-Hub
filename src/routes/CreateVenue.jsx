import { useState } from "react";
import { Form, redirect, useLoaderData, useSubmit } from "react-router";
import Input from "../components/Form/Input";
import SlotsInput from "../components/SlotsInput";
import ImageUploader from "../components/ImageUploader";

export default function CreateVenue({ edit }) {
  const [slots, setSlots] = useState([]);
  const submit = useSubmit();
  const venue = useLoaderData();

  console.log(venue);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    formData.append("availableSlots", JSON.stringify(slots));
    submit(formData, {
      method: edit ? "PUT" : "POST",
      encType: "multipart/form-data",
    });
  };

  return (
    <Form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow space-y-4"
      encType="multipart/form-data"
      method={edit ? "PUT" : "POST"}
    >
      <h2 className="text-2xl font-bold text-center">Create Venue</h2>

      <Input
        name="name"
        placeholder="Name"
        required
        label="Venue Name"
        defaultValue={edit ? venue.name : ""}
      />
      <Input
        name="location"
        placeholder="Location"
        required
        label="Location"
        defaultValue={edit ? venue.location : ""}
      />
      <Input
        name="url"
        placeholder="Google Maps URL"
        label="URL"
        defaultValue={edit ? venue.url : ""}
      />
      <Input
        type="number"
        name="capacity"
        placeholder="Capacity"
        required
        label="Capacity"
        defaultValue={edit ? venue.capacity : ""}
      />
      <Input
        type="number"
        name="price"
        placeholder="Price"
        required
        label="Price per hour"
        defaultValue={edit ? venue.price : ""}
      />
      <Input
        as="textarea"
        name="description"
        placeholder="Description"
        required
        label="Venue Description"
        defaultValue={edit ? venue.description : ""}
        rows={4}
      />

      <SlotsInput
        onSlotsChange={setSlots}
        availableSlots={edit ? venue.availableSlots : null}
      />
      <ImageUploader images={edit ? venue.images : null} />

      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-green-500 px-4 py-2 text-white rounded"
        >
          Submit
        </button>
      </div>
    </Form>
  );
}

export const action = async ({ request, params }) => {
  const token = localStorage.getItem("token");
  const data = await request.formData();

  // Collect the images from the form
  let images = data.getAll("images");

  // Parse availableSlots from the formData if necessary
  let availableSlots = JSON.parse(data.get("availableSlots"));

  // Create a new FormData object to send in the request body
  let formData = new FormData();

  // Add each field from the existing FormData
  data.forEach((value, key) => {
    // Exclude the 'images' field, as we're handling it separately
    if (key !== "images" && key !== "availableSlots") {
      formData.append(key, value);
    }
  });

  // Append the availableSlots (already parsed) as a stringified JSON
  formData.append("availableSlots", JSON.stringify(availableSlots));

  // Append the images array (can be handled as multiple files)
  images.forEach((image) => {
    formData.append("images", image);
  });

  // Send the FormData to the backend
  const response = await fetch(
    `http://localhost:3000/venues${params.venueId ? "/" + params.venueId : ""}`,
    {
      method: request.method, // "POST" or "PUT" depending on the method
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  const result = await response.json();
  console.log(result);

  return redirect("/venues");
};
