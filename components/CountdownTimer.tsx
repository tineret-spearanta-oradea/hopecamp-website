"use client";

import { useState, useEffect } from "react";
import { dateRange } from "@/lib/constants";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const calculateTimeLeft = (targetDate: Date): TimeLeft | null => {
  const difference = +targetDate - +new Date();
  let timeLeft: TimeLeft | null = null;

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};

// Ice crystal separator between time units
const IceSeparator = () => (
  <div className="flex flex-col items-center justify-center h-full px-1">
    <div className="w-1.5 h-1.5 bg-cyan-300/60 rotate-45 animate-pulse" />
    <div className="w-0.5 h-4 bg-gradient-to-b from-cyan-300/40 to-transparent my-1" />
    <div className="w-1.5 h-1.5 bg-cyan-300/60 rotate-45 animate-pulse animation-delay-500" />
  </div>
);

// Single time unit component with glassmorphism
const TimeUnit = ({
  value,
  label,
  isLast = false,
}: {
  value: string;
  label: string;
  isLast?: boolean;
}) => (
  <div className="flex items-center">
    <div className="flex flex-col items-center">
      {/* Glass card for number */}
      <div className="glass rounded-xl px-3 sm:px-5 py-2 sm:py-3 min-w-[60px] sm:min-w-[80px] relative overflow-hidden group">
        {/* Frost shimmer effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

        {/* Number */}
        <span className="font-poppins text-3xl sm:text-4xl md:text-5xl font-bold text-white relative z-10 tabular-nums">
          {value}
        </span>
      </div>

      {/* Label */}
      <span className="font-jersey text-[10px] sm:text-xs uppercase tracking-wider mt-2 text-cyan-200/80">
        {label}
      </span>
    </div>

    {/* Separator (not for last item) */}
    {!isLast && (
      <div className="mx-1 sm:mx-2 hidden sm:block">
        <IceSeparator />
      </div>
    )}
  </div>
);

// Loading placeholder
const LoadingTimer = () => (
  <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-0 my-4 sm:my-6">
    <TimeUnit value="--" label="Zile" />
    <TimeUnit value="--" label="Ore" />
    <TimeUnit value="--" label="Min" />
    <TimeUnit value="--" label="Sec" isLast />
  </div>
);

export default function CountdownTimer() {
  const targetDate = dateRange.startDate;
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(
    calculateTimeLeft(targetDate)
  );
  const [hasEnded, setHasEnded] = useState<boolean>(
    () => +targetDate < +new Date()
  );
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (hasEnded || !isMounted) return;

    const interval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(targetDate);
      if (newTimeLeft) {
        setTimeLeft(newTimeLeft);
      } else {
        setHasEnded(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isMounted, hasEnded, targetDate]);

  // Loading state
  if (!isMounted) {
    return <LoadingTimer />;
  }

  // Event has ended
  if (hasEnded) {
    return (
      <div className="text-center my-6">
        <div className="glass rounded-2xl px-6 py-4 inline-block">
          <p className="text-lg sm:text-xl font-semibold text-white/90">
            Această ediție a avut loc
          </p>
          <p className="text-sm text-cyan-200/70 mt-1">
            Rămâi aproape pentru ediția următoare!
          </p>
        </div>
      </div>
    );
  }

  // No time left
  if (!timeLeft) {
    return <LoadingTimer />;
  }

  const pad = (num: number) => num.toString().padStart(2, "0");

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-0 my-4 sm:my-6">
      <TimeUnit value={pad(timeLeft.days)} label="Zile" />
      <TimeUnit value={pad(timeLeft.hours)} label="Ore" />
      <TimeUnit value={pad(timeLeft.minutes)} label="Min" />
      <TimeUnit value={pad(timeLeft.seconds)} label="Sec" isLast />
    </div>
  );
}
