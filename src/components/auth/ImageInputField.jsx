import React from "react";

const ImageInputField = ({ label, handleImageChange }) => (
  <div className="mt-2">
    <label className="text-sm text-gray-600 font-bold">{label}</label>
    <input
      type="file"
      name="imageUrl"
      onChange={handleImageChange}
      className="mt-2 block w-full sm:text-sm border-gray-300 rounded-md"
      accept="image/*" // This limits the file input to image types
    />
  </div>
);

export default ImageInputField;
