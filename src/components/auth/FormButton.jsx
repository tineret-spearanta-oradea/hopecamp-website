import React from "react";

const FormButton = ({
  children,
  onClick,
  disabled = false,
  action,
  extraStyles = "",
}) => {
  let buttonColor = "gray-700";
  let textColor = "text-white";
  if (disabled === false) {
    if (action === "submit") {
      buttonColor = "bg-hope-darkcyan";
      textColor = "text-hope-beige";
    } else if (action === "next") {
      buttonColor = "bg-hope-darkcyan";
    } else if (action === "back") {
      buttonColor = "bg-gray-400";
    } else if (action === "delete") {
      buttonColor = "bg-red-400";
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${buttonColor} ${textColor} px-4 py-2 rounded-lg border shadow-lg uppercase text-sm
      hover:bg-gray-800 hover:shadow-xl
      transition duration-300 ${extraStyles}`}
    >
      {children}
    </button>
  );
};

export default FormButton;
