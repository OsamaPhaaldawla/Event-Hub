import { useState } from "react";
import { eventTypes } from "../../constants";
import Input from "./Input";
import SelectInput from "./SelectInput";
import { validateStep1 } from "./Validatioin";

export default function Step1({ next, oldData, edit = false }) {
  const [accessType, setAccessType] = useState(
    edit ? oldData.accessType : null
  );
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(edit ? oldData.image.url : null);

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

    if (edit && data.image.size === 0) delete data.image;

    const { validationErrors } = validateStep1(data);
    if (validationErrors) {
      setErrors({ ...validationErrors });
    } else {
      next();
    }
  }

  return (
    <div className="mb-12">
      <h2 className="text-xl mb-2 font-bold">Event Information:</h2>
      <p className="text-gray-600 mb-4">Required fields *</p>
      <Input
        name="title"
        label="Event Title"
        type="text"
        required
        error={errors.title}
        defaultValue={edit ? oldData.title : ""}
      />
      <Input
        name="subtitle"
        label="Event Subtitle"
        type="text"
        error={errors.subtitle}
        defaultValue={edit ? oldData.subtitle : ""}
      />
      <div className="flex justify-between gap-4">
        <div className="w-1/2 mb-3">
          <SelectInput
            label="Event Type *"
            options={eventTypes}
            placeHolder="Your Event Type"
            name="type"
            error={errors.type}
            defaultValue={edit ? oldData.type : ""}
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
            defaultValue={edit ? oldData.accessType : ""}
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
              defaultValue={edit ? oldData.seats : ""}
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
              defaultValue={edit ? oldData.price : ""}
            />
          </div>
        )}
      </div>
      <div className="w-fit">
        <Input
          name="image"
          type="file"
          label="Event Image"
          required={!edit}
          className="w-1/2 bg-green-200 cursor-pointer border-none mb-2"
          onChange={handleImageChange}
          error={errors.image}
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
          defaultValue={edit ? oldData.description : ""}
        />
      </div>
      <div className="mt-6 mb-3">
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
