"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Instagram, Play } from "lucide-react";

export default function VideoSection() {
  return (
    <section className="relative bg-gradient-to-b from-[#0d2847] via-[#1a3a5c] to-[#0d2847] py-20 sm:py-28 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Aurora glows */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[300px] bg-gradient-to-b from-cyan-500/15 via-blue-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[250px] bg-gradient-to-t from-purple-500/10 via-cyan-500/5 to-transparent rounded-full blur-3xl" />

        {/* Ice crystals */}
        <div className="absolute top-[20%] left-[8%] w-3 h-3 bg-white/15 rotate-45 animate-float-slow" />
        <div className="absolute bottom-[30%] right-[10%] w-2.5 h-2.5 bg-cyan-300/20 rotate-45 animate-drift animation-delay-500" />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Section Header */}
        <div className="mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
            <span className="text-cyan-200 text-sm font-medium tracking-wider uppercase">
              Vezi experiența
            </span>
            <Play className="w-3 h-3 text-cyan-300" />
          </div>
          <h2 className="font-poppins font-bold text-3xl sm:text-4xl md:text-5xl text-white mb-4">
            <span className="text-ice">Experiența</span>{" "}
            <span className="text-white/90">HopeCamp</span>
          </h2>
        </div>

        {/* YouTube Video Container with Glass Frame */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="glass-card rounded-3xl p-3 sm:p-4 ice-glow">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/POM5iyjIf9g?si=VqTiG3xSxe2kv5QD"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="absolute inset-0"
              />
            </div>
          </div>
        </div>

        {/* Instagram Reels Link */}
        <div className="flex flex-col items-center gap-4">
          <Button
            size="lg"
            asChild
            className="group bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-400 hover:via-pink-400 hover:to-orange-400 text-white border-0 shadow-lg shadow-purple-500/25 hover:shadow-pink-400/40 transition-all duration-300 hover:scale-105 rounded-xl"
          >
            <Link
              href="https://www.instagram.com/tineret_speranta_oradea/reels/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Instagram className="h-5 w-5" />
              <span>Vezi reels din tabără</span>
              <Play className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Bottom wave transition */}
      <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none">
        <svg
          className="absolute bottom-0 left-0 right-0 w-full h-full"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
        >
          <path
            d="M0,40 C480,80 960,0 1440,50 L1440,80 L0,80 Z"
            fill="rgba(240, 247, 255, 1)"
          />
        </svg>
      </div>
    </section>
  );
}
