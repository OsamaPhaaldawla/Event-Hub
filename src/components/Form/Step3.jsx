// import { useState } from "react";
// import { validateStep3 } from "./Validatioin";
import { ClipboardList, ImageDown, MapPin } from "lucide-react";

export default function Step3({
  prev,
  handleSubmit,
  formRef,
  venueName,
  oldData,
  edit,
}) {
  //? an old step3 prop oldData,
  // const [errors, setErrors] = useState({});

  const data = new FormData(formRef.current);
  const formData = Object.fromEntries(data.entries());

  //* old Third Step validation and submition
  // function onSubmit(e) {
  //   e.preventDefault();
  //   const formData = new FormData(formRef.current);
  //   const validationData = Object.fromEntries(formData.entries());
  //   console.log(validationData);
  //   const { validationErrors } = validateStep3(validationData);

  //   if (validationErrors) {
  //     setErrors({ ...validationErrors });
  //   } else {
  //   handleSubmit();
  //   }
  // }

  return (
    <div className="space-y-6 mb-12">
      {/* 1. Event Details */}
      <div className="border p-4 rounded-2xl shadow-md">
        <h2 className="text-xl font-bold mb-2 flex items-center">
          <ClipboardList size={26} className="text-gray-600 mr-1" />
          Event Details
        </h2>
        <p>
          <strong>Title:</strong> {formData.title}
        </p>
        {formData.subtitle && (
          <p>
            <strong>Subtitle:</strong> {formData.subtitle}
          </p>
        )}
        <p>
          <strong>Type:</strong> {formData.type}
        </p>
        <p>
          <strong>Access Type:</strong> {formData.accessType}
        </p>

        {(formData.accessType === "free-limited" ||
          formData.accessType === "paid") && (
          <p>
            <strong>Available Seats:</strong> {formData.seats}
          </p>
        )}

        {formData.accessType === "paid" && (
          <p>
            <strong>Price:</strong> ${formData.price}
          </p>
        )}

        <p className="mt-2">
          <strong>Description:</strong> {formData.description}
        </p>
      </div>

      {/* 2. Image Preview */}
      {formData.image && (
        <div className="border p-4 rounded-2xl shadow-md">
          <h2 className="text-xl font-bold mb-2 flex items-center">
            <ImageDown size={26} className="text-gray-600 mr-1" />
            Event Image
          </h2>
          <div className="lg:w-4/5 mx-auto">
            <img
              src={
                edit ? oldData.image.url : URL.createObjectURL(formData.image)
              }
              alt="Event"
              className="w-full h-44 lg:h-80 object-cover rounded-lg my-2"
            />
          </div>
        </div>
      )}

      {/* 3. Venue Selection */}
      <div className="border p-4 rounded-2xl shadow-md">
        <h2 className="text-xl font-bold mb-2 flex items-center">
          <MapPin size={24} className="text-gray-600 mr-1" />
          Venue Selection
        </h2>
        <p>
          <strong>Venue:</strong> {venueName}
        </p>
        <p>
          <strong> Date:</strong> {formData.date}
        </p>
        <p>
          <strong>Time:</strong> {formData.time}
        </p>
      </div>

      {/* 4. Action Buttons */}
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={prev}
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg cursor-pointer"
        >
          ← Edit
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg cursor-pointer"
        >
          ✅ Submit Event
        </button>
      </div>
    </div>
  );
}

//   return (
//     <div className="space-y-4">
//       {/* Event Details */}
//       <div className="p-4 rounded-2xl shadow">
//         <h2 className="text-xl font-semibold mb-2">📅 Event Details</h2>
//         <p>
//           <strong>Title:</strong> {formData.title}
//         </p>
//         {formData.subtitle && (
//           <p>
//             <strong>Subtitle:</strong> {formData.subtitle}
//           </p>
//         )}
//         <p>
//           <strong>Price:</strong> ${formData.price}
//         </p>
//         <p>
//           <strong>Description:</strong> {formData.description}
//         </p>
//       </div>

//       {/* Venue Info */}
//       <div className="p-4 rounded-2xl shadow">
//         <h2 className="text-xl font-semibold mb-2">🏛️ Venue Info</h2>
//         <p>
//           <strong>Venue:</strong> {formData.venueName}
//         </p>
//         <p>
//           <strong>Date:</strong> {formData.date}
//         </p>
//         <p>
//           <strong>Time:</strong> {formData.time}
//         </p>
//       </div>

//       {/* Image Preview */}
//       {formData.image && (
//         <div className="p-4 rounded-2xl shadow">
//           <h2 className="text-xl font-semibold mb-2">🖼️ Event Image</h2>
//           <img
//             src={URL.createObjectURL(formData.image)}
//             alt="Event"
//             className="rounded-xl h-40 object-cover"
//           />
//         </div>
//       )}
//       <div className="mt-10 flex justify-between mb-3">
//         <button
//           type="button"
//           onClick={prev}
//           className="bg-gray-500 px-4 py-2 text-white rounded cursor-pointer hover:bg-gray-700"
//         >
//           ← Edit
//         </button>

//         <button
//           type="button"
//           className="bg-green-500 px-4 py-2 text-white rounded cursor-pointer hover:bg-green-600"
//           onClick={handleSubmit}
//         >
//           Confirm and submit 👍
//         </button>
//       </div>
//     </div>
//   );
// }
