"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Galerie() {
  const images = [
    "/assets/images/wintercamp/wc1-1.png",
    "/assets/images/wintercamp/Day2-5.jpg",
    "/assets/images/wintercamp/Day1-51.jpg",
    "/assets/images/wintercamp/Day2-17.jpg",
    "/assets/images/wintercamp/wc1-2.png",
    "/assets/images/wintercamp/wc1-3.png",
    "/assets/images/wintercamp/Day2-26.jpg",
    "/assets/images/wintercamp/Day2-28.jpg",
    "/assets/images/placeholder.jpg",
    "/assets/images/placeholder.jpg",
  ];

  return (
    <>
      {/* Gallery Section - Updated background and padding */}
      <section className="bg-secondary py-16 sm:py-24">
        <div className="container mx-auto px-4 text-center">
          {/* Updated title styling */}
          <h3 className="text-sm uppercase text-foreground font-semibold tracking-wider mb-10 sm:mb-16">
            GALERIE
          </h3>

          {/* Simple Image Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-10 sm:mb-16">
            {images.map((src, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-lg shadow-md aspect-square"
              >
                <Image
                  src={src}
                  alt={`Galerie imagine ${index + 1}`}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300 ease-in-out"
                />
              </div>
            ))}
          </div>

          {/* Updated Button */}
          <Button
            variant="default"
            size="lg"
            asChild
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Link href="/galerie">Vezi toată galeria</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
