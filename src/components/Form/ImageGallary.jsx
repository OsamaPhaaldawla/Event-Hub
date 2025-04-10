import { useEffect, useState } from "react";

export default function ImageGallary({ images }) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(images[0]);
    }
  }, [images]);

  function handleImageChange(image) {
    setSelectedImage(image);
  }

  return (
    <div className="w-full">
      <div className="w-full h-[400px] mt-6">
        <img
          src={selectedImage.url}
          alt="Venue image"
          className="w-full h-full rounded-lg"
        />
      </div>
      <div className="flex h-[90px] my-6 gap-2 justify-between lg:max-w-[80%] mx-auto lg:gap-10 xl:gap-12 xl:max-w-[70%] bg-stone-300 p-3 rounded-lg">
        {images.map((image) => (
          <div className="w-full" key={image.url}>
            <img
              src={image.url}
              className={`w-[${
                100 / images.length
              }%] rounded-lg w-full h-full border-2 border-blue-600 ${
                image.url === selectedImage.url ? "border-4 saturate-50" : ""
              }`}
              onClick={() => handleImageChange(image)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
