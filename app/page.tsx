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

export default function Home() {
  return (
    <main className="min-h-screen">
      <CampInProgressPopup />
      <Navbar />
      <Hero />
      <Activities />
      <WhyAttend />
      <ProgramSection />
      <Locatie />
      <VideoSection />
      <Galerie />
      <AboutSection />
      <FaqSection />
      <Footer />
    </main>
  );
}
