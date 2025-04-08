import { useState } from "react";

export default function ImageUploader() {
  const [previews, setPreviews] = useState([]);

  function handleImageChange(event) {
    const files = Array.from(event.target.files);

    const newPreviews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setPreviews(newPreviews);
  }

  return (
    <div className="space-y-2">
      <label className="block font-medium">Upload Images</label>
      <input
        type="file"
        name="images"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        className="input w-full"
      />

      {previews.length > 0 && (
        <div className="flex flex-wrap gap-4 mt-2">
          {previews.map((img, index) => (
            <img
              key={index}
              src={img.url}
              alt={`Preview ${index}`}
              width={120}
              className="rounded shadow"
            />
          ))}
        </div>
      )}
    </div>
  );
}
