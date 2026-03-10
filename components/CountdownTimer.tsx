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
  if (difference <= 0) return null;
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

const pad = (num: number) => num.toString().padStart(2, "0");

const TimeBox = ({ value, label }: { value: string; label: string }) => (
  <div className="text-center">
    <div className="font-archivo text-4xl sm:text-5xl lg:text-6xl text-[#1a1a1a] leading-none mb-1">
      {value}
    </div>
    <div className="text-xs sm:text-sm text-[#1a1a1a]/50 font-bold uppercase tracking-wider">
      {label}
    </div>
  </div>
);

export default function CountdownTimer() {
  const targetDate = dateRange.startDate;
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(calculateTimeLeft(targetDate));
  }, [targetDate]);

  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      const tl = calculateTimeLeft(targetDate);
      setTimeLeft(tl);
      if (!tl) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [mounted, targetDate]);

  // Camp already started — don't show countdown
  if (mounted && !timeLeft) {
    return null;
  }

  const display = timeLeft
    ? { d: pad(timeLeft.days), h: pad(timeLeft.hours), m: pad(timeLeft.minutes), s: pad(timeLeft.seconds) }
    : { d: "--", h: "--", m: "--", s: "--" };

  return (
    <div className="bg-[#FFD600] mx-4 sm:mx-12 mt-4 sm:mt-6 px-4 sm:px-12 py-8 sm:py-12">
      <div className="max-w-3xl mx-auto grid grid-cols-4 gap-3 sm:gap-8">
        <TimeBox value={display.d} label="Zile" />
        <TimeBox value={display.h} label="Ore" />
        <TimeBox value={display.m} label="Min" />
        <TimeBox value={display.s} label="Sec" />
      </div>
    </div>
  );
}
