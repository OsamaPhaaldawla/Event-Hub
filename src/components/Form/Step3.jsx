import { useState } from "react";
import Input from "./Input";
import { validateStep3 } from "./Validatioin";

export default function Step3({ prev, oldData, handleSubmit }) {
  const [errors, setErrors] = useState({});

  function onSubmit(e) {
    e.preventDefault();
    const formData = new FormData(document.querySelector("form"));

    const validationData = Object.fromEntries(formData.entries());
    const { validationErrors } = validateStep3(validationData);

    if (validationErrors) {
      setErrors({ ...validationErrors });
    } else {
      handleSubmit();
    }
  }

  return (
    <>
      <h2 className="text-xl mb-2 font-bold">Host Information:</h2>
      <p className="text-gray-600 mb-4">Required fields *</p>
      <Input
        name="hosterName"
        label="Name:"
        placeholder="Enter your Name"
        required
        error={errors.hosterName}
        defaultValue={oldData ? oldData.hosterName : ""}
      />
      <Input
        name="hosterEmail"
        type="email"
        label="Email:"
        placeholder="name@example.com"
        required
        error={errors.hosterEmail}
        defaultValue={oldData ? oldData.hosterEmail : ""}
      />
      <div className="flex">
        <div className="flex-1">
          <Input
            name="hosterPassword"
            label={
              <div className="flex items-center mb-1 mt-3">
                Write a password
                <div className="group relative ml-2">
                  <span className="cursor-pointer bg-blue-600 text-white px-2 py-1 rounded w-10 h-8">
                    ?
                  </span>
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-50 p-2 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    You will need the Email & Password if you want to edit the
                    event later.
                  </div>
                </div>
              </div>
            }
            placeholder="***********"
            type="password"
            error={errors.hosterPassword}
            defaultValue={oldData ? oldData.hosterPassword : ""}
          />
        </div>
      </div>
      <Input
        as="textarea"
        name="hosterDescription"
        label="Description"
        placeholder="Write about your self"
        className="resize-none"
        rows="3"
        defaultValue={oldData ? oldData.hosterDescription : ""}
      />
      <div className="mt-10 flex justify-between mb-3">
        <button
          type="button"
          onClick={prev}
          className="bg-gray-500 px-4 py-2 text-white rounded"
        >
          Back
        </button>

        <button
          type="submit"
          className="bg-green-500 px-4 py-2 text-white rounded"
          onClick={onSubmit}
        >
          Submit
        </button>
      </div>
    </>
  );
}
