"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FaqSection from "@/components/FaqSection";
import Hero from "@/components/Hero";
import Activities from "@/components/Activities";
import WhyAttend from "@/components/WhyAttend";
import ProgramSection from "@/components/ProgramSection";
import Locatie from "@/components/Locatie";
import VideoSection from "@/components/VideoSection";
import Galerie from "@/components/Galerie";
import AboutSection from "@/components/AboutSection";
import CampInProgressPopup from "@/components/CampInProgressPopup";
import { IcyWaveDivider } from "@/components/ui/IcyWaveDivider";

export default function Home() {
  return (
    <main className="min-h-screen bg-frost-light">
      <CampInProgressPopup />
      <Navbar />
      <Hero />
      <div className="relative">
        <Activities />
        {/* Transition: Light → Dark (WhyAttend) */}
        <IcyWaveDivider variant="bottom" toDark withGlow={false} className="absolute bottom-0 left-0 right-0" />
      </div>
      <WhyAttend />
      {/* WhyAttend has built-in wave transition to light */}
      <div className="relative">
        <Locatie />
        {/* Transition: Light → Dark (VideoSection) */}
        <IcyWaveDivider variant="bottom" toDark withGlow={false} className="absolute bottom-0 left-0 right-0" />
      </div>
      <VideoSection />
      {/* VideoSection has built-in wave transition to light */}
      <div className="relative">
        <Galerie />
        {/* Transition: Light → Dark (AboutSection) */}
        <IcyWaveDivider variant="bottom" toDark withGlow={false} className="absolute bottom-0 left-0 right-0" />
      </div>
      <AboutSection />
      {/* AboutSection contains About (dark) + Contact (white), now transition to dark FAQ */}
      <IcyWaveDivider variant="bottom" toDark withGlow={false} relative />
      <FaqSection />
      <Footer />
    </main>
  );
}
