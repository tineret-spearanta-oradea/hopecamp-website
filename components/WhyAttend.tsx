import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function WhyAttend() {
 const features = [
  {
    icon: "/assets/svgs/relatii-autentice.svg", // Elimină "public/"
    title: "RELAȚII AUTENTICE",
    description: "Leagă relații autentice, care țin o viață întreagă.",
  },
  {
    icon: "/assets/svgs/deconectare-digitala.svg",
    title: "DECONECTARE DIGITALĂ",
    description: "Ia o pauză de la ecrane, bucură-te de natură.",
  },
  {
    icon: "/assets/svgs/apropiere-spirituala.svg",
    title: "APROPIERE SPIRITUALĂ",
    description: "Întărește-ți relația cu Dumnezeu și descoperă-ți darurile.",
  },
  {
    icon: "/assets/svgs/voie-buna.svg",
    title: "VOIE BUNĂ",
    description: "Distracție, voie bună și amintiri de neuitat.",
  },
];

  return (
    <>
      <section className="bg-gradient-to-b from-white via-secondary/30 to-white py-16 sm:py-24 border-y-2 border-primary/20">
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16">
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-start">
            <h4 className="font-jersey text-sm uppercase text-primary/70 font-semibold tracking-wider mb-2 relative">
              <span className="relative z-10">✨ VINO ȘI TU! ✨</span>
            </h4>
            <h2 className="font-poppins font-bold text-3xl sm:text-4xl md:text-5xl text-primary mb-6 drop-shadow-sm relative">
              <span className="relative z-10">DE CE SĂ VII?</span>
            </h2>
            <p className="font-nunito mb-8">
              Fiecare tabără are jocuri și mâncare bună, dar noi vrem să-ți
              oferim mai mult decât atât. Aici nu vii doar să te distrezi, ci să
              te (re)conectezi cu Dumnezeu, cu tine și cu oameni faini. Am
              pregătit un loc unde râdem mult, ne aprindem spiritele artistic,
              descoperim lucruri reale despre noi și despre credință, și ne
              bucurăm împreună!
            </p>
            <div className="flex">
              <Button variant="default" size="lg" asChild>
                <Link href="/inscrie-te">Înscrie-te</Link>
              </Button>
            </div>
          </div>
          <div className="w-full flex flex-col gap-4 max-w-lg">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-primary text-white shadow-xl rounded-lg p-4 flex items-center gap-4 border-2 border-white/30 ring-1 ring-primary/50 transition-all hover:shadow-2xl hover:scale-[1.02] hover:border-white/50 relative overflow-hidden group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                {/* SVG Image */}
                <div className="flex-shrink-0">
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>

                {/* Title and Description */}
                <div className="flex flex-col">
                  <h3 className="font-jersey text-xl font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-base font-light">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
