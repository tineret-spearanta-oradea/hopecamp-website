import React from "react";

const LoadingIcon = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center z-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-gray-900"></div>
      <div>
        <h2 className="bg-white">NU INCHIDE BROWSER-UL</h2>
      </div>
    </div>
  );
};

export default LoadingIcon;
