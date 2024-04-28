import React, { useMemo, useState, useEffect } from "react";
import ExpandedRow from "./ExpandedRow";

const TableRow = ({
  row,
  i,
  prepareRow,
  selectedRow,
  setSelectedRow,
  columns,
  updateUser,
}) => {
  prepareRow(row);
  return (
    <>
      <tr
        {...row.getRowProps()}
        key={row.index}
        className={
          i % 2 === 0
            ? "bg-white hover:bg-gray-100"
            : "bg-gray-50 hover:bg-gray-100"
        }
      >
        {row.cells.map((cell) => (
          <td {...cell.getCellProps()} className="px-6 py-4 whitespace-nowrap">
            {cell.render("Cell")}
          </td>
        ))}
      </tr>
      {selectedRow === row.original.uid && (
        <ExpandedRow
          row={row}
          columns={columns}
          setSelectedRow={setSelectedRow}
          updateUser={updateUser}
        />
      )}
    </>
  );
};

export default TableRow;
