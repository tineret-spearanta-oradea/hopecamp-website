import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function WhyAttend() {
  const features = [
    {
      icon: "bi-heart-fill",
      title: "RELAȚII AUTENTICE",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      icon: "bi-link-45deg",
      title: "DECONECTARE DIGITALĂ",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      icon: "bi-music-note-beamed",
      title: "APROPIERE SPIRITUALĂ",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      icon: "bi-emoji-smile-fill",
      title: "VOIE BUNĂ",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
  ];

  return (
    <>
      <section className="bg-white py-16 sm:py-24">
        <div className="container mx-auto flex flex-col lg:flex-row items-start gap-10 lg:gap-16">
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-start">
            <h4 className="text-sm uppercase text-muted-foreground font-semibold tracking-wider mb-2">
              VINO ȘI TU!
            </h4>
            <h2 className="font-lemon text-3xl sm:text-4xl md:text-5xl text-primary mb-6">
              DE CE SĂ VII?
            </h2>
            <p className="font-inter text-foreground mb-8 max-w-lg">
              Fiecare tabără are jocuri și mâncare bună, dar noi vrem să-ți
              oferim mai mult decât atât. Aici nu vei doar să te distrezi, ci să
              te (re)conectezi cu Dumnezeu, cu tine și cu oameni faini. Am
              pregătit un loc unde râdem mult, ne aprindem spiritele artistic,
              descoperim lucruri reale despre noi și despre credință, și ne
              bucurăm împreună!
            </p>
            <div className="flex">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                asChild
              >
                <Link href="/inscrie-te">Înscrie-te</Link>
              </Button>
            </div>
          </div>
          <div className="w-full lg:w-1/2 grid grid-cols-1 gap-4">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-primary text-primary-foreground border-none shadow-md"
              >
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <i className={`bi ${feature.icon} text-2xl`}></i>
                  <CardTitle className="text-lg font-semibold">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pl-12">
                  <p className="text-base font-light opacity-90">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
