import React, { useState } from "react";

const PendingUser = ({ userData }) => {
  return (
    <div>
      <p className="mt-4">
        ✅ Vei primi un mesaj pe Whatsapp pe numarul de tau {userData.phone} cu
        confirmarea din partea noastra.
      </p>
      <p className="mt-4">📲 Atunci vei avea acces si la contul tau.</p>
      <p className="mt-4">
        👤 Pana atunci poti lua legatura cu noi la numarul de telefon 0000 000
        000
      </p>
    </div>
  );
};

export default PendingUser;
