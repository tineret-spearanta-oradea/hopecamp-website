"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function WhyAttend() {
  const features = [
    {
      icon: "/assets/svgs/relatii-autentice.svg",
      title: "Relații Autentice",
      description: "Leagă relații autentice, care țin o viață întreagă.",
      offset: "lg:translate-y-0",
    },
    {
      icon: "/assets/svgs/deconectare-digitala.svg",
      title: "Deconectare Digitală",
      description: "Ia o pauză de la ecrane, bucură-te de natură.",
      offset: "lg:translate-y-8",
    },
    {
      icon: "/assets/svgs/apropiere-spirituala.svg",
      title: "Apropiere Spirituală",
      description: "Întărește-ți relația cu Dumnezeu și descoperă-ți darurile.",
      offset: "lg:translate-y-4",
    },
    {
      icon: "/assets/svgs/voie-buna.svg",
      title: "Voie Bună",
      description: "Distracție, voie bună și amintiri de neuitat.",
      offset: "lg:translate-y-12",
    },
  ];

  return (
    <section className="relative bg-gradient-to-b from-[#0d2847] via-[#1a3a5c] to-[#0d2847] py-20 sm:py-32 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Aurora glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-cyan-500/20 via-blue-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[300px] bg-gradient-to-tl from-purple-500/10 via-cyan-500/5 to-transparent rounded-full blur-3xl" />

        {/* Floating ice crystals */}
        <div className="absolute top-[15%] left-[8%] w-4 h-4 bg-white/10 rotate-45 animate-float-slow" />
        <div className="absolute top-[30%] right-[12%] w-3 h-3 bg-cyan-300/20 rotate-45 animate-drift animation-delay-500" />
        <div className="absolute bottom-[20%] left-[20%] w-2.5 h-2.5 bg-white/15 rotate-45 animate-float animation-delay-300" />
        <div className="absolute top-[60%] right-[8%] w-3 h-3 bg-cyan-200/15 rotate-45 animate-float-slow animation-delay-700" />

        {/* Connecting lines (ice paths) */}
        <svg className="absolute inset-0 w-full h-full opacity-10 hidden lg:block" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ice-path" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="rgba(200, 230, 255, 0.5)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path
            d="M 10% 30% Q 30% 35% 50% 25% T 90% 40%"
            stroke="url(#ice-path)"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M 10% 60% Q 40% 55% 60% 65% T 90% 55%"
            stroke="url(#ice-path)"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-16">
          {/* Left content */}
          <div className="w-full lg:w-2/5 lg:sticky lg:top-32">
            <div className="glass-card rounded-3xl p-8 sm:p-10 ice-glow">
              <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6">
                <span className="text-cyan-200 text-sm font-medium tracking-wider uppercase">
                  De ce noi?
                </span>
                <span className="w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse" />
              </div>

              <h2 className="font-poppins font-bold text-3xl sm:text-4xl md:text-5xl text-white mb-6 leading-tight">
                <span className="text-ice">De ce să vii</span>
                <br />
                <span className="text-white/90">la HopeCamp?</span>
              </h2>

              <p className="font-nunito text-white/70 mb-8 leading-relaxed">
                Fiecare tabără are jocuri și mâncare bună, dar noi vrem să-ți
                oferim mai mult decât atât. Aici nu vii doar să te distrezi, ci să
                te (re)conectezi cu Dumnezeu, cu tine și cu oameni faini.
              </p>

              <Button
                size="lg"
                asChild
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 transition-all duration-300 hover:scale-105 rounded-xl"
              >
                <Link href="/inscrie-te" className="flex items-center gap-2">
                  <span>Înscrie-te acum</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </Button>
            </div>
          </div>

          {/* Right - Floating feature cards */}
          <div className="w-full lg:w-1/2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`
                    glass-card rounded-2xl p-6 group
                    transform transition-all duration-300 hover:scale-[1.02]
                    ${feature.offset}
                  `}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl glass flex items-center justify-center mb-4 transition-all">
                    <Image
                      src={feature.icon}
                      alt={feature.title}
                      width={32}
                      height={32}
                      className="object-contain brightness-0 invert opacity-80 transition-opacity"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="font-poppins font-bold text-lg text-white mb-2 transition-colors">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="font-nunito text-sm text-white/60 transition-colors leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave transition */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none">
        <svg
          className="absolute bottom-0 left-0 right-0 w-full h-full"
          viewBox="0 0 1440 96"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="why-wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(240, 247, 255, 0.95)" />
              <stop offset="50%" stopColor="rgba(220, 240, 255, 1)" />
              <stop offset="100%" stopColor="rgba(240, 247, 255, 0.95)" />
            </linearGradient>
          </defs>
          <path
            d="M0,64 C360,96 720,32 1080,64 C1260,80 1380,48 1440,56 L1440,96 L0,96 Z"
            fill="url(#why-wave-gradient)"
          />
        </svg>
      </div>
    </section>
  );
}
