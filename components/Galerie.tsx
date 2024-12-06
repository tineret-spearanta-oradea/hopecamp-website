import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Galerie() {
  return (
    <>
      {/* Gallery Section */}
      <section className="py-32">
        <div className="container mx-auto ">
          <h2 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-lemon text-hope-darkcyan mb-8">
            Galerie
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Image
              src="/assets/images/gallery/DSC_6819.jpg"
              alt="Hope Camp Photo 1"
              width={600}
              height={400}
              className="w-full h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72 rounded-lg object-cover transition-transform hover:scale-105"
            />
            <Image
              src="/assets/images/gallery/DSC09815.jpg"
              alt="Hope Camp Photo 2"
              width={600}
              height={400}
              className="w-full h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72 rounded-lg object-cover transition-transform hover:scale-105"
            />
            <Image
              src="/assets/images/gallery/DSC09865.jpg"
              alt="Hope Camp Photo 3"
              width={600}
              height={400}
              className="w-full h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72 rounded-lg object-cover transition-transform hover:scale-105"
            />
            <Image
              src="/assets/images/gallery/HC2.jpg"
              alt="Hope Camp Photo 4"
              width={600}
              height={400}
              className="w-full h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72 rounded-lg object-cover transition-transform hover:scale-105"
            />
            <Image
              src="/assets/images/gallery/HC3.jpg"
              alt="Hope Camp Photo 5"
              width={600}
              height={400}
              className="w-full h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72 rounded-lg object-cover transition-transform hover:scale-105"
            />
            <Image
              src="/assets/images/gallery/HC4.jpg"
              alt="Hope Camp Photo 6"
              width={600}
              height={400}
              className="w-full h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72 rounded-lg object-cover transition-transform hover:scale-105"
            />
            <Image
              src="/assets/images/gallery/ZVE02847.jpg"
              alt="Hope Camp Photo 7"
              width={600}
              height={400}
              className="w-full h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72 rounded-lg object-cover transition-transform hover:scale-105"
            />
            <Image
              src="/assets/images/gallery/ZVE03429.jpg"
              alt="Hope Camp Photo 8"
              width={600}
              height={400}
              className="w-full h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72 rounded-lg object-cover transition-transform hover:scale-105"
            />
          </div>

          <div className="flex justify-center mt-8">
            <Button variant="default">Vezi Galerie</Button>
          </div>
        </div>
      </section>
    </>
  );
}
