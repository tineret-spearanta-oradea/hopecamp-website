"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  total: number;
  current: number;
  progress: number; // 0-100 progress within current slide
}

export default function ProgressBar({ total, current, progress }: ProgressBarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-3 flex gap-1.5">
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
        >
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ width: 0 }}
            animate={{
              width:
                index < current
                  ? "100%"
                  : index === current
                  ? `${progress}%`
                  : "0%",
            }}
            transition={{
              duration: index === current ? 0.1 : 0.3,
              ease: "linear",
            }}
          />
        </div>
      ))}
    </div>
  );
}
