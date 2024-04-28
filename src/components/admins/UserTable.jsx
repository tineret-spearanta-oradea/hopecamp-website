import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy, useFilters } from "react-table";
import classNames from "classnames";
import { getAllUsers } from "../../firebase/database";
import { sumToPay } from "../../models/Options";
import TableRow from "./TableRow";
import { updateUserData } from "../../firebase/database";

const UserTable = () => {
  const [userList, setUserList] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editingRowId, setEditingRowId] = useState(null);

  const updateUser = async (updatedUser) => {
    try {
      await updateUserData(updatedUser);
      setUserList((prevUserList) => {
        return prevUserList.map((user) =>
          user.uid === updatedUser.uid ? updatedUser : user
        );
      });
    } catch (error) {
      //TODO: show UI component error
      console.error(error);
    }
  };

  // fetch data from database
  useEffect(() => {
    async function fetchData() {
      const allUsersData = await getAllUsers();
      setUserList(allUsersData);
    }
    fetchData();
  }, []);

  const handleMoreInfo = (row) => {
    setSelectedRow(row.original.uid);
  };

  const handleDownloadTableAsCsv = () => {
    //TODO: Implement this feature
    alert("This feature is not implemented yet.");
    // const csv = userList.map((user) => {
    //   return Object.values(user).join(",");
    // });
    // const csvString = csv.join("\n");
    // const blob = new Blob([csvString], { type: "text/csv" });
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement("a");
    // a.href = url;
    // a.download = "users.csv";
    // a.click();
    // URL.revokeObjectURL(url);
  };

  // These are different than UserData.
  // This is because, when we add for example a new property in the UserData,
  // we need to explictily say where this value will be shown in the users list.
  // I could maybe extract this in another file
  const userProperties = useMemo(
    () => [
      {
        Header: "Id",
        accessor: (row) => row.index + 1,
        Cell: ({ row }) => row.index + 1,
        width: 35,
      },
      {
        Header: "User ID",
        accessor: "uid",
        width: 0,
        isHidden: true,
        isExpandable: true,
      },
      {
        Header: "Email",
        accessor: "email",
        width: 0,
        isHidden: true,
        isExpandable: true,
      },
      {
        Header: "Nume",
        accessor: "name",
        width: 125,
        Cell: ({ value, row }) => (
          <span
            className={classNames({
              "text-green-500": row.original.isAdmin,
            })}
          >
            {value}
          </span>
        ),
        isEditable: true,
        isExpandable: true,
      },
      {
        Header: "Confirmat",
        accessor: "isConfirmed",
        width: 85,
        Cell: ({ value }) => (value ? "Da" : "Nu"),
        isEditable: true,
        isExpandable: true,
      },
      {
        Header: "Are membru de familie in tabara",
        accessor: "withFamilyMember",
        width: 0,
        // Cell: ({ value }) => (value ? "Da" : "Nu"),
        isHidden: true,
        isEditable: true,
        isExpandable: true,
      },
      {
        Header: "Este admin",
        accessor: "isAdmin",
        width: 0,
        // Cell: ({ value }) => (value ? "Da" : "Nu"),
        isHidden: true,
        isExpandable: true,
      },
      {
        Header: "Ani",
        accessor: "age",
        width: 40,
        Cell: ({ value }) => (
          <span
            className={classNames({
              "text-purple-700": value < 18,
            })}
          >
            {value}
          </span>
        ),
        isEditable: true,
        isExpandable: true,
      },
      {
        Header: "Telefon",
        accessor: "phone",
        width: 125,
        isEditable: true,
        isExpandable: true,
      },
      {
        Header: "Biserică",
        accessor: "church",
        width: 125,
        isEditable: true,
        isExpandable: true,
      },
      {
        Header: "Casier",
        accessor: "payTaxTo",
        width: 75,
        isEditable: true,
        isExpandable: true,
      },
      {
        Header: "Plătit",
        accessor: "amountPaid",
        width: 75,
        isEditable: true,
        isExpandable: true,
        Cell: ({ value, row }) => (
          <span
            className={classNames({
              // In case the user has a family member, but we did not update this in the database
              // It would be more correct to get the lowest value from the sumToPay object,
              // but it's fine for now. I don't think we'll have more exceptional cases.
              "text-green-500":
                value >= sumToPay.withFamilyMember &&
                row.original.withFamilyMember === false,
              // Both cases, how it should be, when the user payed
              "text-emerald-600":
                value >= sumToPay.normal ||
                (value >= sumToPay.withFamilyMember &&
                  row.original.withFamilyMember),
              // Case where user payed less than the sum (deposit payment):
              "text-yellow-500": value > 0 && value < sumToPay.withFamilyMember,
              // Case where user didn't pay anything
              "text-red-500": value === 0,
            })}
          >
            {value}
          </span>
        ),
      },
      {
        Header: "Ziua in care vine in tabara",
        accessor: "startDate",
        width: 0,
        isHidden: true,
        isExpandable: true,
      },
      {
        Header: "Ziua in care vine in tabara",
        accessor: "endDate",
        width: 0,
        isHidden: true,
        isExpandable: true,
      },
      {
        Header: "Zile",
        accessor: "numberOfDays",
        width: 50,
        isExpandable: true,
      },
      {
        Header: "Transport",
        accessor: "transport",
        width: 100,
        isEditable: true,
        isExpandable: true,
      },
      {
        Header: "Preferinte cazare",
        accessor: "preferences",
        width: 0,
        isHidden: true,
        isEditable: true,
        isExpandable: true,
      },
      {
        Header: "Data inscrierii",
        accessor: "signupDate",
        width: 0,
        isHidden: true,
        isExpandable: true,
      },
      {
        Header: "More",
        width: 50,
        Cell: ({ row }) => (
          <button onClick={() => handleMoreInfo(row)}>▼</button>
        ),
      },
    ],
    []
  );

  const visibleColumns = React.useMemo(
    () => userProperties.filter((column) => !column.isHidden),
    [userProperties]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns: visibleColumns,
        data: userList,
        initialState: { sortBy: [{ id: "id", desc: true }] },
      },
      useFilters,
      useSortBy
    );
  return (
    <div className="">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-4 mx-4">Lista participanților</h1>
        <div className="mb-4 mx-4">
          <button
            className="p-2 bg-cyan-500 text-white rounded-full flex items-center"
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
      <div className="overflow-x-auto max-w-full">
        <table
          {...getTableProps()}
          className="w-full divide-y divide-gray-200 rounded border border-gray-300"
        >
          <colgroup>
            {visibleColumns.map((column, index) => (
              <col
                key={index}
                //style={{ maxWidth: column.width }} //this doesn't work
              />
            ))}
          </colgroup>
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
              return (
                <TableRow
                  row={row}
                  i={i}
                  prepareRow={prepareRow}
                  selectedRow={selectedRow}
                  setSelectedRow={setSelectedRow}
                  columns={userProperties}
                  updateUser={updateUser}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
