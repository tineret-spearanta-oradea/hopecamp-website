"use client";

import { useState, useEffect } from "react";
import { dateRange } from "@/lib/constants";
import Link from "next/link";

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

  if (!isMounted) {
    return (
      <div className="grid grid-flow-col gap-3 sm:gap-5 text-center auto-cols-max justify-center my-4 sm:my-6">
        <div className="flex flex-col items-center">
          <span className="font-mono text-4xl sm:text-5xl md:text-6xl font-bold">
            00
          </span>
          <span className="font-inter text-xs sm:text-sm uppercase tracking-wider mt-1">
            Zile
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-mono text-4xl sm:text-5xl md:text-6xl font-bold">
            00
          </span>
          <span className="font-inter text-xs sm:text-sm uppercase tracking-wider mt-1">
            Ore
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-mono text-4xl sm:text-5xl md:text-6xl font-bold">
            00
          </span>
          <span className="font-jersey text-xs sm:text-sm uppercase tracking-wider mt-1">
            Min
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-mono text-4xl sm:text-5xl md:text-6xl font-bold">
            00
          </span>
          <span className="font-jersey text-xs sm:text-sm uppercase tracking-wider mt-1">
            Sec
          </span>
        </div>
      </div>
    );
  }

  if (hasEnded) {
    return (
      <div className="text-center my-6">
        <p className="text-xl sm:text-2xl font-semibold">
          Această ediție a avut loc. Rămâi aproape pentru ediția următoare!
        </p>
      </div>
    );
  }

  if (!timeLeft) {
    return (
      <div className="grid grid-flow-col gap-3 sm:gap-5 text-center auto-cols-max justify-center my-4 sm:my-6">
        <div className="flex flex-col items-center">
          <span className="font-mono text-4xl sm:text-5xl md:text-6xl font-bold">
            00
          </span>
          <span className=" text-xs sm:text-sm uppercase tracking-wider mt-1">
            Zile
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-mono text-4xl sm:text-5xl md:text-6xl font-bold">
            00
          </span>
          <span className=" text-xs sm:text-sm uppercase tracking-wider mt-1">
            Ore
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className=" text-4xl sm:text-5xl md:text-6xl font-bold">
            00
          </span>
          <span className=" text-xs sm:text-sm uppercase tracking-wider mt-1">
            Min
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className=" text-4xl sm:text-5xl md:text-6xl font-bold">
            00
          </span>
          <span className=" text-xs sm:text-sm uppercase tracking-wider mt-1">
            Sec
          </span>
        </div>
      </div>
    );
  }

  const pad = (num: number) => num.toString().padStart(2, "0");

  return (
    <div className="grid grid-flow-col gap-3 sm:gap-5 text-center auto-cols-max justify-center my-4 sm:my-6">
      <div className="flex flex-col items-center">
        <span className="font-poppins text-4xl sm:text-5xl md:text-6xl font-bold">
          {pad(timeLeft.days)}
        </span>
        <span className="font-jersey text-xs sm:text-sm uppercase tracking-wider mt-1">
          Zile
        </span>
      </div>
      <div className="flex flex-col items-center">
        <span className="font-poppins text-4xl sm:text-5xl md:text-6xl font-bold">
          {pad(timeLeft.hours)}
        </span>
        <span className="font-jersey text-xs sm:text-sm uppercase tracking-wider mt-1">
          Ore
        </span>
      </div>
      <div className="flex flex-col items-center">
        <span className="font-poppins text-4xl sm:text-5xl md:text-6xl font-bold">
          {pad(timeLeft.minutes)}
        </span>
        <span className="font-jersey text-xs sm:text-sm uppercase tracking-wider mt-1">
          Min
        </span>
      </div>
      <div className="flex flex-col items-center">
        <span className="font-poppins text-4xl sm:text-5xl md:text-6xl font-bold">
          {pad(timeLeft.seconds)}
        </span>
        <span className="font-jersey text-xs sm:text-sm uppercase tracking-wider mt-1">
          Sec
        </span>
      </div>
    </div>
  );
}
