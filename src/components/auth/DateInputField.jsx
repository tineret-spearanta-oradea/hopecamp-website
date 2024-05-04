import React from "react";
import { DateRangePicker } from "rsuite";
import "rsuite/DateRangePicker/styles/index.css"; //this causes an error, but the component works
import { dateRange } from "../../constants";

const DateInputField = ({
  label,
  name,
  startDateValue,
  endDateValue,
  onChange,
  validationErrorMessage,
}) => {
  const { combine, allowedRange, beforeToday } = DateRangePicker;
  const minDate = dateRange.startDate;
  const maxDate = dateRange.endDate;

  const handleChange = (dates) => {
    if (dates == null) {
      onChange({ name: "startDate", value: null });
      onChange({ name: "endDate", value: null });
    } else {
      onChange({ name: "startDate", value: dates[0] });
      onChange({ name: "endDate", value: dates[1] });
    }
  };

  return (
    <div>
      <label className="text-sm text-gray-600 font-bold">{label}</label>
      <DateRangePicker
        showOneCalendar
        block
        format="dd.MM.yyyy"
        defaultValue={[startDateValue, endDateValue]}
        defaultCalendarValue={[startDateValue, endDateValue]}
        shouldDisableDate={allowedRange(minDate, maxDate)}
        onChange={handleChange}
      />
      {validationErrorMessage && (
        <p className="text-red-500 text-xs italic">{validationErrorMessage}</p>
      )}
    </div>
  );
};

export default DateInputField;
