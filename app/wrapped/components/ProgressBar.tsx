"use client";

import { memo } from "react";

interface ProgressBarProps {
  total: number;
  current: number;
  progress: number; // 0-100 progress within current slide
}

// Memoized to prevent unnecessary re-renders
const ProgressBar = memo(function ProgressBar({ total, current, progress }: ProgressBarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-3 flex gap-1.5">
      {Array.from({ length: total }).map((_, index) => {
        const width = index < current ? 100 : index === current ? progress : 0;

        return (
          <div
            key={index}
            className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
          >
            {/* Pure CSS transition - no Framer Motion overhead */}
            <div
              className="h-full bg-white rounded-full transition-[width] duration-[250ms] ease-linear"
              style={{ width: `${width}%` }}
            />
          </div>
        );
      })}
    </div>
  );
});

export default ProgressBar;
