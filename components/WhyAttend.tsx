import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function WhyAttend() {
 const features = [
  {
    icon: "/assets/svgs/relatii-autentice.svg", // Elimină "public/"
    title: "RELAȚII AUTENTICE",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    icon: "/assets/svgs/deconectare-digitala.svg",
    title: "DECONECTARE DIGITALĂ",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    icon: "/assets/svgs/apropiere-spirituala.svg",
    title: "APROPIERE SPIRITUALĂ",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    icon: "/assets/svgs/voie-buna.svg",
    title: "VOIE BUNĂ",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
];

  return (
    <>
      <section className="bg-white py-16 sm:py-24">
        <div className="container mx-auto flex flex-col lg:flex-row items-start gap-10 lg:gap-16">
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-start">
            <h4 className="font-jersey text-sm uppercase text-muted-foreground font-semibold tracking-wider mb-2">
              VINO ȘI TU!
            </h4>
            <h2 className="font-poppins font-bold text-3xl sm:text-4xl md:text-5xl text-primary mb-6">
              DE CE SĂ VII?
            </h2>
            <p className="font-nunito text-foreground mb-8 max-w-lg">
              Fiecare tabără are jocuri și mâncare bună, dar noi vrem să-ți
              oferim mai mult decât atât. Aici nu vei doar să te distrezi, ci să
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
          <div className="w-full lg:w-1/2 grid grid-cols-1 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-primary text-primary-foreground border-none shadow-md rounded-lg p-4 flex items-center gap-4"
              >
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
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-base font-light opacity-90">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
