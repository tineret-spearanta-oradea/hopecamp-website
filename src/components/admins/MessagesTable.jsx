import React, { useState, useEffect, useMemo, useRef } from "react";
import { useTable, useSortBy, useFilters } from "react-table";
import { getAllMessages } from "../../firebase/database";
import LoadingIcon from "../LoadingIcon";
import TableRow from "./TableRow";
import ErrorAlert from "../ErrorAlert";
import FilterTable from "./FilterTable";

const MessagesTable = () => {
  const [messagesData, setMessagesData] = useState([]);
  const [messageList, setMessageList] = useState([]);
  const [filteredMessageList, setFilteredMessageList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorAlertMessages, setErrorAlertMessages] = useState([]);
  const selectedRowRef = useRef(null);
  const [, updateState] = useState();
  const forceRender = React.useCallback(() => updateState({}), []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await getAllMessages();
        setMessagesData(response);
      } catch (error) {
        setErrorAlertMessages((prevMessages) => [
          ...prevMessages,
          "Eroare la actualizarea datelor: " + error,
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleRefreshTable = async () => {
    setIsLoading(true);
    setFilteredMessageList([]);
    const allMessageData = await getAllMessages();
    setMessageList(allMessageData);
    setFilteredMessageList(allMessageData);
    setIsLoading(false);
  };

  const handleDownloadTableAsCsv = () => {
    //TODO: Implement this feature
    // alert("This feature is not implemented yet.");

    const titleKeys = columns
      //if there are more columns that should not be included in the csv, add a isExportable property in the columns object
      .filter((property) => property.Header !== "Id")
      .map((property) => property.accessor);
    const refinedData = [];
    refinedData.push(titleKeys);
    messageList.forEach((item) => {
      const rowData = titleKeys.map((key) => item[key]);
      refinedData.push(rowData);
    });

    let csvContent = "";
    refinedData.forEach((row) => {
      csvContent +=
        row
          .map((value) => {
            if (typeof value === "string") {
              return value.replace(",", "");
            } else {
              return value;
            }
          })
          .join(",") + "\n";
    });

    const now = new Date();
    const filename = `Mesaje_HC_${now.getDay()}-${now.getMonth()}-${now.getFullYear()}_${now.getHours()}-${now.getMinutes()}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, filename);
    } else {
      var link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "Nume",
        accessor: "userName",
        isFilterable: true,
      },
      {
        Header: "Telefon",
        accessor: "phone",
        isFilterable: true,
      },
      {
        Header: "Mesaj",
        accessor: "content",
        isFilterable: true,
      },
      {
        Header: "Data",
        accessor: "sentDate",
        Cell: ({ value }) => new Date(value).toLocaleDateString(),
        isFilterable: true,
      },
      {
        Header: "Citit",
        accessor: "isRead",
        Cell: ({ value }) => (value ? "Citit" : "Necitit"),
        isFilterable: true,
      },
      {
        Header: "More",
        Cell: ({ row }) => (
          <button onClick={() => handleMoreInfo(row)}>🔽</button>
        ),
      },
    ],
    []
  );

  const handleCloseAlert = () => {
    setErrorAlertMessages([]);
  };

  const handleMoreInfo = (row) => {
    if (
      row.original === undefined ||
      selectedRowRef.current === row.original.uid
    ) {
      selectedRowRef.current = null;
    } else {
      selectedRowRef.current = row.original.uid;
    }
    forceRender();
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data: messagesData,
      },
      useFilters,
      useSortBy
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
          <h1 className="text-3xl font-bold mb-4 mx-4">Lista mesajelor</h1>
        </div>
        <div className="mb-4 mx-4 flex items-center justify-center">
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
        </div>
      </div>
      {isLoading && <LoadingIcon />}
      <div className="flex place-items-center">
        <FilterTable
          properties={columns.filter((property) => property.isFilterable)}
          operators={["="]}
          unfilteredData={messageList}
          setData={setFilteredMessageList}
        />
      </div>
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
                          ? " ▼"
                          : " ▲"
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
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <TableRow
                  key={row.id}
                  row={row}
                  i={i}
                  prepareRow={prepareRow}
                  selectedRowRef={selectedRowRef}
                  handleMoreInfo={handleMoreInfo}
                  columns={columns}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default MessagesTable;
