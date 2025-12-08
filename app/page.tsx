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
      <Activities />
      {/* Transition: Light → Dark (WhyAttend) */}
      <IcyWaveDivider variant="top" toDark relative className="-mt-20" />
      <WhyAttend />
      {/* WhyAttend has built-in wave transition to light */}
      <ProgramSection />
      <Locatie />
      {/* Transition: Light → Dark (VideoSection) */}
      <IcyWaveDivider variant="top" toDark relative className="-mt-20" />
      <VideoSection />
      {/* VideoSection has built-in wave transition to light */}
      <Galerie />
      {/* Transition: Light → Dark (AboutSection) */}
      <IcyWaveDivider variant="top" toDark relative className="-mt-20" />
      <AboutSection />
      {/* AboutSection flows directly to dark FaqSection */}
      <FaqSection />
      <Footer />
    </main>
  );
}
