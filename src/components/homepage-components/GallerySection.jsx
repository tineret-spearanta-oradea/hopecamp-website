import React, { useState, useEffect } from "react";
import FilledButton from "../general-components/FilledButton";
import "/src/styles/gallery-routes.css";
import { pages } from "../../constants";

function GallerySection() {
  const [photosLoaded, setPhotosLoaded] = useState(false);

  // Simulate photo loading with a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhotosLoaded(true);
    }, 2000); // TODO: replace hardocded with actual time to load the images
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <section className="py-14">
        <div className="container mx-auto flex flex-col items-center gap-5">
          <h2 className="text-hope-blackcyan text-3xl font-bold sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl">
            Galerie
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-3">
              {/* Display loading shimmer effect while photos are not loaded */}
              {!photosLoaded && (
                <>
                  <div className="photo-shimmer w-32 h-24 sm:w-44 sm:h-32 md:w-48 md:h-36 lg:w-56 lg:h-40 xl:w-64 xl:h-48 2xl:w-72 2xl:h-52 bg-gray-200 animate-pulse rounded-lg"></div>
                  <div className="photo-shimmer w-32 h-52 sm:w-44 sm:h-60 md:w-48 md:h-64 lg:w-56 lg:h-72 xl:w-64 xl:h-80 2xl:w-72 2xl:h-88 bg-gray-200 animate-pulse rounded-lg"></div>
                  <div className="photo-shimmer w-32 h-32 sm:w-44 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-64 xl:w-64 xl:h-72 2xl:w-72 2xl:h-80 bg-gray-200 animate-pulse rounded-lg"></div>
                </>
              )}
              {/* Display photos when they are loaded */}
              {photosLoaded && (
                <>
                  <div className="photo1 w-32 h-24 sm:w-44 sm:h-32 md:w-48 md:h-36 lg:w-56 lg:h-40 xl:w-64 xl:h-48 2xl:w-72 2xl:h-52 bg-cover bg-center rounded-lg"></div>
                  <div className="photo2 w-32 h-52 sm:w-44 sm:h-60 md:w-48 md:h-64 lg:w-56 lg:h-72 xl:w-64 xl:h-80 2xl:w-72 2xl:h-88 bg-cover bg-center rounded-lg"></div>
                  <div className="photo3 w-32 h-32 sm:w-44 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-64 xl:w-64 xl:h-72 2xl:w-72 2xl:h-80 bg-cover bg-center rounded-lg"></div>
                </>
              )}
            </div>
            <div className="flex flex-col gap-3">
              {/* Display loading shimmer effect while photos are not loaded */}
              {!photosLoaded && (
                <>
                  <div className="photo-shimmer w-32 h-44 sm:w-44 sm:h-52 md:w-48 md:h-56 lg:w-56 lg:h-64 xl:w-64 xl:h-72 2xl:w-72 2xl:h-80 bg-gray-200 animate-pulse rounded-lg"></div>
                  <div className="photo-shimmer w-32 h-20 sm:w-44 sm:h-24 md:w-48 md:h-28 lg:w-56 lg:h-32 xl:w-64 xl:h-36 2xl:w-72 2xl:h-40 bg-gray-200 animate-pulse rounded-lg"></div>
                  <div className="photo-shimmer w-32 h-44 sm:w-44 sm:h-52 md:w-48 md:h-64 lg:w-56 lg:h-80 xl:w-64 xl:h-88 2xl:w-72 2xl:h-80 bg-gray-200 animate-pulse rounded-lg"></div>
                </>
              )}
              {/* Display photos when they are loaded */}
              {photosLoaded && (
                <>
                  <div className="photo4 w-32 h-44 sm:w-44 sm:h-52 md:w-48 md:h-56 lg:w-56 lg:h-64 xl:w-64 xl:h-72 2xl:w-72 2xl:h-80 bg-cover bg-center rounded-lg"></div>
                  <div className="photo5 w-32 h-20 sm:w-44 sm:h-24 md:w-48 md:h-28 lg:w-56 lg:h-32 xl:w-64 xl:h-36 2xl:w-72 2xl:h-40 bg-cover bg-center rounded-lg"></div>
                  <div className="photo6 w-32 h-44 sm:w-44 sm:h-52 md:w-48 md:h-64 lg:w-56 lg:h-80 xl:w-64 xl:h-88 2xl:w-72 2xl:h-80 bg-cover bg-center rounded-lg"></div>
                </>
              )}
            </div>
          </div>
          <FilledButton text="Vezi galerie" route={pages.gallery} />
        </div>
      </section>
    </>
  );
}

export default GallerySection;
