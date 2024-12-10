import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Galerie() {
  return (
    <>
      {/* Gallery Section */}
      <section className="bg-white py-32">
        <div className="container mx-auto">
          <div className="flex items-center justify-between pb-12">
            <h2 className="text-primary text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-lemon">
              Galerie
            </h2>
            <div className="flex justify-center mt-8">
              <Button variant="default">Galerie Completă</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Image
              src="/assets/images/wintercamp/Day1-17.jpg"
              alt="Winter Camp Photo 1"
              width={600}
              height={400}
              className="w-full h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72 rounded-lg object-cover transition-transform hover:scale-105"
            />
            <Image
              src="/assets/images/wintercamp/Day1-51.jpg"
              alt="Winter Camp Photo 2"
              width={600}
              height={400}
              className="w-full h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72 rounded-lg object-cover transition-transform hover:scale-105"
            />
            <Image
              src="/assets/images/wintercamp/Day2-5.jpg"
              alt="Winter Camp Photo 3"
              width={600}
              height={400}
              className="w-full h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72 rounded-lg object-cover transition-transform hover:scale-105"
            />
            <Image
              src="/assets/images/wintercamp/Day2-17.jpg"
              alt="Winter Camp Photo 4"
              width={600}
              height={400}
              className="w-full h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72 rounded-lg object-cover transition-transform hover:scale-105"
            />
            <Image
              src="/assets/images/wintercamp/Day2-24.jpg"
              alt="Winter Camp Photo 5"
              width={600}
              height={400}
              className="w-full h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72 rounded-lg object-cover transition-transform hover:scale-105"
            />
            <Image
              src="/assets/images/wintercamp/Day2-25.jpg"
              alt="Winter Camp Photo 6"
              width={600}
              height={400}
              className="w-full h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72 rounded-lg object-cover transition-transform hover:scale-105"
            />
            <Image
              src="/assets/images/wintercamp/Day2-26.jpg"
              alt="Winter Camp Photo 7"
              width={600}
              height={400}
              className="w-full h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72 rounded-lg object-cover transition-transform hover:scale-105"
            />
            <Image
              src="/assets/images/wintercamp/Day2-28.jpg"
              alt="Winter Camp Photo 8"
              width={600}
              height={400}
              className="w-full h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72 rounded-lg object-cover transition-transform hover:scale-105"
            />
          </div>
        </div>
      </section>
    </>
  );
}
