import { useEffect, useState } from "react";

export default function SlotInput({ onSlotsChange }) {
  const [slots, setSlots] = useState([{ date: "", times: [""] }]);

  const handleSlotChange = (index, key, value) => {
    const updated = [...slots];
    updated[index][key] = value;
    setSlots(updated);
  };

  const handleTimeChange = (slotIndex, timeIndex, value) => {
    const updated = [...slots];
    updated[slotIndex].times[timeIndex] = value;
    setSlots(updated);
  };

  const addSlot = () => {
    setSlots([...slots, { date: "", times: [""] }]);
  };

  const removeSlot = (slotIndex) => {
    const updated = [...slots];
    updated.splice(slotIndex, 1);
    setSlots(updated);
  };

  const addTime = (slotIndex) => {
    const updated = [...slots];
    updated[slotIndex].times.push("");
    setSlots(updated);
  };

  const removeTime = (slotIndex, timeIndex) => {
    const updated = [...slots];
    updated[slotIndex].times.splice(timeIndex, 1);

    // If no times left, we’ll add one empty string to avoid breaking the UI
    if (updated[slotIndex].times.length === 0) {
      updated[slotIndex].times.push("");
    }

    setSlots(updated);
  };

  useEffect(() => {
    onSlotsChange(slots);
  }, [slots]);

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Available Slots</h3>
      {slots.map((slot, slotIndex) => (
        <div
          key={slotIndex}
          className="bg-gray-100 p-4 rounded space-y-2 relative"
        >
          <div className="flex justify-between items-center">
            <label className="font-medium">Date</label>
            <button
              type="button"
              onClick={() => removeSlot(slotIndex)}
              className="text-red-600 text-sm hover:underline"
            >
              🗑 Remove Slot
            </button>
          </div>
          <input
            type="date"
            value={slot.date}
            onChange={(e) =>
              handleSlotChange(slotIndex, "date", e.target.value)
            }
            className="input w-full"
            required
          />
          <h4>Times Available:</h4>
          {slot.times.map((time, timeIndex) => (
            <div key={timeIndex} className="flex items-center gap-2">
              <input
                type="time"
                value={time}
                onChange={(e) =>
                  handleTimeChange(slotIndex, timeIndex, e.target.value)
                }
                className="input w-full"
                required
              />
              <button
                type="button"
                onClick={() => removeTime(slotIndex, timeIndex)}
                className="text-red-500 text-sm"
              >
                ❌
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn mt-2"
            onClick={() => addTime(slotIndex)}
          >
            + Add Time
          </button>
        </div>
      ))}
      <button type="button" onClick={addSlot} className="btn ">
        + Add Slot
      </button>
    </div>
  );
}

// import { useState, useEffect } from "react";

// import Input from "./Form/Input";

// export default function SlotsInput({ onSlotsChange }) {
//   const [slots, setSlots] = useState([{ date: "", times: [""] }]);
//   const handleSlotChange = (index, key, value) => {
//     const updated = [...slots];
//     updated[index][key] = value;
//     setSlots(updated);
//   };
//   const handleTimeChange = (slotIndex, timeIndex, value) => {
//     const updated = [...slots];
//     updated[slotIndex].times[timeIndex] = value;
//     setSlots(updated);
//   };
//   const addSlot = () => {
//     setSlots([...slots, { date: "", times: [""] }]);
//   };
//   const addTime = (slotIndex) => {
//     const updated = [...slots];
//     updated[slotIndex].times.push("");
//     setSlots(updated);
//   };

//   // Sync the slots back to the parent
//   useEffect(() => {
//     onSlotsChange(slots);
//   }, [slots, onSlotsChange]);

//   return (
//     <div className="space-y-3">
//       <h3 className="font-semibold">Available Slots</h3>
//       {slots.map((slot, slotIndex) => (
//         <div key={slotIndex} className="bg-gray-100 p-4 rounded space-y-2">
//           <Input
//             type="date"
//             value={slot.date}
//             onChange={(e) =>
//               handleSlotChange(slotIndex, "date", e.target.value)
//             }
//             required
//             label="date"
//           />
//           <h4>Times Available:</h4>
//           {slot.times.map((time, timeIndex) => (
//             <Input
//               key={timeIndex}
//               type="time"
//               value={time}
//               onChange={(e) =>
//                 handleTimeChange(slotIndex, timeIndex, e.target.value)
//               }
//               className="input w-full"
//               //   required
//             />
//           ))}
//           <button
//             type="button"
//             className="btn mt-2"
//             onClick={() => addTime(slotIndex)}
//           >
//             + Add Time
//           </button>
//         </div>
//       ))}
//       <button
//         type="button"
//         onClick={addSlot}
//         className="btn text-blue-600 border border-blue-600 p-2 rounded-lg hover:text-white hover:bg-blue-600 duration-100"
//       >
//         + Add Slot
//       </button>
//     </div>
//   );
// }
