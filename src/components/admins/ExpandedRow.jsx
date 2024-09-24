import React, { useState } from "react";
import FormButton from "../auth/FormButton";

const ExpandedRow = ({
  row,
  columns,
  handleMoreInfo,
  isSuperAdmin,
  updateUser,
  deleteUser,
}) => {
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
        <div className="max-w-sm">
          <div className="flex place-content-between">
            <h2 className="text-xl font-bold">Detalii: {row.original.name}</h2>
            {isSuperAdmin && (
              <FormButton
                onClick={() => deleteUser(row.original.uid)}
                action="delete"
              >
                Şterge
              </FormButton>
            )}
          </div>
          {row.original.imageUrl && (
            <img
              src={row.original.imageUrl}
              alt="User"
              style={{ height: "70px" }}
            />
          )}
          <div className="w-full">
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
          <div className="mt-4 flex justify-end">
            {editingRowId === row.original.uid ? (
              <FormButton
                onClick={() => {
                  updateUser(editedUser);
                  setEditingRowId(null);
                }}
                action="submit"
              >
                Save
              </FormButton>
            ) : (
              <FormButton
                onClick={() => setEditingRowId(row.original.uid)}
                action="next"
              >
                Edit
              </FormButton>
            )}
            <FormButton
              onClick={handleMoreInfo}
              action="back"
              extraStyles="ml-4"
            >
              Close
            </FormButton>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default ExpandedRow;
