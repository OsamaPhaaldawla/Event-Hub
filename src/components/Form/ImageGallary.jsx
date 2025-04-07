import { useState } from "react";

export default function ImageGallary({ selectedVenue }) {
  const [selectedImage, setSelectedImage] = useState(selectedVenue.images[0]);

  function handleImageChange(url) {
    setSelectedImage(url);
  }

  return (
    <div className="w-full">
      <div className="w-full h-[400px] mt-6">
        <img
          src={selectedImage}
          alt="Venue image"
          className="w-full h-full rounded-lg"
        />
      </div>
      <div className="flex h-[90px] my-6 gap-2 justify-between lg:max-w-[80%] mx-auto lg:gap-10 xl:gap-12 xl:max-w-[70%] bg-stone-300 p-3 rounded-lg">
        {selectedVenue.images.map((url) => (
          <div className="w-full">
            <img
              src={url}
              key={url}
              className={`w-[${
                100 / selectedVenue.images.length
              }%] rounded-lg w-full h-full border-2 border-blue-600 ${
                url === selectedImage ? "border-4 saturate-50" : ""
              }`}
              onClick={() => handleImageChange(url)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
