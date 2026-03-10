"use client";

import Link from "next/link";
import { dateRange, location } from "@/lib/constants";
// import { useState } from "react";

const formatDateRange = (start: Date, end: Date): string => {
  const startDay = start.getDate();
  const endDay = end.getDate();
  const startMonth = start.toLocaleString("ro", { month: "long" });
  const endMonth = end.toLocaleString("ro", { month: "long" });
  const year = start.getFullYear();

  if (startMonth === endMonth) {
    return `${startDay} - ${endDay} ${startMonth} ${year}`;
  }
  return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${year}`;
};

export default function Hero() {
  // const targetDate = dateRange.endDate;
  // const [hasEnded] = useState<boolean>(() => +targetDate < +new Date());
  const formattedDate = formatDateRange(dateRange.startDate, dateRange.endDate);

  return (
    <section className="min-h-[100dvh] flex flex-col items-center justify-center px-6 sm:px-12 bg-white relative">
      <div className="text-center max-w-3xl mx-auto w-full">
        {/* Title */}
        <h1 className="font-archivo text-[clamp(3.5rem,15vw,11rem)] leading-[0.88] tracking-tighter uppercase text-[#1a1a1a]">
          HOPE
          <br />
          CAMP
        </h1>

        {/* Edition badge */}
        <div className="mt-4 sm:mt-6">
          <span className="inline-block font-archivo text-[clamp(1.2rem,4vw,2.5rem)] text-[#FFD600] tracking-tight">
            #7
          </span>
        </div>

        {/* Divider */}
        <div className="w-16 h-1 bg-[#FFD600] mx-auto mt-5 sm:mt-6" />

        {/* Location & Date */}
        <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
          <Link
            href={location.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 text-sm sm:text-base text-gray-600 hover:text-[#1a1a1a] transition-colors"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFD600] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>
              <strong className="text-[#1a1a1a]">{location.name}</strong>, {location.addressLine}
            </span>
          </Link>

          <div className="flex items-center justify-center gap-2 text-sm sm:text-base text-gray-600">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFD600] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Coming soon banner */}
        <div className="mt-8 sm:mt-10">
          <span className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-[#FFD600] text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#1a1a1a]">
            Coming Soon
          </span>
        </div>

        {/* CTA - uncomment when registration opens
        <div className="mt-8 sm:mt-10">
          {hasEnded ? (
            <Link
              href="#galerie"
              className="inline-block px-8 sm:px-10 py-3.5 sm:py-4 border-2 border-[#FFD600] bg-[#FFD600] text-[#1a1a1a] text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-transparent transition-colors"
            >
              VEZI POZE
            </Link>
          ) : (
            <Link
              href="/inscrie-te"
              className="inline-block px-8 sm:px-10 py-3.5 sm:py-4 border-2 border-[#FFD600] bg-[#FFD600] text-[#1a1a1a] text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-transparent transition-colors"
            >
              INSCRIE-TE
            </Link>
          )}
        </div>
        */}
      </div>
    </section>
  );
}
