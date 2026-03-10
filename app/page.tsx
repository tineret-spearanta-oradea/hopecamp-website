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

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <CampInProgressPopup />
      <Navbar />
      <Hero />
      {/* Yellow stats bar right after hero photos */}
      <CountdownTimer />
      {/* White: Why cards */}
      <WhyAttend />
      {/* Dark: Activity photo cards */}
      <Activities />
      {/* Light gray: Location */}
      <Locatie />
      {/* Off-white: Video */}
      <VideoSection />
      {/* White: Gallery */}
      <Galerie />
      {/* White + gray: About & Contact */}
      <AboutSection />
      {/* Dark: FAQ */}
      <FaqSection />
      {/* Yellow + dark: Footer */}
      <Footer />
    </main>
  );
}
