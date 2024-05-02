import React from "react";
import { Link } from "react-router-dom";

const NavigationBar = () => {
  return (
    <nav className="bg-blue-500 text-white p-2 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-lg font-semibold hover:text-blue-200 transition-colors py-2 px-4 rounded">Home</Link>
        <div className="flex space-x-4">
          <Link to="/login" className="text-lg font-semibold hover:text-blue-200 transition-colors py-2 px-4 rounded bg-blue-700 hover:bg-blue-600">Login</Link>
          <Link to="/inscrie-te" className="text-lg font-semibold hover:text-blue-200 transition-colors py-2 px-4 rounded bg-blue-700 hover:bg-blue-600">Înscrie-te</Link>
        </div>
      </div>
    </nav>
  );
};


export default NavigationBar;
