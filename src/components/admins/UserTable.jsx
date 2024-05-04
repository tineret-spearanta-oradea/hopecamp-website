import React, { useMemo, useState, useEffect, useRef } from "react";
import { useTable, useSortBy, useFilters } from "react-table";
import classNames from "classnames";
import { getAllUsers } from "../../firebase/database";
import { sumToPay } from "../../constants";
import TableRow from "./TableRow";
import { updateUserData } from "../../firebase/database";
import LoadingIcon from "../LoadingIcon";
import { deleteUserFromSystem } from "../../firebase";

const UserTable = (loggedInUserData) => {
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [userList, setUserList] = useState([]);
  const [filteredUserList, setFilteredUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const selectedRowRef = useRef(null);
  const [filterValue, setFilterValue] = useState(""); // Added state for filter input

  // i use this method because the table doesn't rerender when i change the selectedRowRef.current
  // if i used useRef for the selectedRow, it would have rerendered, but i would have lost the selectedRowRef.current value, since it only updates after a rerender
  // maybe there is a better way to do this, but i don't have time to look for it. If you know a better way, please update this code.
  const [, updateState] = useState();
  const forceRender = React.useCallback(() => updateState({}), []);

  const updateUser = async (updatedUser) => {
    //TODO: Add a confirmation dialog/modal
    if (
      confirm("Sigur dorești să actualizezi datele utilizatorului?") === false
    ) {
      return;
    }

    try {
      await updateUserData(updatedUser);
      setFilteredUserList((prevUserList) => {
        return prevUserList.map((user) =>
          user.uid === updatedUser.uid ? updatedUser : user
        );
      });
    } catch (error) {
      //TODO: show UI component error
      alert(error);
    }
  };

  const deleteUser = async (uid) => {
    //TODO: Add a confirmation dialog/modal
    if (confirm("Sigur dorești să STERGI utilizatorul?") === false) {
      return;
    }

    try {
      await deleteUserFromSystem(uid);
      setFilteredUserList((prevUserList) => {
        return prevUserList.filter((user) => user.uid !== uid);
      });
    } catch (error) {
      //TODO: show UI component error
      alert(error);
    }
  };

  // fetch data from database
  useEffect(() => {
    async function fetchData() {
      const allUsersData = await getAllUsers();
      setUserList(allUsersData);
      setFilteredUserList(allUsersData);
      setIsLoading(false);
      if (
        loggedInUserData.loggedInUserData.isSuperAdmin &&
        loggedInUserData.loggedInUserData.isSuperAdmin === true
      ) {
        setIsSuperAdmin(true);
      }
    }
    fetchData();
  }, []);

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

  // Added function to handle filter input change
  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
    setFilteredUserList(
      userList.filter((user) =>
        user.name.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  const handleDownloadTableAsCsv = () => {
    //TODO: Implement this feature
    // alert("This feature is not implemented yet.");

    const titleKeys = userProperties
      //if there are more columns that should not be included in the csv, add a isExportable property in the userProperties object
      .filter((property) => property.Header !== "Id")
      .map((property) => property.accessor);
    const refinedData = [];
    refinedData.push(titleKeys);
    userList.forEach((item) => {
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
    const filename = `Participanti_HC_${now.getDay()}-${now.getMonth()}-${now.getFullYear()}_${now.getHours()}-${now.getMinutes()}`;
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

  // These are different than UserData model.
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
        Header: "Are familie in tabara",
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
        Header: "Vine in tabarǎ",
        accessor: "startDate",
        width: 0,
        isHidden: true,
        isExpandable: true,
      },
      {
        Header: "Pleacǎ din tabara",
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
          <button onClick={() => handleMoreInfo(row)}>🔽</button>
        ),
      },
    ],
    []
  );

  const visibleColumns = useMemo(
    () => userProperties.filter((column) => !column.isHidden),
    [userProperties]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns: visibleColumns,
        data: filteredUserList,
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
      <div className="w-100">
        {/* TODO: add filter text input */}{" "}
        <input
          type="text"
          className="w-60 px-2 py-1 border rounded-md m-2"
          value={filterValue}
          onChange={handleFilterChange}
          placeholder="Cautǎ după nume..."
        />
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
                  selectedRowRef={selectedRowRef}
                  handleMoreInfo={handleMoreInfo}
                  columns={userProperties}
                  isSuperAdmin={isSuperAdmin}
                  updateUser={updateUser}
                  deleteUser={deleteUser}
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
