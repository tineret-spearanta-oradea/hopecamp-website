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
  maxLength = 32,
  isOptional = false,
  extraInputStyles = "",
}) => {
  return (
    <div className="mt-2">
      <label className="text-sm text-gray-600 font-bold">{label}</label>
      {isOptional && <span className="text-xs text-gray-400"> - opțional</span>}
      <input
        type={type}
        name={name}
        autoComplete={autoComplete}
        required
        disabled={disabled}
        value={value || ""}
        onChange={onChange}
        maxLength={maxLength}
        className={`${
          validationErrorMessage ? "border-red-500" : ""
        } w-full  px-3 py-2 text-gray-500 bg-transparent outline-none border border-gray-300 text-base
       focus:border-hope-lightcyan shadow-sm rounded-lg transition duration-300 ${extraInputStyles}`}
      />
      {validationErrorMessage && (
        <p className="text-red-500 text-xs italic">{validationErrorMessage}</p>
      )}
    </div>
  );
};

export default TextInputField;
