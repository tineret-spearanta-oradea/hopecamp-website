"use client";

import Link from "next/link";
import Image from "next/image";
import { dateRange, location } from "@/lib/constants";
import { useState } from "react";

// Format date range nicely
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
  const targetDate = dateRange.endDate;
  const [hasEnded] = useState<boolean>(() => +targetDate < +new Date());
  const formattedDate = formatDateRange(dateRange.startDate, dateRange.endDate);

  const heroPhotos = [
    "/assets/images/hopecamp/gratiadei/compressed/gratiadei-5.jpg",
    "/assets/images/hopecamp/gratiadei/compressed/gratiadei-2.jpg",
    "/assets/images/hopecamp/gratiadei/compressed/gratiadei-4.jpg",
    "/assets/images/hopecamp/gratiadei/compressed/gratiadei-17.jpg",
  ];

  return (
    <>
      <section className="min-h-[85vh] sm:min-h-[90vh] flex flex-col justify-center px-4 sm:px-12 pt-24 sm:pt-32 pb-8 sm:pb-12 bg-white relative">
        <div className="max-w-6xl mx-auto w-full">
          {/* Big title */}
          <div className="relative">
            <h1 className="font-archivo text-[clamp(3rem,14vw,10rem)] leading-[0.92] tracking-tighter uppercase text-[#1a1a1a]">
              HOPE
              <br />
              <span className="relative inline-block">
                CAMP
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-[8deg] font-archivo text-[clamp(2rem,8vw,6rem)] text-[#FFD600] opacity-85 pointer-events-none select-none">
                  HC
                </span>
              </span>
              <span className="text-[clamp(1.5rem,4vw,3rem)] text-[#FFD600] ml-2 sm:ml-3 align-bottom">#7</span>
              <span className="text-xs sm:text-sm font-sans font-medium tracking-[3px] uppercase text-gray-400 ml-3 sm:ml-4 align-bottom">
                EST. 2019
              </span>
            </h1>
          </div>

          {/* Location & Date info */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-4 sm:mt-6 text-sm sm:text-base text-gray-500">
            <span className="inline-flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#FFD600]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <strong className="text-[#1a1a1a]">{location.name}</strong>, {location.addressLine}
            </span>
            <span className="text-gray-300 hidden sm:inline">·</span>
            <span className="inline-flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#FFD600]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formattedDate}
            </span>
          </div>

          {/* Bottom row: buttons + description */}
          <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8 mt-8 sm:mt-12">
            <div className="flex flex-row sm:flex-col gap-3 w-full sm:w-auto">
              {hasEnded ? (
                <Link
                  href="#galerie"
                  className="flex-1 sm:flex-none inline-block px-6 sm:px-8 py-3 sm:py-3.5 border-2 border-[#FFD600] bg-transparent text-[#1a1a1a] text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-[#FFD600] transition-colors text-center"
                >
                  VEZI POZE
                </Link>
              ) : (
                <Link
                  href="/inscrie-te"
                  className="flex-1 sm:flex-none inline-block px-6 sm:px-8 py-3 sm:py-3.5 border-2 border-[#FFD600] bg-transparent text-[#1a1a1a] text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-[#FFD600] transition-colors text-center"
                >
                  INSCRIE-TE
                </Link>
              )}
              <Link
                href="#video"
                className="flex-1 sm:flex-none inline-block px-6 sm:px-8 py-3 sm:py-3.5 border-2 border-[#FFD600] bg-transparent text-[#1a1a1a] text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-[#FFD600] transition-colors text-center"
              >
                AFTERMOVIE
              </Link>
            </div>
            <p className="max-w-sm text-gray-500 leading-relaxed text-sm sm:text-base">
              Împreună facem cea mai faină tabără!
            </p>
          </div>
        </div>
      </section>

      {/* Photo strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 px-4 sm:px-12">
        {heroPhotos.map((src, i) => (
          <div
            key={i}
            className={`relative aspect-[4/3] overflow-hidden group cursor-pointer ${
              i % 2 !== 0 ? "grayscale hover:grayscale-0" : ""
            } transition-all duration-500`}
          >
            <Image
              src={src}
              alt={`HopeCamp moment ${i + 1}`}
              fill
              style={{ objectFit: "cover" }}
              className="group-hover:scale-105 transition-transform duration-500"
              priority={i < 2}
            />
          </div>
        ))}
      </div>
    </>
  );
}
