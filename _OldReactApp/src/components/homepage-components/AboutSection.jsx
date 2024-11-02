import React, { useState, useEffect } from "react";

function AboutSection() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loadingStartTime, setLoadingStartTime] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
      const loadingTime = new Date().getTime() - loadingStartTime;
      setTimeout(() => {
        setImageLoaded(true);
      }, loadingTime);
    };
    img.src = "/assets/images/gallery/ZVE03429.jpg";
    setLoadingStartTime(new Date().getTime());
  }, []);

  return (
    <>
      <section className="py-14 px-8">
        <div className="container mx-auto flex flex-col items-center justify-around gap-5 lg:flex-row">
          <div className="flex flex-col items-center lg:items-start gap-5">
            <h2 className="text-hope-blackcyan text-3xl font-bold sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl">
              Despre noi
            </h2>
            {!imageLoaded && (
              <div className="h-40 w-full max-w-xl rounded-lg bg-gray-200 animate-pulse lg:h-96 lg:w-1/2 xl:h-96" />
            )}
            {imageLoaded && (
              <div
                className="flex lg:hidden h-40 w-full max-w-xl rounded-lg bg-center bg-no-repeat bg-cover lg:h-96 lg:w-1/2 xl:h-96"
                style={{
                  backgroundImage: "url('/assets/images/gallery/ZVE03429.jpg')",
                }}
              />
            )}
            <p className="text-hope-blackcyan text-center max-w-sm sm:text-md md:max-w-md md:text-md lg:max-w-lg lg:text-lg lg:text-start xl:max-w-xl xl:text-xl leading-relaxed">
              Bine ai venit în comunitatea noastră de tineri pasionați și plini
              de energie. Suntem echipa taberei creștine Hope Camp din cadrul
              Tineret Speranța Oradea, alcătuită din tineri din diverse biserici
              locale. 🙏 Noi creăm un mediu plăcut tinerilor pentru distracție
              și socializare, dar și un spațiu propice pentru închinare și
              cunoașterea lui Dumnezeu! Lucrăm cu drag și entuziasm pentru a
              oferi experiențe memorabile și motivante unde fiecare se simte
              acasă. Aici, fiecare este binevenit și contribuie la o atmosferă
              plăcută. Scopul nostru este ca tinerii să aibă o experiență
              personală și autentică cu Dumnezeu, să-L aleagă pe Hristos ca Domn
              al vieții personale și să să crească spiritual prin ucenicie. Te
              aștptăm să ni te alături și să creăm împreună amintiri frumoase și
              momente spirituale de neuitat!🎉
            </p>
          </div>
          {!imageLoaded && (
            <div className="hidden lg:flex h-40 w-full max-w-xl rounded-lg bg-gray-200 animate-pulse lg:h-96 lg:w-1/2 xl:h-96" />
          )}
          {imageLoaded && (
            <div
              className="hidden lg:flex h-40 w-full max-w-xl rounded-lg bg-center bg-no-repeat bg-cover lg:h-96 lg:w-1/2 xl:h-96"
              style={{
                backgroundImage: "url('/assets/images/gallery/ZVE03429.jpg')",
              }}
            />
          )}
        </div>
      </section>
    </>
  );
}

export default AboutSection;
