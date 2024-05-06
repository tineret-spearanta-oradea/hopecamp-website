import React, { useState } from "react";

//TODO #80: Add multiple filter options
const FilterTable = ({ properties, operators = ["="], data, setData }) => {
  const [column, setColumn] = useState(properties[0].accessor);
  const [operator, setOperator] = useState(operators[0]);
  const [value, setValue] = useState("");
  const [createdFilters, setCreatedFilters] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState([]);

  const createFilter = () => {
    setCreatedFilters([
      ...createdFilters,
      {
        id: createdFilters.length,
        column: "",
        operator: "",
        value: "",
      },
    ]);
  };

  const handleColumnChange = (e) => {
    setColumn(e.target.value);
  };

  const handleOperatorChange = (e) => {
    setOperator(e.target.value);
  };

  const handleValueChange = (e) => {
    setValue(e.target.value);

    const filteredData = data.filter((row) => {
      return row[column].toLowerCase().includes(e.target.value.toLowerCase());
    });

    setData(filteredData);
  };

  const handleFilter = () => {
    // setAppliedFilters([
    //   ...appliedFilters,
    //   {
    //     column,
    //     operator,
    //     value,
    //   },
    // ]);
    // setCreatedFilters([]);

    const filteredData = data.filter((row) => {
      return row[column].toLowerCase().includes(value.toLowerCase());
    });

    setData(filteredData);
  };

  const handleRemoveCreatedFilter = () => {
    setCreatedFilters([]);
    setData(data);
  };

  const handleRemoveAppliedFilter = () => {
    setAppliedFilters([]);
    setData(data);
  };

  return (
    <div className="flex place-items-center m-2">
      {createdFilters.length === 0 && (
        <button onClick={() => createFilter()}>
          <div className="p-1 rounded-lg bg-blue-400 text-white w-8 h-8 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-search"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </svg>
          </div>
        </button>
      )}
      {appliedFilters.length > 0 ? (
        <div className="flex w-max bg-slate-300  border  p-1 rounded-lg ">
          <button
            onClick={handleRemoveAppliedFilter}
            className="p-1 rounded-lg flex items-center justify-center"
          >
            <svg
              alt="remove filter"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-x-lg"
              viewBox="0 0 16 16"
            >
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
            </svg>
          </button>

          {appliedFilters.map((filter) => (
            <div className="">
              <div key={filter.column}>
                {filter.column} {filter.operator} {filter.value}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {createdFilters.map((filter) => (
            <div
              className="bg-slate-300 border-slate-400
        inline-flex items-center space-x-1 rounded-lg border  h-full"
            >
              <button
                onClick={handleRemoveCreatedFilter}
                className="p-1 rounded-lg w-8 h-8 flex items-center justify-center"
              >
                <svg
                  alt="remove filter"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-x-lg"
                  viewBox="0 0 16 16"
                >
                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                </svg>
              </button>

              <select
                value={column}
                onChange={handleColumnChange}
                className="p-1 rounded-lg border bg-slate-200 h-8 flex items-center justify-center"
              >
                {properties.map((property) => (
                  <option key={property.Header} value={property.accessor}>
                    {property.Header}
                  </option>
                ))}
              </select>

              <select
                value={operator}
                onChange={handleOperatorChange}
                className="p-1 rounded-lg border bg-slate-200 h-8 flex items-center justify-center"
              >
                {operators.map((operator) => (
                  <option key={operator} value={operator}>
                    {operator}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={value}
                onChange={handleValueChange}
                className="p-1 rounded-lg border  bg-slate-200"
              />

              <button
                onClick={handleFilter}
                className="p-1 rounded-lg bg-blue-400 text-white w-8 h-8 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-search"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterTable;
