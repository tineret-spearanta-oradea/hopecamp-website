import React from "react";
import { Link } from "react-router-dom";

const GalleryCard = ({ imageUrl, title, description, buttonUrl }) => {
  return (
    <div className="border border-hope-lightcyan  text-center rounded-xl overflow-hidden shadow-lg w-80 mb-10 lg:mx-4">
      <div
        className="flex h-40 w-full max-w-xl rounded-lg bg-center bg-no-repeat bg-cover xl:h-52"
        style={{
          backgroundImage: `url(${imageUrl})`,
        }}
      />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{title}</div>
        <p className="text-gray-700 text-base">{description}</p>
      </div>
      <div className="px-6 py-4">
        <Link
          to={buttonUrl}
          target="_blank"
          className="bg-hope-darkcyan hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Vezi galerie ↗
        </Link>
      </div>
    </div>
  );
};

export default GalleryCard;
