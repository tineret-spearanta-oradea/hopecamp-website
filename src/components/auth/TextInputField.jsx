import React from "react";

const TextInputField = ({
  label,
  type,
  name,
  autoComplete,
  disabled,
  value,
  onChange,
  validationErrorMessage,
}) => (
  <div>
    <label className="text-sm text-gray-600 font-bold">{label}</label>
    <input
      type={type}
      name={name}
      autoComplete={autoComplete}
      required
      disabled={disabled}
      value={value || ""}
      onChange={onChange}
      className={`${
        validationErrorMessage ? "border-red-500" : ""
      } w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300`}
    />
    {validationErrorMessage && (
      <p className="text-red-500 text-xs italic">{validationErrorMessage}</p>
    )}
  </div>
);

export default TextInputField;
