import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <>
      <section className="bg-white py-16 sm:py-32">
        <div className="container mx-auto  flex flex-col-reverse lg:flex-row-reverse items-stretch gap-10">
          <div className="w-full text-primary text-center md:text-start lg:w-1/2 flex flex-col justify-between">
            <div className="flex flex-col items-center lg:items-start gap-5">
              <h4 className="text-sm uppercase text-secondary font-inter">
                despre noi
              </h4>
              <h2 className="font-lemon text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
                Cine e în spatele cortinei?
              </h2>
              <p className="font-inter text-center lg:text-start">
                Suntem o comunitate prietenoasă cu impact în Oradea, punând
                accentul pe conducerea tinerilor de la întâlnirea personală spre
                o relație autentică în Hristos. Noi creăm un mediu plăcut
                tinerilor pentru distracție și socializare, dar și un spațiu
                propice pentru închinare și cunoașterea lui Dumnezeu! Lucrăm cu
                drag și entuziasm pentru a oferi experiențe memorabile unde
                fiecare se simte acasă. Aici, fiecare este binevenit și
                contribuie la o atmosferă plăcută.
              </p>
            </div>
            <div className="bg-primary flex items-center justify-between rounded-lg p-5 mt-5">
              <p className="text-white font-inter text-xl">
                Fă parte din comunitatea noastră!
              </p>
              <Button variant="default" asChild>
                <a href="https://linktr.ee/tineretsperantaoradea">
                  Conectează-te
                </a>
              </Button>
            </div>
          </div>
          <div className="w-full lg:w-1/2 h-auto">
            <Image
              src="/assets/images/gallery/ZVE03429.jpg"
              alt="Group photo from Hope Camp"
              width={800}
              height={600}
              className="rounded-lg shadow-lg w-full h-auto"
              priority
            />
          </div>
        </div>
      </section>
    </>
  );
}
