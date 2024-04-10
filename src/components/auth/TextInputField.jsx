import React from "react";

const InputField = ({
  label,
  type,
  name,
  autoComplete,
  disabled,
  value,
  onChange,
}) => (
  <div>
    <label className="text-sm text-gray-600 font-bold">{label}</label>
    <input
      type={type}
      name={name} // Added name attribute
      autoComplete={autoComplete}
      required
      disabled={disabled}
      value={value}
      onChange={onChange}
      className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
    />
  </div>
);

export default InputField;
