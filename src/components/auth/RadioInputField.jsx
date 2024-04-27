import React, { useState, useEffect, useRef } from "react";

const RadioInputField = ({
  label,
  name,
  options,
  value,
  onChange,
  errorMessage,
}) => {
  const [otherValue, setOtherValue] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const otherInputRef = useRef(null); // Create a ref for the input element

  useEffect(() => {
    const otherOption = options.find((option) => option.isOther);
    const valueMatchesOption = options.some((option) => option.value === value);
    if (otherOption && !valueMatchesOption && value) {
      setOtherValue(value);
      setSelectedOption(otherOption.value);
    } else {
      setOtherValue("");
      setSelectedOption(value);
    }
  }, [value, options]);

  const handleRadioChange = (event) => {
    const { value } = event.target;
    setSelectedOption(value);
    const selectedOptionObject = options.find(
      (option) => option.value === value
    );
    if (selectedOptionObject && selectedOptionObject.isOther) {
      setOtherValue(value);
      onChange({ target: { value, name } });
      otherInputRef.current.focus(); // Focus the input element
    } else {
      setOtherValue("");
      onChange(event);
    }
  };

  const handleOtherChange = (event) => {
    const { value } = event.target;
    const otherOption = options.find((option) => option.isOther);
    setOtherValue(value);
    setSelectedOption(otherOption.value); // Set selectedOption to the value of the "other" option
    onChange({ target: { value, name } });
  };

  return (
    <div>
      <span className="text-sm text-gray-600 font-bold">{label}</span>
      <div className="mt-2 flex flex-col">
        {options.map((option) => (
          <div key={option.value} className="flex items-center my-2">
            <label>
              <input
                type="radio"
                className="form-radio"
                name={name}
                value={option.value}
                checked={selectedOption === option.value}
                onChange={handleRadioChange}
              />
              <span className="ml-2">{option.label}</span>
            </label>
            {option.isOther && (
              <input
                ref={otherInputRef} // Assign the ref to the input element
                type="text"
                className="w-60 px-3 py-1 mx-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                value={otherValue}
                onChange={handleOtherChange}
              />
            )}
          </div>
        ))}
      </div>
      {errorMessage && (
        <p className="text-red-500 text-xs italic">{errorMessage}</p>
      )}
    </div>
  );
};

export default RadioInputField;
