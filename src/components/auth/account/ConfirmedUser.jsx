import React, { useState, useEffect } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { writeMessageData, getMessageData } from "../../../firebase/database";
import MessageData from "../../../models/MessageData";

const ConfirmedUser = ({ userData }) => {
  const navigate = useNavigate();
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    const fetchMessage = async () => {
      const messageData = await getMessageData(userData.uid);
      if (messageData) {
        setMessageText(messageData.text);
      }
    };

    fetchMessage();
  }, [userData.uid]);

  const navigateToAdminsDashboard = () => {
    navigate("/admins");
  };

  const getRemainingDays = () => {
    const today = new Date();
    //TODO: *kind of optional* add this date to an env or settings file?
    const campDate = new Date("2024-07-20");
    const timeDifference = campDate - today;
    const timeDifferenceInDays = Math.ceil(
      timeDifference / (1000 * 60 * 60 * 24)
    );
    return timeDifferenceInDays;
  };

  const handleMessageSend = async () => {
    const messageText = document.querySelector("textarea").value;
    const messageData = new MessageData(userData.uid, messageText);
    await writeMessageData(messageData);
  };

  return (
    <div className="mt-2">
      {userData.isAdmin && (
        //TODO: extract this in a component?
        <div className="text-center">
          <button
            onClick={navigateToAdminsDashboard}
            className="w-60 py-1 px-4 bg-green-500 text-white rounded-md"
          >
            ADMINS DASHBOARD
          </button>
        </div>
      )}
      <p>
        Ne bucurăm că ai ales să vii cu noi in tabără! Au mai ramas{" "}
        {getRemainingDays()} zile până la tabară! (Yayy🎉)
      </p>
      <p>
        Între timp, dacă vrei, ne poți lăsa aici un gând sau o sugestie
        referitoare la tabără:
      </p>
      {/* TODO: implement the submission of this form in a new table called "messages" that contains the user id, name, phone, and message */}
      {messageText ? (
        <textarea
          className="w-full h-24 p-2 mt-2 border rounded-md resize-none"
          placeholder={messageText}
          disabled
        ></textarea>
      ) : (
        <textarea
          className="w-full h-24 p-2 mt-2 border rounded-md resize-none"
          placeholder="Gând sau sugestie... (opțional)"
        ></textarea>
      )}

      <div className="text-right">
        {messageText ? (
          <button
            onClick={handleMessageSend}
            className="m-2 py-1 px-4 bg-gray-500 text-white rounded-md"
            disabled
          >
            Ai trimis deja
          </button>
        ) : (
          <button
            onClick={handleMessageSend}
            className="m-2 py-1 px-4 bg-blue-500 text-white rounded-md"
          >
            Trimite mesaj
          </button>
        )}
      </div>
      <p>
        De asemenea poți da click mai jos pentru a vedea datele cu care te-ai
        înscris in tabără. Dacă ai greșit ceva și dorești să modifici scrie-ne
        folosind câmpul și butonul de mai sus.
      </p>
      {/* TODO: implement the expandable data field or maybe a popup that contains the data? */}
      <div className="text-center">
        <button className="mt-2 py-1 px-4 bg-gray-300 text-white rounded-md">
          Vezi datele...
        </button>
      </div>
    </div>
  );
};

export default ConfirmedUser;
