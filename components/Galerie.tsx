"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Galerie() {
  const images = [
    "/assets/images/hopecamp/gratiadei/ELI00154.jpg",
    "/assets/images/hopecamp/gratiadei/ELI05180.jpg",
    "/assets/images/hopecamp/gratiadei/ELI03933.jpg",
    "/assets/images/hopecamp/gratiadei/ELI03065.jpg",
    "/assets/images/hopecamp/gratiadei/ELI02865.jpg",
    "/assets/images/hopecamp/gratiadei/ELI03745.jpg",
    "/assets/images/hopecamp/gratiadei/ELI02036.jpg",
    "/assets/images/hopecamp/gratiadei/ELI09793.jpg",
    "/assets/images/hopecamp/gratiadei/ELI09640.jpg",
    "/assets/images/hopecamp/gratiadei/ELI00180.jpg",
  ];

  return (
    <>
      {/* Gallery Section - Updated background and padding */}
      <section className="bg-gradient-to-b from-secondary via-white to-secondary py-16 sm:py-24 border-y-2 border-primary/20" id="galerie">
        <div className="container mx-auto px-4 text-center">
          {/* Updated title styling */}
          <h3 className="font-poppins font-bold uppercase text-primary text-3xl tracking-wider mb-10 sm:mb-16 drop-shadow-sm relative">
            <span className="relative z-10">📸 GALERIE 📸</span>
          </h3>

          {/* Simple Image Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-10 sm:mb-16">
            {images.map((src, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-lg shadow-xl aspect-square border-2 border-primary/20 ring-1 ring-primary/10 transition-all hover:scale-105 hover:shadow-2xl hover:border-primary/40 hover:ring-2 hover:ring-primary/30 group relative"
              >
                <Image
                  loading="lazy"
                  src={src}
                  alt={`Galerie imagine ${index + 1}`}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-300 ease-in-out"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>

          {/* Updated Button */}
          {/* <Button
            variant="default"
            size="lg"
            asChild
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Link href="/galerie">Vezi toată galeria</Link>
          </Button> */}
            <Button
            variant="default"
            size="lg"
            asChild
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Link href="https://princessphoto-ro.wfolio.pro/disk/hope-camp-f9tz0m">Vezi toate pozele</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
