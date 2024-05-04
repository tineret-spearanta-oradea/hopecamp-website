import React from "react";

const FormButton = ({
  children,
  onClick,
  disabled = false,
  action,
  extraStyles = "",
}) => {
  let buttonColor = "gray-700";
  let textColor = "white";
  if (disabled === false) {
    if (action === "submit") {
      buttonColor = "hope-darkcyan";
      textColor = "hope-beige";
      // buttonColor = "indigo-600";
    } else if (action === "next") {
      buttonColor = "hope-darkcyan";
    } else if (action === "back") {
      buttonColor = "gray-400";
    } else if (action === "delete") {
      buttonColor = "red-400";
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-${buttonColor} text-${textColor} px-4 py-2 rounded-lg border shadow-lg uppercase text-sm
      hover:bg-gray-800 hover:shadow-xl
      transition duration-300 ${extraStyles}`}
    >
      {/* This SPAN is used just to load the colors. It seems that there's a bug that the colors have to be loaded first. 
      Feel free to investigate further */}
      <span className="bg-hope-darkcyan text-hope-beige"></span>
      {children}
    </button>
  );
};

export default FormButton;
