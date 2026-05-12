"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FaqSection from "@/components/FaqSection";
import Hero from "@/components/Hero";
import Activities from "@/components/Activities";
import WhyAttend from "@/components/WhyAttend";
import Locatie from "@/components/Locatie";
import VideoSection from "@/components/VideoSection";
import Galerie from "@/components/Galerie";
import AboutSection from "@/components/AboutSection";
import CampInProgressPopup from "@/components/CampInProgressPopup";
import CountdownTimer from "@/components/CountdownTimer";
import TemporaryHero from "@/components/TemporaryHero";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <CampInProgressPopup />
      <Navbar />

      {/* <TemporaryHero /> */}
      
      <Hero /> 
      <CountdownTimer />
      <WhyAttend />
      <Activities />
      <Locatie />
      <VideoSection />
      <Galerie />
      <AboutSection />
      <FaqSection />
     

      <Footer />

    </main>
  );
}
