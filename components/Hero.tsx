import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import CountdownTimer from "./CountdownTimer";
import { dateRange, editionName, location } from "@/lib/constants";
import { useState } from "react";

// Helper function to format date range
const formatDateRange = (start: Date, end: Date): string => {
  const startDay = start.getDate();
  const endDay = end.getDate();
  const startMonth = start.toLocaleString("ro", { month: "long" });
  const endMonth = end.toLocaleString("ro", { month: "long" });
  const year = start.getFullYear(); // Assuming start and end year are the same

  if (startMonth === endMonth) {
    return `${startDay} - ${endDay} ${startMonth} ${year}`;
  } else {
    return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${year}`;
  }
};

export default function Hero() {
  const targetDate = dateRange.endDate;
  const [hasEnded, setHasEnded] = useState<boolean>(
    () => +targetDate < +new Date()
  );


  const formattedDate = formatDateRange(dateRange.startDate, dateRange.endDate);

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[70vh] sm:h-[80vh] md:h-[90vh] lg:h-screen w-full flex items-center justify-center text-center text-white overflow-hidden border-b-4 border-primary/30 before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/5 before:via-transparent before:to-white/5 before:pointer-events-none">
        {/* Background Image */}
        <Image
          src="/assets/images/gallery/ZVE03429.jpg" // Assuming this is the desired background image
          alt="Hope Camp group photo"
          layout="fill"
          objectFit="cover"
          quality={80}
          priority
          className="z-0"
        />
        {/* Overlay for contrast */}
        <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>

        {/* Content */}
        <div className="relative z-20 container mx-auto flex flex-col items-center px-4">
          {/* Optional LOGO above title */}

          {/* Main Title */}
          <h1 className="font-poppins font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white leading-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] relative">
            <span className="relative z-10">HOPECAMP #6 {editionName.toUpperCase()}</span>
            <span className="absolute inset-0 text-white/20 blur-sm animate-pulse">HOPECAMP #6 {editionName.toUpperCase()}</span>
          </h1>

          {/* Subtitle */}
          <h2 className="font-jersey text-xl sm:text-xl md:text-2xl mt-2 font-semilight">
            ✨ Împreună facem cea mai faină tabără! ✨
          </h2>

          {/* Countdown Timer */}
          <CountdownTimer />

          <p className="font-poppins text-md sm:text-lg mt-3 font-medium  px-4 py-1 rounded-md">
            {formattedDate} @{" "}
            <Link
              href={location.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {location.name}
            </Link>
          </p>

          {/* Button */}
          <Button variant="default" size="lg" asChild>
            {/* Link this button appropriately */}
            {hasEnded ? (
              <Link href="#galerie">
                <p className="text-lg sm:text-xl font-semibold">Vezi poze din tabără</p>
              </Link>
            ) : (
              <Link href="/inscrie-te">
                <p className="text-lg sm:text-xl font-semibold">Înscrie-te</p>
              </Link>
            )}
          </Button>
        </div>
      </section>
    </>
  );
}
