"use client";

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
  const year = start.getFullYear();

  if (startMonth === endMonth) {
    return `${startDay} - ${endDay} ${startMonth} ${year}`;
  } else {
    return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${year}`;
  }
};

// Ice Crystal SVG component
const IceCrystal = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M12 2L12 22M2 12L22 12M4.93 4.93L19.07 19.07M19.07 4.93L4.93 19.07"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.3" />
    <circle cx="12" cy="2" r="1.5" fill="currentColor" />
    <circle cx="12" cy="22" r="1.5" fill="currentColor" />
    <circle cx="2" cy="12" r="1.5" fill="currentColor" />
    <circle cx="22" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

// Floating crystals decoration
const FloatingCrystals = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-15">
    {/* Top left cluster */}
    <div className="absolute top-[10%] left-[5%] text-white/20 animate-float-slow">
      <IceCrystal size={40} />
    </div>
    <div className="absolute top-[15%] left-[12%] text-white/15 animate-drift animation-delay-300">
      <IceCrystal size={24} />
    </div>

    {/* Top right cluster */}
    <div className="absolute top-[8%] right-[8%] text-white/25 animate-float animation-delay-500">
      <IceCrystal size={32} />
    </div>
    <div className="absolute top-[20%] right-[15%] text-white/10 animate-float-slow animation-delay-700">
      <IceCrystal size={20} />
    </div>

    {/* Mid left */}
    <div className="absolute top-[40%] left-[3%] text-white/15 animate-drift animation-delay-200">
      <IceCrystal size={28} />
    </div>

    {/* Mid right */}
    <div className="absolute top-[45%] right-[5%] text-white/20 animate-float animation-delay-1000">
      <IceCrystal size={36} />
    </div>

    {/* Bottom clusters */}
    <div className="absolute bottom-[20%] left-[10%] text-white/15 animate-float-slow animation-delay-500">
      <IceCrystal size={22} />
    </div>
    <div className="absolute bottom-[15%] right-[12%] text-white/20 animate-drift animation-delay-300">
      <IceCrystal size={30} />
    </div>

    {/* Small sparkle diamonds */}
    <div className="absolute top-[25%] left-[25%] w-2 h-2 bg-white/30 rotate-45 animate-twinkle" />
    <div className="absolute top-[35%] right-[20%] w-1.5 h-1.5 bg-white/40 rotate-45 animate-twinkle animation-delay-200" />
    <div className="absolute bottom-[30%] left-[30%] w-2 h-2 bg-white/25 rotate-45 animate-twinkle animation-delay-500" />
    <div className="absolute top-[60%] right-[25%] w-1 h-1 bg-white/50 rotate-45 animate-twinkle animation-delay-700" />
  </div>
);

export default function Hero() {
  const targetDate = dateRange.endDate;
  const [hasEnded, setHasEnded] = useState<boolean>(
    () => +targetDate < +new Date()
  );

  const formattedDate = formatDateRange(dateRange.startDate, dateRange.endDate);

  return (
    <section className="relative min-h-[100svh] w-full flex items-center justify-center text-center text-white overflow-hidden">
      {/* Background Image */}
      <Image
        src="/assets/images/wintercamp/wc1-3.png"
        alt="Hope Camp group photo"
        fill
        style={{ objectFit: "cover" }}
        quality={85}
        priority
        className="z-0 scale-105"
      />

      {/* Aurora/Winter Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#0a1628]/80 via-[#1a3a5c]/60 to-[#0d2847]/90" />

      {/* Animated Aurora Effect */}
      <div className="absolute inset-0 z-11 opacity-40 animate-aurora bg-gradient-to-br from-cyan-500/20 via-blue-600/10 to-purple-500/20 bg-[length:200%_200%]" />

      {/* Frost Texture Overlay */}
      <div className="absolute inset-0 z-12 opacity-30 bg-[radial-gradient(ellipse_at_top,rgba(200,230,255,0.15)_0%,transparent_50%)]" />
      <div className="absolute inset-0 z-12 opacity-20 bg-[radial-gradient(ellipse_at_bottom_right,rgba(200,230,255,0.2)_0%,transparent_40%)]" />

      {/* Floating Ice Crystals */}
      <FloatingCrystals />

      {/* Main Content */}
      <div className="relative z-20 container mx-auto flex flex-col items-center px-4 py-20">
        {/* Glassmorphism Content Card */}
        <div className="glass-card rounded-3xl px-6 sm:px-10 md:px-16 py-10 md:py-14 max-w-4xl mx-auto ice-glow">
          {/* Main Title with Ice Effect */}
          <h1 className="font-poppins font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-2 relative">
            <span className="relative z-10 text-ice drop-shadow-[0_4px_20px_rgba(100,200,255,0.3)]">
              HOPECAMP
            </span>
          </h1>

          {/* Edition Name */}
          <h2 className="font-poppins font-bold text-2xl sm:text-3xl md:text-4xl text-white/90 mb-4 text-frost">
            {editionName.toUpperCase()}
          </h2>

          {/* Subtitle */}
          <p className="font-jersey text-lg sm:text-xl md:text-2xl text-cyan-100/90 mb-8">
            Împreună facem cea mai faină tabără!
          </p>

          {/* Countdown Timer */}
          <CountdownTimer />

          {/* Date & Location */}
          <p className="font-nunito text-base sm:text-lg mt-6 text-white/80 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-2">
              <svg className="w-4 h-4 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formattedDate}
            </span>
            <span className="text-white/40">•</span>
            <Link
              href={location.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-cyan-300 transition-colors underline decoration-cyan-300/50"
            >
              <svg className="w-4 h-4 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {location.name}
            </Link>
          </p>

          {/* CTA Button */}
          <div className="mt-8">
            <Button
              size="lg"
              asChild
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 transition-all duration-300 hover:scale-105 text-lg px-8 py-6 rounded-xl"
            >
              {hasEnded ? (
                <Link href="#galerie" className="flex items-center gap-2">
                  <span>Vezi poze din tabără</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </Link>
              ) : (
                <Link href="/inscrie-te" className="flex items-center gap-2">
                  <span>Înscrie-te acum</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Frost Edge */}
      <div className="absolute bottom-0 left-0 right-0 z-30 h-32 pointer-events-none">
        {/* Gradient fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#f0f7ff] via-[#f0f7ff]/50 to-transparent" />

        {/* Frost glow line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-200/80 to-transparent shadow-[0_0_30px_rgba(200,230,255,0.6)]" />

        {/* SVG Wave */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full h-20"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="frost-wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(240, 247, 255, 0.9)" />
              <stop offset="50%" stopColor="rgba(200, 230, 255, 0.95)" />
              <stop offset="100%" stopColor="rgba(240, 247, 255, 0.9)" />
            </linearGradient>
          </defs>
          <path
            d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
            fill="url(#frost-wave-gradient)"
          />
          <path
            d="M0,50 C360,20 720,70 1080,30 C1260,10 1380,50 1440,45 L1440,80 L0,80 Z"
            fill="rgba(240, 247, 255, 1)"
          />
        </svg>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-36 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
          <div className="w-1 h-2 bg-white/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
