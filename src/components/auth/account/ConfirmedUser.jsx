import React, { useState, useEffect } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { writeMessageData, getMessageData } from "../../../firebase/database";
import MessageData from "../../../models/MessageData";
import { contactInfo, dateRange, pages } from "../../../constants";

const ConfirmedUser = ({ userData }) => {
  const navigate = useNavigate();
  const [messageText, setMessageText] = useState("");
  const [isOpenDetails, setIsOpenDetails] = useState(false);

  const seeMyDetails = () => {
    setIsOpenDetails(!isOpenDetails);
  };

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
    navigate(pages.adminsDashboard);
  };

  const getRemainingDays = () => {
    const today = new Date();
    //TODO: *kind of optional* add this date to an env or settings file?
    const campDate = dateRange.startDate;
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
            Ai trimis deja 🔒
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
        📝 Mai jos poți sǎ vezi datele cu care te-ai înscris in tabără. Daca
        doreşti să le modifici scrie-ne folosind câmpul și butonul de mai sus,
        sau pe Whatsapp la {contactInfo.phone}.
      </p>
      {/* TODO: implement the expandable data field or maybe a popup that contains the data? */}
      <div className="text-center">
        <button
          onClick={seeMyDetails}
          className="mt-2 py-1 px-4 bg-gray-300 text-white rounded-md"
        >
          {isOpenDetails ? "Ascunde 🔼" : "Vezi datele tale 🔽"}
        </button>
      </div>
      {isOpenDetails && (
        <div>
          <h1 className="font-bold">Detalii - {userData.name}</h1>
          <p>
            <span className="font-bold">Nume:</span> {userData.name}
          </p>
          <p>
            <span className="font-bold">Email:</span> {userData.email}
          </p>
          <p>
            <span className="font-bold">Telefon:</span> {userData.phone}
          </p>
          <p>
            <span className="font-bold">Vârsta:</span> {userData.age}
          </p>
          <p>
            <span className="font-bold">Biserica:</span> {userData.church}
          </p>
          <p>
            <span className="font-bold">Plǎtit:</span> {userData.amountPaid} RON
          </p>
          <p>
            <span className="font-bold">Cui achit taxa:</span>{" "}
            {userData.payTaxTo}
          </p>
          <p>
            <span className="font-bold">Transport:</span> {userData.transport}
          </p>
          <p>
            <span className="font-bold">Perioada in care eşti în tabǎrǎ:</span>{" "}
          </p>
          <p>
            {userData.startDate} - {userData.endDate}
          </p>
          <p>
            <span className="font-bold">Preferințe:</span>{" "}
            {userData.preferences || "nicio preferință"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ConfirmedUser;
