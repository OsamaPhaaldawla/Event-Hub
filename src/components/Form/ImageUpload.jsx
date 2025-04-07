import { useState } from "react";

function ImageUpload({ handleImageChange }) {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageUploaded, setImageUploaded] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setImageUploaded(false);
    handleImageChange(e);
  };

  const handleUpload = async () => {
    if (!file) return alert("Select an image first!");

    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("http://localhost:5001/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (response.ok) {
      setImageUrl(`http://localhost:5001${data.imageUrl}`);
      setImageUploaded(true);
    }
  };

  return (
    <div>
      <label className="text-lg block" htmlFor="image">
        Event Image *
      </label>
      <input
        className="border border-gray-300 p-2 rounded w-fit bg-green-200 mt-1 cursor-pointer mb-3"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        id="image"
        name="image"
      />
      {!imageUploaded ? (
        <button
          className="inline-block ml-3 border border-blue-600 py-2 px-3 rounded-lg hover:border-white hover:bg-blue-600 hover:text-white cursor-pointer transition duration-200"
          onClick={handleUpload}
        >
          Upload
        </button>
      ) : (
        <p className="inline-block ml-3">Image Uploaded Successfully.</p>
      )}
      {imageUrl && (
        <img className="mb-3" src={imageUrl} alt="Uploaded" width="120" />
      )}
    </div>
  );
}

export default ImageUpload;
