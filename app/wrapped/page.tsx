"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WrappedContainer from "./components/WrappedContainer";
import Particles from "./components/animations/Particles";
import DesktopWarning from "./components/DesktopWarning";
import IntroSlide from "./components/slides/IntroSlide";
import CommunitySlide from "./components/slides/CommunitySlide";
import GallerySlide from "./components/slides/GallerySlide";
import UniteSlide from "./components/slides/UniteSlide";
import MinistryStatsSlide from "./components/slides/MinistryStatsSlide";
import DepartmentsSlide from "./components/slides/DepartmentsSlide";
import TopicsSlide from "./components/slides/TopicsSlide";
import AdventuresSlide from "./components/slides/AdventuresSlide";
import HopeCampSlide from "./components/slides/HopeCampSlide";
import CitiesSlide from "./components/slides/CitiesSlide";
import HopeCampGallerySlideOne from "./components/slides/HopeCampGallerySlideOne";
import HopeCampGallerySlideTwo from "./components/slides/HopeCampGallerySlideTwo";
import ThemesSlide from "./components/slides/ThemesSlide";
import OutroSlide from "./components/slides/OutroSlide";
import UniteIntroSlide from "./components/slides/UniteIntroSlide";
import MinistryIntroSlide from "./components/slides/MinistryIntroSlide";
import DepartmentsIntroSlide from "./components/slides/DepartmentsIntroSlide";
import SocialProjectSlide from "./components/slides/SocialProjectSlide";
import LeadersSlide from "./components/slides/LeadersSlide";
import AdventuresIntroSlide from "./components/slides/AdventuresIntroSlide";
import QuizIntroSlide from "./components/slides/QuizIntroSlide";

// Slide indices (0-based):
// 0 - IntroSlide
// 1 - CommunitySlide
// 2 - GallerySlide (images 2 & 4)
// 3 - UniteIntroSlide
// 4 - UniteSlide
// 5 - MinistryIntroSlide
// 6 - MinistryStatsSlide
// 7 - SocialProjectSlide
// 8 - DepartmentsIntroSlide
// 9 - DepartmentsSlide
// 10 - LeadersSlide
// 11 - AdventuresIntroSlide
// 12 - AdventuresSlide
// 13 - HopeCampSlide
// 14 - CitiesSlide (21 cities)
// 15 - HopeCampGallerySlideOne
// 16 - HopeCampGallerySlideTwo
// 17 - QuizIntroSlide
// 18 - ThemesSlide (Quiz - should pause)
// 19 - TopicsSlide
// 20 - OutroSlide

const INTRO_SLIDE_INDEX = 0;
const QUIZ_SLIDE_INDEX = 18;

export default function WrappedPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Brief loading for assets
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="fixed inset-0 bg-slate-900 overflow-hidden">
      {/* Desktop Warning */}
      <DesktopWarning />

      {/* Particles Background (always visible) */}
      <Particles />

      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900 flex items-center justify-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-16 h-16 rounded-full border-4 border-purple-500/30 border-t-purple-500"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Wrapped Experience - starts immediately after loading */}
      {!isLoading && (
        <WrappedContainer
          autoAdvanceTime={7000}
          pauseOnSlides={[INTRO_SLIDE_INDEX, QUIZ_SLIDE_INDEX]}
        >
          <IntroSlide />
          <CommunitySlide />
          <GallerySlide />
          <UniteIntroSlide />
          <UniteSlide />
          <MinistryIntroSlide />
          <MinistryStatsSlide />
          <SocialProjectSlide />
          <DepartmentsIntroSlide />
          <DepartmentsSlide />
          <LeadersSlide />
          <AdventuresIntroSlide />
          <AdventuresSlide />
          <HopeCampSlide />
          <CitiesSlide />
          <HopeCampGallerySlideOne />
          <HopeCampGallerySlideTwo />
          <QuizIntroSlide />
          <ThemesSlide />
          <TopicsSlide />
          <OutroSlide />
        </WrappedContainer>
      )}
    </main>
  );
}
