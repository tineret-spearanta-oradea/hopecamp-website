"use client";

import Image from "next/image";

export default function WhyAttend() {
  const features = [
    {
      icon: "🤝",
      title: "Relatii Autentice",
      description: "Leaga relatii autentice, care tin o viata intreaga.",
      image: "/assets/images/hopecamp/gratiadei/compressed/gratiadei-1.jpg",
    },
    {
      icon: "📵",
      title: "Deconectare Digitala",
      description: "Ia o pauza de la ecrane, bucura-te de natura.",
      image: "/assets/images/hopecamp/gratiadei/compressed/gratiadei-15.jpg",
    },
    {
      icon: "🙏",
      title: "Apropiere Spirituala",
      description: "Intareste-ti relatia cu Dumnezeu si descopera-ti darurile.",
      image: "/assets/images/hopecamp/gratiadei/compressed/gratiadei-8.jpg",
    },
    {
      icon: "🎉",
      title: "Voie Buna",
      description: "Distractie, voie buna si amintiri de neuitat.",
      image: "/assets/images/hopecamp/gratiadei/compressed/gratiadei-16.jpg",
    },
  ];

  return (
    <section className="py-20 sm:py-28 px-6 sm:px-12 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-archivo text-4xl sm:text-5xl uppercase tracking-tight text-[#1a1a1a]">
            De ce HopeCamp?
          </h2>
          <div className="w-28 h-2 bg-[#FFD600] mx-auto mt-3 rounded-sm -rotate-1" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="border-2 border-gray-100 p-6 transition-all hover:border-[#1a1a1a] hover:-translate-y-1 group"
            >
              <span className="text-3xl block mb-3">{feature.icon}</span>
              <h3 className="font-archivo text-base uppercase tracking-tight text-[#1a1a1a] mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-5">
                {feature.description}
              </p>
              <div className="relative w-full h-32 overflow-hidden">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  style={{ objectFit: "cover" }}
                  className="group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
