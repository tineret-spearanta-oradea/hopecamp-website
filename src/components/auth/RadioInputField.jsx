import React, { useState } from 'react';

const RadioInputField = ({ label, name, options, value, onChange, onOtherChange, otherValue, showOther, errorMessage }) => {
  const [showOtherInput, setShowOtherInput] = useState(false);

  const handleRadioChange = (event) => {
    const { value } = event.target;
    setShowOtherInput(value === 'other' && showOther); 
    onChange(event);
  };

  return (
    <div>
      <span className="text-sm text-gray-600 font-bold">{label}</span>
      <div className="mt-2 flex flex-col">
        {options.map((option) => (
          <label key={option.value} className="flex items-center my-2">
            <input
              type="radio"
              className="form-radio"
              name={name}
              value={option.value  || ''}
              checked={value === option.value}
              onChange={handleRadioChange}
            />
            <span className="ml-2">{option.label}</span>
          </label>
        ))}
        {showOther && ( 
          <label className="flex items-center my-2">
            <input
              type="radio"
              className="form-radio"
              name={name}
              value="other"
              checked={value === 'other'}
              onChange={handleRadioChange}
            />
            <span className="ml-2">Alta</span>
            {showOtherInput && (
              <input
                type="text"
                name="other"
                value={otherValue || ''}
                onChange={onOtherChange}
                placeholder="Specificați alta"
                className="border-2 border-gray-200 rounded px-2"
              />
            )}
          </label>
        )}
      </div>
      {errorMessage && (
      <p className="text-red-500 text-xs italic">{errorMessage}</p>
    )}
    </div>
  );
};

RadioInputField.defaultProps = {
  showOther: true
};

export default RadioInputField;
