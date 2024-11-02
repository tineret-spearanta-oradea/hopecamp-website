import React, { useState, useEffect, useMemo } from "react";
import { getAllMessages } from "../../firebase/database";
import LoadingIcon from "../LoadingIcon";
import { useTable, useFilters, useSortBy } from "react-table";
import TableRow from "./TableRow";

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

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Mesaje</h1>
      <h2>(aceasta pagina este inca in lucru)</h2>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="w-6 h-6 border-2 border-t-0 border-gray-900 rounded-full animate-spin"></div>
        </div>
      ) : (
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Nume</th>
              <th className="px-4 py-2">Telefon</th>
              <th className="px-4 py-2">Mesaj</th>
              <th className="px-4 py-2">Data trimiterii</th>
              <th className="px-4 py-2">Citit</th>
            </tr>
          </thead>
          <tbody>
            {messagesData.map((message, index) => (
              <tr key={message.uid}>
                <td className="border px-4 py-2">{message.userName}</td>
                <td className="border px-4 py-2">{message.phone}</td>
                <td className="border px-4 py-2">{message.text}</td>
                <td className="border px-4 py-2">{message.sentDate}</td>
                <td className="border px-4 py-2">{message.isRead ? "da" : "nu"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MessagesTable;
