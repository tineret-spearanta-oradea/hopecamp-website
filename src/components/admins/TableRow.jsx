import React, { useMemo, useState, useEffect } from "react";
import ExpandedRow from "./ExpandedRow";

const TableRow = ({
  row,
  i,
  prepareRow,
  selectedRowRef,
  handleMoreInfo,
  columns,
  isSuperAdmin,
  updateUser,
  deleteUser,
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
      {selectedRowRef.current === row.original.uid && (
        <ExpandedRow
          row={row}
          columns={columns}
          selectedRowRef={selectedRowRef}
          handleMoreInfo={handleMoreInfo}
          isSuperAdmin={isSuperAdmin}
          updateUser={updateUser}
          deleteUser={deleteUser}
        />
      )}
    </>
  );
};

export default TableRow;
