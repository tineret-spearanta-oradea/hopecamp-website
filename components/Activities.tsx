"use client";

import Image from "next/image";

export default function Activities() {
  const activities = [
    {
      title: "Inchinare & Cuvant",
      time: "Dimineata",
      image: "/assets/images/hopecamp/gratiadei/compressed/gratiadei-11.jpg",
    },
    {
      title: "Sport & Aventura",
      time: "Dupa-amiaza",
      image: "/assets/images/hopecamp/aprins/DSC09892.jpg",
    },
    {
      title: "Grupuri Mici",
      time: "Tot timpul",
      image: "/assets/images/hopecamp/gratiadei/compressed/gratiadei-6.jpg",
    },
    {
      title: "Foc de Tabara",
      time: "Seara",
      image: "/assets/images/hopecamp/gratiadei/compressed/gratiadei-3.jpg",
    },
  ];

  return (
    <section className="py-20 sm:py-28 px-6 sm:px-12 bg-[#1a1a1a]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-archivo text-4xl sm:text-5xl uppercase tracking-tight text-white">
            Ce facem la camp?
          </h2>
          <div className="w-28 h-2 bg-[#FFD600] mx-auto mt-3 rounded-sm -rotate-1" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {activities.map((act, i) => (
            <div
              key={i}
              className="relative aspect-[3/4] overflow-hidden group cursor-pointer"
            >
              <Image
                src={act.image}
                alt={act.title}
                fill
                style={{ objectFit: "cover" }}
                className="group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <span className="text-[11px] text-[#FFD600] uppercase tracking-[2px] font-bold">
                  {act.time}
                </span>
                <h3 className="text-white font-archivo text-lg uppercase mt-1">
                  {act.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
