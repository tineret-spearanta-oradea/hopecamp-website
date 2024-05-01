import React, { useState } from "react";
import { contactInfo } from "../../../models/Options";

const PendingUser = ({ userData }) => {
  return (
    <div>
      <p className="mt-4">✅ Am primit datele tale de înregistrare.</p>
      <p className="mt-4">
        📲 Vei primi un mesaj pe Whatsapp la numǎrul tǎu {userData.phone} cu{" "}
        <strong>confirmarea</strong> din partea noastra. Atunci vei avea acces
        şi la <strong>contul tau</strong>.
      </p>
      <p className="mt-4">
        👤 Dacǎ sunt probleme poți lua legatura cu noi la numarul de telefon{" "}
        {contactInfo.phone}
      </p>
    </div>
  );
};

export default PendingUser;
