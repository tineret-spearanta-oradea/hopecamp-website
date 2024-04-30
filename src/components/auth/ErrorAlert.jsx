import React from 'react';

const ErrorAlert = ({ messages }) => {
  if (!messages || messages.length === 0) return null;

  const WarningIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 12L12 22L22 12L12 2Z" fill="#bf0000"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M11 7H13V13H11V7ZM11 15H13V17H11V15Z" fill="white"/>
    </svg>
  );

  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative space-y-2" role="alert">
      {messages.map((message, index) => (
        <p key={index} className="flex items-center">
          <span className="font-bold mr-2"><WarningIcon /></span>
          <span>{message}</span>
        </p>
      ))}
    </div>
  );
};

export default ErrorAlert;

