import { useState, useEffect } from "react";
import FilledButton from "../general-components/FilledButton";
import "/src/styles/dividers.css";
import { CampTitle, pages, dateRange } from "../../constants";

function HeroSection() {
  const calculateCountdown = () => {
    const currentDate = new Date();
    const difference = dateRange.startDate - currentDate;

    if (difference <= 0 && dateRange.endDate >= currentDate) {
      return <p className="text-sm text-hope-blackcyan">Tabăra a început!</p>;
    } else if (dateRange.endDate < currentDate) {
      return (
        <p className="text-sm text-hope-blackcyan">
          Apasă butonul de mai sus pentru a vedea galeria din tabără!
        </p>
      );
    }

    const seconds = Math.floor((difference / 1000) % 60);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    return `${days}z ${hours}h ${minutes}m ${seconds}s`;
  };

  const [countdown, setCountdown] = useState(calculateCountdown());

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(calculateCountdown());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <section className="bg-hope-beige py-14 px-8">
        <div className="container mx-auto flex flex-col justify-center items-center gap-2 lg:gap-4">
          <h1 className="text-hope-darkcyan text-center text-4xl font-black sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl">
            {CampTitle.CoreName} {CampTitle.Edition}
          </h1>
          <h3 className="text-hope-orange text-lg font-bold sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4ßxl">
            {dateRange.startDate.getDate()}-{dateRange.endDate.getDate()}{" "}
            {dateRange.startDate.toLocaleString("ro", { month: "long" })} @
            Someșu Rece - Cluj
          </h3>
          <p
            className="text-hope-blackcyan text-center text-sm  max-w-44 sm:text-base  lg:text-lg lg:max-w-lg xl:text-xl 2xl:text-2xl
            m-2 md:m-4"
          >
            Tabăra pe care nu vrei să o ratezi
          </p>
          <div className="pt-8">
            <FilledButton
              text="GALERIE HC#5"
              route={
                "https://drive.google.com/drive/u/1/folders/1eh_ifVkcLBtLQSwsrnO7iNoe1uyUpyj_"
              }
            />
          </div>
          <div
            className="bg-gradient-to-r from-hope-darkcyan to-hope-orange inline-block text-transparent bg-clip-text
            text-xl md:text-2xl lg:text-3xl xl:text-5xl"
          >
            {countdown}
          </div>
        </div>
      </section>
      <div className="spacer hero-divider"></div>
    </>
  );
}

export default HeroSection;
