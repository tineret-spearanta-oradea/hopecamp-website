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
  const [direction, setDirection] = useState(1); // 1 for next, -1 for prev
  const [isPaused, setIsPaused] = useState(false);
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
    }
    // Center tap does nothing
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
      style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none' }}
      onMouseDown={() => !shouldPauseOnCurrentSlide && setIsPaused(true)}
      onMouseUp={() => !shouldPauseOnCurrentSlide && setIsPaused(false)}
      onMouseLeave={() => !shouldPauseOnCurrentSlide && setIsPaused(false)}
      onTouchStart={(e) => {
        if (!shouldPauseOnCurrentSlide) setIsPaused(true);
      }}
      onTouchEnd={() => !shouldPauseOnCurrentSlide && setIsPaused(false)}
      onContextMenu={(e) => e.preventDefault()}
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
