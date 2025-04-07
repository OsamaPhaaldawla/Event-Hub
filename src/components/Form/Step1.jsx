import { useState } from "react";
import { eventTypes } from "../../constants";
import Input from "./Input";
import SelectInput from "./SelectInput";
import { validateStep1 } from "./Validatioin";

export default function Step1({ next, oldData }) {
  const [accessType, setAccessType] = useState(
    oldData ? oldData.accessType : null
  );
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);

  function handleImageChange(event) {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  }

  function handleClick() {
    const fd = new FormData(document.querySelector("form"));
    const data = Object.fromEntries(fd.entries());

    const { validationErrors } = validateStep1(data);
    if (validationErrors) {
      setErrors({ ...validationErrors });
    } else {
      next();
    }
  }

  return (
    <div id="step-1">
      <h2 className="text-xl mb-2 font-bold">Event Information:</h2>
      <p className="text-gray-600 mb-4">Required fields *</p>
      <Input
        name="title"
        label="Event Title"
        type="text"
        required
        error={errors.title}
        defaultValue={oldData ? oldData.title : ""}
      />
      <Input
        name="subtitle"
        label="Event Subtitle"
        type="text"
        error={errors.subtitle}
        defaultValue={oldData ? oldData.subtitle : ""}
      />
      <div className="flex justify-between gap-4">
        <div className="w-1/2 mb-3">
          <SelectInput
            label="Event Type *"
            options={eventTypes}
            placeHolder="Your Event Type"
            name="type"
            error={errors.type}
            defaultValue={oldData ? oldData.type : ""}
          />
        </div>
        <div className="w-1/2 mb-3">
          <SelectInput
            label="Access Type *"
            options={["open", "free-limited", "paid"]}
            placeHolder="Accessablity"
            onChange={(e) => setAccessType(e.target.value)}
            name="accessType"
            error={errors.accessType}
            defaultValue={oldData ? oldData.accessType : ""}
          />
        </div>
      </div>
      <div className="flex justify-between gap-4">
        {(accessType === "free-limited" || accessType === "paid") && (
          <div className="w-1/2">
            <Input
              type="number"
              name="seats"
              label="Seats Avaialble"
              required
              className="w-1/2"
              placeholder="0"
              error={errors.seats}
              defaultValue={oldData ? oldData.seats : ""}
            />
          </div>
        )}
        {accessType === "paid" && (
          <div className="w-1/2">
            <Input
              type="number"
              name="price"
              label="Ticket Price"
              required
              className="w-1/2"
              placeholder="0"
              error={errors.price}
              defaultValue={oldData ? oldData.price : ""}
            />
          </div>
        )}
      </div>
      <div className="w-fit">
        <Input
          name="image"
          type="file"
          label="Event Image"
          className="w-1/2 bg-green-200 cursor-pointer border-none mb-2"
          onChange={handleImageChange}
        />
        {preview && (
          <img className="mb-3" width={120} src={preview} alt="Preview" />
        )}
      </div>
      <div>
        <Input
          as="textarea"
          name="description"
          label="Event Description"
          required
          className="resize-none"
          rows="3"
          error={errors.description}
          defaultValue={oldData ? oldData.description : ""}
        />
      </div>
      <div className="mt-10 mb-3">
        <button
          type="button"
          onClick={handleClick}
          className="bg-blue-500 px-4 py-2 text-white rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
