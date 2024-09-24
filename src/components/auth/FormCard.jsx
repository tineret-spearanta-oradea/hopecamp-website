import React from "react";

const FormCard = ({ children }) => {
  return (
    <div
      className="bg-hope-lightcyan bg-fixed bg-cover bg-center bg-no-repeat w-full min-h-screen 
      flex place-content-center place-items-center overflow-y-auto"
      style={{
        backgroundImage: 'url("assets/images/bg-auth.png")',
      }}
    >
      <main className="w-full min-h-screen flex justify-center items-center">
        <div className="w-96 bg-white bg-opacity-90 text-gray-600 space-y-5 p-6 sm:p-8 shadow-xl border rounded-xl">
          {children}
        </div>
      </main>
    </div>
  );
};

export default FormCard;
