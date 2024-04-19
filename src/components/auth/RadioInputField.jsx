import React from 'react';

const RadioInputField = ({ label, name, options, value, onChange }) => {
  return (
    <div>
      <span className="text-gray-700">{label}</span>
      <div className="mt-2">
        {options.map((option) => (
          <label key={option.value} className="inline-flex items-center ml-6">
            <input
              type="radio"
              className="form-radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
            />
            <span className="ml-2">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioInputField;
