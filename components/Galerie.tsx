"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Masonry from "react-masonry-css";
import { contactInfo } from "@/lib/constants";

export default function Galerie() {
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 2,
  };

  return (
    <>
      {/* Gallery Section */}
      <section className="bg-white py-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between pb-12 gap-4">
            <h2 className="text-primary text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-lemon">
              Galerie
            </h2>
            <Button variant="default" asChild>
              <Link href="/galerie">Galerie Completă</Link>
            </Button>
          </div>

          <style jsx global>{`
            .my-masonry-grid {
              display: flex;
              width: auto;
              gap: 16px;
            }
            .my-masonry-grid_column {
              padding-left: 0px; /* gutter size */
              background-clip: padding-box;
            }
            .my-masonry-grid_column > div {
              margin-bottom: 16px;
            }
          `}</style>

          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            <div>
              <Image
                src="/assets/images/wintercamp/wc1-1.png"
                alt="Winter Camp Photo 1"
                width={600}
                height={400}
                className="w-full rounded-lg object-cover transition-transform hover:scale-105"
              />
            </div>
            <div>
              <Image
                src="/assets/images/wintercamp/Day2-5.jpg"
                alt="Winter Camp Photo 3"
                width={600}
                height={400}
                className="w-full rounded-lg object-cover transition-transform hover:scale-105"
              />
            </div>
            <div>
              <Image
                src="/assets/images/wintercamp/Day1-51.jpg"
                alt="Winter Camp Photo 2"
                width={600}
                height={400}
                className="w-full rounded-lg object-cover transition-transform hover:scale-105"
              />
            </div>
            <div>
              <Image
                src="/assets/images/wintercamp/Day2-17.jpg"
                alt="Winter Camp Photo 4"
                width={600}
                height={400}
                className="w-full rounded-lg object-cover transition-transform hover:scale-105"
              />
            </div>
            <div>
              <Image
                src="/assets/images/wintercamp/wc1-2.png"
                alt="Winter Camp Photo 5"
                width={600}
                height={400}
                className="w-full rounded-lg object-cover transition-transform hover:scale-105"
              />
            </div>
            <div>
              <Image
                src="/assets/images/wintercamp/wc1-3.png"
                alt="Winter Camp Photo 6"
                width={600}
                height={400}
                className="w-full rounded-lg object-cover transition-transform hover:scale-105"
              />
            </div>
            <div>
              <Image
                src="/assets/images/wintercamp/Day2-26.jpg"
                alt="Winter Camp Photo 7"
                width={600}
                height={400}
                className="w-full rounded-lg object-cover transition-transform hover:scale-105"
              />
            </div>
            <div>
              <Image
                src="/assets/images/wintercamp/Day2-28.jpg"
                alt="Winter Camp Photo 8"
                width={600}
                height={400}
                className="w-full rounded-lg object-cover transition-transform hover:scale-105"
              />
            </div>
          </Masonry>
        </div>
      </section>
    </>
  );
}
