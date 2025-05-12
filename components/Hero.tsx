import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import CountdownTimer from "./CountdownTimer";
import { dateRange } from "@/lib/constants";

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
  const formattedDate = formatDateRange(dateRange.startDate, dateRange.endDate);

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[70vh] sm:h-[80vh] md:h-[90vh] lg:h-screen w-full flex items-center justify-center text-center text-white overflow-hidden">
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
        <div className="relative z-20 container mx-auto flex flex-col items-center gap-4 sm:gap-6 px-4">
          {/* Optional LOGO above title */}

          {/* Main Title */}
          <h1 className="font-lemon text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white leading-tight">
            HOPECAMP #6 - [EDITIE]
          </h1>

          {/* Subtitle */}
          <h2 className="font-inter text-lg sm:text-xl md:text-2xl mt-2 font-light">
            Tabăra care nu se uită!
          </h2>

          {/* Display Date Range */}
          <p className="font-inter text-md sm:text-lg mt-3 font-medium bg-white/20 backdrop-blur-sm px-4 py-1 rounded-md">
            {formattedDate}
          </p>

          {/* Countdown Timer */}
          <CountdownTimer />

          {/* Button */}
          <Button variant="default" size="lg" asChild>
            {/* Link this button appropriately */}
            <Link href="/inscrie-te">
              <p className="text-lg sm:text-xl font-semibold">Înscrie-te</p>
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
