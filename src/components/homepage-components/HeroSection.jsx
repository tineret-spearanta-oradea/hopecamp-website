import { useState, useEffect } from "react";
import FilledButton from "../general-components/FilledButton";
import "/src/styles/dividers.css";
import { CampTitle, pages, dateRange } from "../../constants";

function HeroSection() {
  const calculateCountdown = () => {
    const currentDate = new Date();
    const targetDate = dateRange.startDate;
    const difference = targetDate - currentDate;

    if (difference <= 0) {
      return CampTitle.CoreName + " " + CampTitle.Edition + " is in progress!";
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
          <h1 className="text-hope-darkcyan text-4xl font-black sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl">
            {CampTitle.CoreName} {CampTitle.Edition}
          </h1>
          <p
            className="text-hope-blackcyan text-center text-sm  max-w-44 sm:text-base  lg:text-lg lg:max-w-lg xl:text-xl 2xl:text-2xl
            m-2 md:m-4"
          >
            Tabăra pe care nu vrei să o ratezi
          </p>
          <p
            class="bg-gradient-to-r from-hope-darkcyan to-hope-orange inline-block text-transparent bg-clip-text
            text-xl md:text-2xl lg:text-3xl xl:text-5xl"
          >
            {countdown}
          </p>
          <div className="pt-10">
            <FilledButton text="Înscrie-te" route={pages.register} />
          </div>
        </div>
      </section>
      <div className="spacer hero-divider"></div>
    </>
  );
}

export default HeroSection;
