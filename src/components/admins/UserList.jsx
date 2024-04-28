import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy, useFilters } from "react-table";
import classNames from "classnames";
import { getAllUsers } from "../../firebase/database";
import { sumToPay } from "../../models/Options";
import TableRow from "./TableRow";
import { updateUserData } from "../../firebase/database";

const UserListSection = () => {
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
      },
      useFilters,
      useSortBy
    );
  return (
    <div className="overflow-x-auto max-w-full">
      <table
        {...getTableProps()}
        className="w-full table-fixed divide-y divide-gray-200"
      >
        <colgroup>
          {visibleColumns.map((column, index) => (
            <col key={index} style={{ width: column.width }} />
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
                    {column.isSorted ? (column.isSortedDesc ? " ▼" : " ▲") : ""}
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
          {rows.map((row, i) => (
            <TableRow
              row={row}
              i={i}
              prepareRow={prepareRow}
              selectedRow={selectedRow}
              setSelectedRow={setSelectedRow}
              columns={userProperties}
              updateUser={updateUser}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserListSection;
