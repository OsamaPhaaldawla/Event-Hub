import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Using react-icons for arrows

export default function ImageGall({ images }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (images.length > 0) {
      setSelectedIndex(0);
    }
  }, [images]);

  const handlePrevious = () => {
    setSelectedIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setSelectedIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="w-full relative group duration-300">
      <div className="w-4/5 h-[550px] mt-4 relative mx-auto">
        <img
          src={images[selectedIndex].url}
          alt="Venue"
          className="w-full h-full rounded-lg mx-auto "
        />

        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full md:opacity-0 md:group-hover:opacity-100 transition-opacity cursor-pointer"
          aria-label="Previous image"
          type="button"
        >
          <FaChevronLeft size={24} />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full md:opacity-0 md:group-hover:opacity-100 transition-opacity cursor-pointer"
          aria-label="Next image"
          type="button"
        >
          <FaChevronRight size={24} />
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`w-3 h-3 rounded-full ${
              index === selectedIndex ? "bg-blue-600" : "bg-gray-300"
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
