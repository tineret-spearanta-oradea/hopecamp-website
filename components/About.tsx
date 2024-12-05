import Image from "next/image";

export default function About() {
  return (
    <>
      <section className="bg-[#F0F0F0] py-16 sm:py-32">
        <div className="container mx-auto flex flex-col-reverse md:flex-row items-center gap-10">
          <div className="w-full text-center md:text-start lg:w-1/2 flex flex-col gap-5 text-hope-darkcyan">
            <h2 className="font-lemon text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
              Despre noi
            </h2>
            <p>
              Suntem o comunitate prietenoasă cu impact în Oradea, punând
              accentul pe conducerea tinerilor de la întâlnirea personală spre o
              relație autentică în Hristos. Noi creăm un mediu plăcut tinerilor
              pentru distracție și socializare, dar și un spațiu propice pentru
              închinare și cunoașterea lui Dumnezeu! Lucrăm cu drag și entuziasm
              pentru a oferi experiențe memorabile unde fiecare se simte acasă.
              Aici, fiecare este binevenit și contribuie la o atmosferă plăcută.
            </p>
          </div>
          <div className="w-full lg:w-1/2 h-auto order-last md:order-first">
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
