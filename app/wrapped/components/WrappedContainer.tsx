"use client";

import { useState, useEffect, useCallback, useRef, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import ProgressBar from "./ProgressBar";

interface WrappedContainerProps {
  children: ReactNode[];
  autoAdvanceTime?: number; // in ms
  pauseOnSlides?: number[]; // indices of slides where auto-advance should be disabled
}

export default function WrappedContainer({
  children,
  autoAdvanceTime = 10000, // 10 seconds default
  pauseOnSlides = [],
}: WrappedContainerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1); // 1 for next, -1 for prev
  const isTransitioning = useRef(false);

  const totalSlides = children.length;
  const shouldPauseOnCurrentSlide = pauseOnSlides.includes(currentSlide);

  const goToNext = useCallback(() => {
    if (isTransitioning.current) return;
    if (currentSlide < totalSlides - 1) {
      isTransitioning.current = true;
      setDirection(1);
      setCurrentSlide((prev) => prev + 1);
      setProgress(0);
      // Reset transition lock after animation
      setTimeout(() => {
        isTransitioning.current = false;
      }, 400);
    }
  }, [currentSlide, totalSlides]);

  const goToPrev = useCallback(() => {
    if (isTransitioning.current) return;
    if (currentSlide > 0) {
      isTransitioning.current = true;
      setDirection(-1);
      setCurrentSlide((prev) => prev - 1);
      setProgress(0);
      // Reset transition lock after animation
      setTimeout(() => {
        isTransitioning.current = false;
      }, 400);
    } else {
      // Restart current slide progress
      setProgress(0);
    }
  }, [currentSlide]);

  // Auto-advance timer - separate progress tracking from navigation
  useEffect(() => {
    // Don't auto-advance if paused or if this slide should not auto-advance
    if (isPaused || shouldPauseOnCurrentSlide) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / (autoAdvanceTime / 100));
        if (newProgress >= 100) {
          return 100; // Cap at 100, let the effect below handle navigation
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPaused, shouldPauseOnCurrentSlide, autoAdvanceTime, currentSlide]);

  // Handle auto-advance when progress reaches 100
  useEffect(() => {
    if (progress >= 100 && !isPaused && !shouldPauseOnCurrentSlide) {
      goToNext();
    }
  }, [progress, isPaused, shouldPauseOnCurrentSlide, goToNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goToNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrev();
      } else if (e.key === "Escape") {
        setIsPaused((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrev]);

  // Swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: goToNext,
    onSwipedRight: goToPrev,
    trackMouse: false,
    trackTouch: true,
    preventScrollOnSwipe: true,
  });

  // Tap zones
  const handleTap = (e: React.MouseEvent) => {
    const { clientX } = e;
    const screenWidth = window.innerWidth;
    const tapZone = screenWidth * 0.3;

    if (clientX < tapZone) {
      goToPrev();
    } else if (clientX > screenWidth - tapZone) {
      goToNext();
    } else {
      // Center tap - toggle pause (only if not on a pause slide)
      if (!shouldPauseOnCurrentSlide) {
        setIsPaused((prev) => !prev);
      }
    }
  };

  // Animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  return (
    <div
      {...handlers}
      onClick={handleTap}
      className="fixed inset-0 bg-slate-900 overflow-hidden cursor-pointer select-none"
      onMouseDown={() => !shouldPauseOnCurrentSlide && setIsPaused(true)}
      onMouseUp={() => !shouldPauseOnCurrentSlide && setIsPaused(false)}
      onTouchStart={() => !shouldPauseOnCurrentSlide && setIsPaused(true)}
      onTouchEnd={() => !shouldPauseOnCurrentSlide && setIsPaused(false)}
    >
      {/* Progress Bar */}
      <ProgressBar
        total={totalSlides}
        current={currentSlide}
        progress={shouldPauseOnCurrentSlide ? 100 : progress}
      />

      {/* Slides */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="absolute inset-0"
        >
          {children[currentSlide]}
        </motion.div>
      </AnimatePresence>

      {/* Pause indicator (only show when not on a pause slide) */}
      <AnimatePresence>
        {isPaused && !shouldPauseOnCurrentSlide && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center z-40 pointer-events-none"
          >
            <div className="bg-black/50 rounded-full p-6">
              <svg
                className="w-12 h-12 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation hint (only on first slide) */}
      {currentSlide === 0 && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 0.5 }}
          className="fixed bottom-8 left-0 right-0 z-40 text-white/40 text-xs text-center"
        >
          Apasă pentru a continua →
        </motion.p>
      )}

     

      {/* Slide counter */}
      <div className="fixed bottom-4 right-4 z-40 text-white/40 text-xs font-mono">
        {currentSlide + 1} / {totalSlides}
      </div>
    </div>
  );
}
