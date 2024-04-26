import React from 'react';

const DateInputField = ({
  label,
  name,
  value,
  onChange,
  minDate,
  maxDate,
}) => (
  <div>
    <label className="text-sm text-gray-600 font-bold">{label}</label>
    <input
      className="mt-1 block w-full px-3 py-2 bg-white border shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      type="date"
      name={name}
     // value={value}
      onChange={onChange}
      min={minDate}
      max={maxDate}
    />
  </div>
);

export default DateInputField;
