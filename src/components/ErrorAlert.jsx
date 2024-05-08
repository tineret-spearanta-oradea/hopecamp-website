import React, { useState } from "react";

const ErrorAlert = ({ messages, displayMode }) => {
  const [showAlert, setShowAlert] = useState(true);

  if (!messages || messages.length === 0 || !showAlert) return null;

  const WarningIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2L2 12L12 22L22 12L12 2Z" fill="#bf0000" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 7H13V13H11V7ZM11 15H13V17H11V15Z"
        fill="white"
      />
    </svg>
  );

  const handleClose = () => {
    setShowAlert(false);
  };

  if (displayMode === "popup") {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-sm text-red-700 px-4 py-3 rounded relative space-y-2">
          {messages.map((message, index) => (
            <p key={index} className="flex items-center">
              <span className="font-bold mr-2">
                <WarningIcon />
              </span>
              <span>{message}</span>
            </p>
          ))}
          <button className="absolute top-0 right-0 p-2" onClick={handleClose}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="#bf0000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-red-100 border border-red-400 text-sm text-red-700 px-4 py-3 rounded relative space-y-2 my-2"
      role="alert"
    >
      {messages.map((message, index) => (
        <p key={index} className="flex items-center">
          <span className="font-bold mr-2">
            <WarningIcon />
          </span>
          <span>{message}</span>
        </p>
      ))}
    </div>
  );
};

export default ErrorAlert;
