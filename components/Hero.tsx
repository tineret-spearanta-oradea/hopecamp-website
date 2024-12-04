import Link from "next/link";
import { Button } from "@/components/ui/button";

import Image from "next/image";

export default function Hero() {
  return (
    <>
      <section className="flex items-center justify-center  px-4 pt-20 pb-32">
        <div className="">
          <h1 className="text-5xl md:text-6xl font-bold text-hope-darkcyan">
            Hope Camp #5
          </h1>
          <p className="text-xl text-hope-orange">
            17-22 iulie @ Someșu Rece - Cluj
          </p>
          <p className="text-hope-darkcyan text-lg">
            Tabăra pe care nu vrei să o ratezi
          </p>
          <Button
            variant="default"
            className="bg-hope-orange hover:bg-hope-orange/90 text-white rounded-full px-8 py-6 text-lg mt-4"
            asChild
          >
            <Link
              href="https://drive.google.com/drive/u/1/folders/1eh_ifVkcLBtLQSwsrnO7iNoe1uyUpyj_"
              target="_blank"
            >
              GALERIE HC#5
            </Link>
          </Button>
          <p className="text-sm text-hope-darkcyan/80 mt-2">
            Apasă butonul de mai sus pentru a vedea galeria din tabără!
          </p>
        </div>
        <div className="lg:w-1/2 flex justify-center">
              <div className="w-full max-w-xl">
                <Image
                  src="/assets/images/gallery/ZVE03429.jpg"
                  alt="Group photo from Hope Camp"
                  width={600}
                  height={400}
                  className="rounded-lg w-full h-auto object-cover shadow-lg"
                  priority
                />
              </div>
            </div>
      </section>

      <section className="bg-white">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2 max-w-2xl">
              <h2 className="text-4xl font-bold text-hope-darkcyan mb-6">
                Despre noi
              </h2>
              <p className="text-hope-darkcyan text-lg leading-relaxed">
                Bine ai venit în comunitatea noastră de tineri pasionați și
                plini de energie. Suntem echipa taberei creștine Hope Camp din
                cadrul Tineret Speranța Oradea, alcătuită din tineri din diverse
                biserici locale. 🙏
                <br />
                <br />
                Noi creăm un mediu plăcut tinerilor pentru distracție și
                socializare, dar și un spațiu propice pentru închinare și
                cunoașterea lui Dumnezeu! Lucrăm cu drag și entuziasm pentru a
                oferi experiențe memorabile unde fiecare se simte acasă. Aici,
                fiecare este binevenit și contribuie la o atmosferă plăcută.
                <br />
                <br />
                Scopul nostru este ca tinerii să aibă o experiență personală și
                autentică cu Dumnezeu, să-L aleagă pe Hristos ca Domn al vieții
                personale și să crească spiritual prin ucenicie. Te așteptăm să
                ni te alături și să creăm împreună amintiri frumoase și momente
                spirituale de neuitat!🌟
              </p>
            </div>
            
          </div>
        </div>
      </section>
    </>
  );
}
