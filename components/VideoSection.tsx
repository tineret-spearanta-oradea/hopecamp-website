"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Instagram, Play } from "lucide-react";

export default function VideoSection() {
  return (
    <section className="bg-gradient-to-b from-primary via-primary/95 to-primary py-16 sm:py-24 border-t-4 border-white/30">
      <div className="container mx-auto px-4 text-center">
        {/* Section Title */}
        <h3 className="font-poppins font-bold uppercase text-white text-3xl tracking-wider mb-10 sm:mb-16 drop-shadow-lg relative">
          <span className="relative z-10">🎬 EXPERIENȚA HOPECAMP 🎬</span>
        </h3>

        {/* YouTube Video Container */}
        <div className="max-w-4xl mx-auto mb-10 sm:mb-12">
          <div className="relative w-full aspect-[21/9] rounded-lg overflow-hidden shadow-2xl border-2 border-white/30 ring-1 ring-white/20">
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

        {/* Instagram Reels Link */}
        <div className="flex flex-col items-center gap-4">
          <Button
            variant="default"
            size="lg"
            asChild
            className="group bg-gradient-to-r from-purple-500 to-pink-500 hover:text-white transition-all duration-300"
          >
            <Link
              href="https://www.instagram.com/tineret_speranta_oradea/reels/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Instagram className="h-5 w-5 group-hover:animate-pulse" />
              Vezi reels din tabără
              <Play className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
