import React, { useState, useEffect } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { writeMessageData, getMessageData } from "../../../firebase/database";
import MessageData from "../../../models/MessageData";
import { contactInfo, dateRange, pages, MaxMessageLength } from "../../../constants";
import FormButton from "../FormButton";


const ConfirmedUser = ({ userData }) => {
  const navigate = useNavigate();
  const [messageText, setMessageText] = useState("");
  const [isOpenDetails, setIsOpenDetails] = useState(false);
  const [messageError, setMessageError] = useState("");

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
    const campDate = dateRange.startDate;
    const timeDifference = campDate - today;
    const timeDifferenceInDays = Math.ceil(
      timeDifference / (1000 * 60 * 60 * 24)
    );
    return timeDifferenceInDays;
  };

  const handleMessageSend = async () => {
    if (messageText.length > MaxMessageLength) {
      setMessageError(`Mesajul nu poate depăși ${MaxMessageLength} caractere.`);
      return;
    }
    setMessageError(""); // Clear previous error messages
    const messageData = new MessageData(userData.uid, messageText);
    await writeMessageData(messageData);
    setMessageText(messageText);
  };

  return (
    <div className="mt-2 space-y-2">
      {userData.isAdmin && (
        <div className="text-center">
          <FormButton action="submit" onClick={navigateToAdminsDashboard}>
            ADMINS DASHBOARD
          </FormButton>
        </div>
      )}
      <p>
        🗓️ Ne bucurăm că ai ales să vii cu noi in tabără! Au mai ramas{" "}
        {getRemainingDays()} zile până la tabară, abia aşteptăm!
      </p>
      <p>
        💭Între timp, dacă vrei, ne poți lăsa aici un gând sau o sugestie
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
          <FormButton action="submit" disabled>
            Ai trimis deja 🔒
          </FormButton>
        ) : (
          <FormButton
            action="submit"
            onClick={handleMessageSend}
            extraStyles="mb-2"
          >
            Trimite mesaj
          </FormButton>
        )}
      </div>
      <p>
        📝 Mai jos poți să vezi datele cu care te-ai înscris in tabără. Daca
        doreşti să le modifici scrie-ne folosind câmpul și butonul de mai sus,
        sau pe WhatsApp la {contactInfo.phone}.
      </p>
      <div className="text-center">
        <FormButton action="back" onClick={seeMyDetails} extraStyles="mt-2">
          {isOpenDetails ? "Ascunde 🔼" : "Vezi datele tale 🔽 "}
        </FormButton>
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
            <span className="font-bold">Plătit:</span> {userData.amountPaid} RON
          </p>
          <p>
            <span className="font-bold">Cui achit taxa:</span>{" "}
            {userData.payTaxTo}
          </p>
          <p>
            <span className="font-bold">Transport:</span> {userData.transport}
          </p>
          <p>
            <span className="font-bold">Perioada in care eşti în tabără:</span>{" "}
          </p>
          <p>
            {userData.startDate} - {userData.endDate}
          </p>
          <p>
            <span className="font-bold">Preferințe cazare:</span>{" "}
            {userData.preferences || "nicio preferință"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ConfirmedUser;
