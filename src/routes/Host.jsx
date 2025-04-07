import { useState } from "react";
import { Form, redirect, useLoaderData } from "react-router";
import Step1 from "../components/Form/Step1";
import FormProgress from "../components/Form/FormProgress";
import Step2 from "../components/Form/Step2";
import Step3 from "../components/Form/Step3";

export default function Host({ edit }) {
  const [activeStep, setActiveStep] = useState(1);
  let data = useLoaderData();
  let event = data.eventData;

  const nextStep = () => setActiveStep((prev) => prev + 1);
  const prevStep = () => setActiveStep((prev) => prev - 1);

  return (
    <>
      <div className="container mx-auto px-4 mt-4">
        <div className="flex justify-between gap-x-4 min-h-[600px] mb-4 bg-gray-100">
          <div className="flex w-1/3 justify-center items-center bg-black text-white rounded-r-4xl">
            <FormProgress activeStep={activeStep} />
          </div>
          <div className="mt-12 w-2/3 px-4">
            <Form
              encType="multipart/form-data"
              method={edit ? "PUT" : "POST"}
              className="max-w-[92%] mx-auto"
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
                <Step3 oldData={edit && event} prev={prevStep} />
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}

export const editDataLoader = async ({ params }) => {
  const resEvents = await fetch(`/api/events/${params.eventId}`);
  const resVenues = await fetch("/api/venues");

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
  const data = await request.formData();
  const myData = Object.fromEntries(data.entries());
  console.log(request);
  fetch(
    `http://localhost:5000/events/${params.eventId ? params.eventId : ""}`,
    {
      method: request.method,
      body: JSON.stringify(myData),
    }
  );

  return redirect("/events");
};
