import React, { useState } from "react";

const ExpandedRow = ({ row, columns, setSelectedRow, updateUser }) => {
  const [editingRowId, setEditingRowId] = useState(null);
  const [editedUser, setEditedUser] = useState({ ...row.original });

  const handleInputChange = (e) => {
    var value;
    if (e.target.type === "checkbox") {
      value = e.target.checked;
    } else {
      value = e.target.value;
    }
    setEditedUser({ ...editedUser, [e.target.name]: value });
  };

  return (
    <tr className="bg-gray-300">
      <td colSpan={columns.length} className="px-6 py-4 whitespace-nowrap">
        <h2 className="text-lg font-bold">Detalii: {row.original.name}</h2>
        {row.original.imageUrl && (
          <img
            src={row.original.imageUrl}
            alt="User"
            style={{ height: "70px" }}
          />
        )}
        <div className=" max-w-xl">
          {columns.map((column, index) => {
            if (column.isExpandable) {
              return (
                <div key={column.accessor}>
                  <div className="flex justify-between my-1 ">
                    <div className="w-1/2 py-1 pr-2 border-r flex items-center">
                      <label>{column.Header}</label>
                    </div>
                    <div className="w-1/2 pl-2">
                      {editingRowId === row.original.uid &&
                      column.isEditable ? (
                        <input
                          type={
                            row.original[column.accessor] === true ||
                            row.original[column.accessor] === false
                              ? "checkbox"
                              : "text"
                          }
                          name={column.accessor}
                          defaultValue={row.original[column.accessor]}
                          defaultChecked={row.original[column.accessor]}
                          onChange={handleInputChange}
                          className="border p-1 rounded "
                        />
                      ) : (
                        <p>
                          {row.original[column.accessor] === true
                            ? "✅"
                            : row.original[column.accessor] === false
                            ? "❌"
                            : row.original[column.accessor]}
                        </p>
                      )}
                    </div>
                  </div>
                  {index < columns.length - 1 && <hr className="my-1" />}
                </div>
              );
            }
          })}
        </div>
        <div className="mt-4">
          {editingRowId === row.original.uid ? (
            <button
              onClick={() => {
                updateUser(editedUser);
                setEditingRowId(null);
              }}
              className="mr-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setEditingRowId(row.original.uid)}
              className="mr-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-400 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Edit
            </button>
          )}
          <button
            onClick={() => setSelectedRow(null)}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Close
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ExpandedRow;
