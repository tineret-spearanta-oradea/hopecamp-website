"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FaqSection from "@/components/FaqSection";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Locatie from "@/components/Locatie";
import Galerie from "@/components/Galerie";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero></Hero>
      <About></About>
      <Locatie></Locatie>
      <Galerie></Galerie>
      <FaqSection />
      <Footer />
    </main>
  );
}
