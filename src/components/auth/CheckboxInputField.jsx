import React from "react";

const CheckboxInputField = ({ label, checked, onChange }) => (
  <div className="flex items-center">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="mr-2"
    />
    <label className="text-sm text-gray-600">{label}</label>
  </div>
);

export default CheckboxInputField;
