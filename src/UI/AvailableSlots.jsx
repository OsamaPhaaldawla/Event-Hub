export default function AvailableSlots({ availableSlots }) {
  // Format date to "Weekday, Month Day" (e.g., "Fri, Apr 25")
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Format time to 12-hour format (e.g., "4:30 PM")
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    return `${hour > 12 ? hour - 12 : hour}:${minutes} ${
      hour >= 12 ? "PM" : "AM"
    }`;
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold mb-4">Available Times:</h3>

      {availableSlots.map((slot, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-4">
          <div className="font-semibold text-lg mb-2">
            {formatDate(slot.date)}
          </div>

          <div className="flex flex-wrap gap-2">
            {slot.times.map((time, timeIndex) => (
              <button
                key={timeIndex}
                className="px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-full 
                            transition-colors duration-200"
                onClick={() => console.log("Selected:", slot.date, time)}
              >
                {formatTime(time)}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
