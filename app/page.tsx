"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FaqSection from "@/components/FaqSection";
import Hero from "@/components/Hero";
import Activities from "@/components/Activities";
import WhyAttend from "@/components/WhyAttend";
import ProgramSection from "@/components/ProgramSection";
import Locatie from "@/components/Locatie";
import Galerie from "@/components/Galerie";
import AboutSection from "@/components/AboutSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Activities />
      <WhyAttend />
      <ProgramSection />
      <Locatie />
      <Galerie />
      <AboutSection />
      <FaqSection />
      <Footer />
    </main>
  );
}
