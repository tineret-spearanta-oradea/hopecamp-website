import React from "react";

const ImageInputField = ({ handleImageChange }) => (
<div>
  <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
  <input
    type="file"
    name="imageUrl"
    onChange={handleImageChange}
    className="mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
    accept="image/*"  // This limits the file input to image types
  />
</div>
);

export default ImageInputField;
