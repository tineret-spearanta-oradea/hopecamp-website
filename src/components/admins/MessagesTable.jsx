import React, { useState, useEffect, useMemo } from "react";
import { getAllMessages } from "../../firebase/database";
import LoadingIcon from "../LoadingIcon";
import { useTable, useFilters, useSortBy } from "react-table";
import TableRow from "./TableRow";
import ErrorAlert from "../ErrorAlert";

//TODO: This should look similar to the UserTable component. Please adapt it accordingly.
// the columns should be:  Nume, Telefon, Mesaj, Data, Citit

const MessagesTable = () => {
  const [messagesData, setMessagesData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await getAllMessages();
      setMessagesData(response);
      setLoading(false);
    };

    fetchMessages();
  }, []);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data: messagesData || [],
      },
      useFilters,
      useSortBy
    );

  const columns = useMemo(
    () => [
      {
        Header: "Nume",
        accessor: "userName",
      },
      {
        Header: "Telefon",
        accessor: "phone",
      },
      {
        Header: "Mesaj",
        accessor: "content",
      },
      {
        Header: "Data",
        accessor: "sentDate",
        Cell: ({ value }) => new Date(value).toLocaleDateString(),
      },
      {
        Header: "Citit",
        accessor: "isRead",
        Cell: ({ value }) => (value ? "Citit" : "Necitit"),
      },
    ],
    []
  );

  return (
    <div className="">
      {errorAlertMessages && (
        <ErrorAlert
          messages={errorAlertMessages}
          displayMode={"popup"}
          handleClose={handleCloseAlert}
        />
      )}
      <div className="flex justify-between items-center">
        <div className="flex items-center justify-center">
          <h1 className="text-3xl font-bold mb-4 mx-4">
            Lista participanților
          </h1>
        </div>
        {/* <div className="mb-4 mx-4 flex items-center justify-center">
          <button
            className="text-violet-500 rounded-full flex items-center m-4"
            onClick={handleRefreshTable}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="bi bi-arrow-clockwise"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"
              />
              <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
            </svg>
          </button>

          <button
            className="p-2 bg-hope-lightcyan text-white rounded-full flex items-center"
            onClick={handleDownloadTableAsCsv}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span className="text-xs">.csv</span>
          </button>
        </div> */}
      </div>
      {isLoading && <LoadingIcon />}
      {/* <div className="flex place-items-center">
        <FilterTable
          properties={userProperties.filter(
            (property) => property.isFilterable
          )}
          operators={["="]}
          unfilteredData={userList}
          setData={setFilteredUserList}
        />
      </div> */}
      <div className="overflow-x-auto max-w-full">
        <table
          {...getTableProps()}
          className="w-full divide-y divide-gray-200 rounded border border-gray-300"
        >
          {/* <colgroup>
            {visibleColumns.map((column, index) => (
              <col
                key={index}
                //style={{ maxWidth: column.width }} //this doesn't work
              />
            ))}
          </colgroup> */}
          <thead className="bg-gray-50">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
          <tbody
            {...getTableBodyProps()}
            className="bg-white divide-y divide-gray-200"
          >
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  className="bg-gray-100 border-b border-gray-200"
                >
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} className="py-2 px-4">
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}

            {/* {rows.map((row, i) => {
              return (
                <TableRow
                  key={row.id}
                  row={row}
                  i={i}
                  {message.userName}
                  {message.phone}
                  {message.content}
                  {new Date(message.sentDate).toLocaleDateString()}
                  {message.isRead ? 'Citit' : 'Necitit'}
                />
              );
            })} */}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default MessagesTable;
