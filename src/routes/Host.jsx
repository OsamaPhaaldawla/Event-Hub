import { useRef, useState } from "react";
import { Form, redirect, useLoaderData, useSubmit } from "react-router";
import Step1 from "../components/Form/Step1";
import FormProgress from "../components/Form/FormProgress";
import Step2 from "../components/Form/Step2";
import Step3 from "../components/Form/Step3";

export default function Host({ edit }) {
  const [activeStep, setActiveStep] = useState(1);
  let data = useLoaderData();
  let event = data.eventData;
  const submit = useSubmit();
  const form = useRef();

  const nextStep = () => setActiveStep((prev) => prev + 1);
  const prevStep = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = () => {
    const formData = new FormData(form.current);
    submit(formData, {
      method: edit ? "PUT" : "POST",
      encType: "multipart/form-data",
    });
  };

  return (
    <>
      <div className="container mx-auto px-4 mt-4">
        <div className="flex justify-between gap-x-4 min-h-[600px] mb-4 bg-gray-100">
          <div className="flex w-1/3 justify-center items-center bg-black text-white rounded-r-4xl">
            <FormProgress activeStep={activeStep} />
          </div>
          <div className="mt-12 w-2/3 px-4">
            <Form
              ref={form}
              encType="multipart/form-data"
              method={edit ? "PUT" : "POST"}
              className="max-w-[92%] mx-auto"
              //? working without it onSubmit={handleSubmit}
            >
              <div className={activeStep === 1 ? "block" : "hidden"}>
                <Step1 oldData={edit && event} next={nextStep} />
              </div>

              <div className={activeStep === 2 ? "block" : "hidden"}>
                <Step2
                  next={nextStep}
                  prev={prevStep}
                  oldData={edit && event}
                  edit={edit}
                />
              </div>

              <div className={activeStep === 3 ? "block" : "hidden"}>
                <Step3
                  oldData={edit && event}
                  prev={prevStep}
                  handleSubmit={handleSubmit}
                />
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}

export const editDataLoader = async ({ params }) => {
  const resEvents = await fetch(
    `http://localhost:3000/events/${params.eventId}`
  );
  const resVenues = await fetch("http://localhost:3000/venues");

  if (!resEvents.ok) {
    throw { message: "Could not fetch event details." };
  } else if (!resVenues.ok) {
    throw {
      message: "Failed to fetch available venues.",
    };
  } else {
    const eventData = await resEvents.json();
    const venuesData = await resVenues.json();
    return { eventData, venuesData };
  }
};

export const action = async ({ request, params }) => {
  const formData = await request.formData();

  // Debug: Check ALL FormData entries
  console.log("All FormData entries:");
  for (let [key, value] of formData.entries()) {
    console.log(key, value instanceof File ? `File: ${value.name}` : value);
  }

  // Reconstruct FormData with proper file handling
  const fetchFormData = new FormData();

  // Copy all fields (including files)
  for (let [key, value] of formData.entries()) {
    fetchFormData.append(key, value);
  }

  try {
    const response = await fetch(
      `http://localhost:3000/events/${params.eventId || ""}`,
      {
        method: request.method,
        body: fetchFormData, // Use reconstructed FormData
      }
    );

    if (!response.ok) throw new Error("Failed to submit");
    return redirect("/events");
  } catch (error) {
    console.error("Submission error:", error);
    throw { error: error.message, status: 500 };
  }
};
