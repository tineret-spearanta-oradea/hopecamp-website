import React, { useMemo } from "react";
import { useTable, useSortBy, useFilters } from "react-table";
import classNames from "classnames";

const UserListSection = ({ userList }) => {
  const columns = useMemo(
    () => [
      {
        Header: "Index",
        accessor: (_, index) => index + 1,
      },
      {
        Header: "Name",
        accessor: "fullName",
        Cell: ({ value, row }) => (
          <span
            className={classNames({
              "text-blue-500": row.original.isAdmin,
            })}
          >
            {value}
          </span>
        ),
      },
      {
        Header: "Age",
        accessor: "age",
        Cell: ({ value }) => (
          <span
            className={classNames({
              "text-red-500": value < 18,
            })}
          >
            {value}
          </span>
        ),
      },
      {
        Header: "Phone",
        accessor: "phone",
      },
      {
        Header: "Church",
        accessor: "church",
      },
      {
        Header: "PayTaxTo",
        accessor: "payTaxTo",
      },
      {
        Header: "AmountPaid",
        accessor: "amountPaid",
      },
      {
        Header: "numberOfDays",
        accessor: "numberOfDays",
      },
      {
        Header: "Transport",
        accessor: "transport",
      },
      {
        Header: "IsConfirmed",
        accessor: "isConfirmed",
        Cell: ({ value }) => (value ? "Yes" : "No"),
      },
      {
        Header: "More Info",
        Cell: ({ row }) => (
          <button onClick={() => handleMoreInfo(row)}>More Info</button>
        ),
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data: userList,
      },
      useFilters,
      useSortBy
    );

  return (
    <div className="overflow-x-auto max-w-full">
      <table
        {...getTableProps()}
        className="w-full table-fixed"
        // style={{ height: "500px" }} // Set a fixed height for the table
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="px-4 py-2"
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} className="px-4 py-2">
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserListSection;
