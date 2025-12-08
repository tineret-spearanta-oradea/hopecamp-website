"use client";

import Image from "next/image";

interface ActivityItemProps {
  imageSrc: string;
  title: string;
  description?: string;
  size?: "large" | "medium" | "small";
  className?: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  imageSrc,
  title,
  description,
  size = "small",
  className = "",
}) => {
  const sizeClasses = {
    large: "col-span-2 row-span-2",
    medium: "col-span-2 row-span-1 sm:col-span-1 sm:row-span-2",
    small: "col-span-1 row-span-1",
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        ${className}
        relative rounded-2xl overflow-hidden group cursor-pointer
        glass-card hover-ice
        transition-all duration-500 ease-out
        min-h-[160px] sm:min-h-[180px]
      `}
    >
      {/* Background Image */}
      <Image
        src={imageSrc}
        alt={title}
        fill
        style={{ objectFit: "cover" }}
        quality={80}
        className="transition-transform duration-700 ease-out group-hover:scale-110"
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/90 via-[#0a1628]/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Frost border effect on hover */}
      <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/30 rounded-2xl transition-colors duration-500" />

      {/* Content */}
      <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-end">
        {/* Ice crystal decoration */}
        <div className="absolute top-3 right-3 w-2 h-2 bg-white/40 rotate-45 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-twinkle" />
        <div className="absolute top-5 right-6 w-1.5 h-1.5 bg-cyan-200/50 rotate-45 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 animate-twinkle animation-delay-300" />

        {/* Title - larger cards have more bottom positioning */}
        <h4 className={`font-poppins font-bold text-white text-lg sm:text-xl md:text-2xl leading-tight drop-shadow-lg transform group-hover:translate-y-0 transition-transform duration-500 ${
          size !== "small" ? "translate-y-0" : "translate-y-2"
        }`}>
          {title}
        </h4>

        {/* Description (shown on hover for larger cards) */}
        {description && size !== "small" && (
          <p className="font-nunito text-white/80 text-sm mt-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100 line-clamp-2">
            {description}
          </p>
        )}

        {/* Animated underline */}
        <div className="h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mt-2 w-0 group-hover:w-16 transition-all duration-500 delay-200" />
      </div>

      {/* Corner frost accent */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-tl from-white/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </div>
  );
};

export default function Activities() {
  const activities = [
    {
      imageSrc: "/assets/images/worship.jpg",
      title: "Închinare & Cuvânt",
      description: "Momente de rugăciune, închinare și studiu biblic care îți hrănesc sufletul.",
      size: "large" as const,
    },
    {
      imageSrc: "/assets/images/ski.png",
      title: "Pârtie",
      description: "Zile pline de adrenalină pe pârtiile de schi.",
      size: "medium" as const,
    },
    {
      imageSrc: "/assets/images/grupuri-mici.jpg",
      title: "Grupuri Mici",
      description: "Socializare și studiu în comunitate.",
      size: "small" as const,
    },
    {
      imageSrc: "/assets/images/foc-tabara.jpg",
      title: "Foc de Tabără",
      description: "Seri memorabile sub cerul înstelat cu muzică și povești.",
      size: "small" as const,
    },
  ];

  return (
    <section className="relative bg-frost-light py-20 sm:py-28 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Frost radial gradient */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl" />

        {/* Decorative ice crystals */}
        <div className="absolute top-20 left-[5%] w-3 h-3 bg-cyan-300/30 rotate-45 animate-float-slow" />
        <div className="absolute top-40 right-[10%] w-2 h-2 bg-cyan-200/40 rotate-45 animate-drift animation-delay-500" />
        <div className="absolute bottom-32 left-[15%] w-2.5 h-2.5 bg-blue-300/30 rotate-45 animate-float animation-delay-300" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
            <span className="text-primary/70 text-sm font-medium tracking-wider uppercase">
              Ce te așteaptă
            </span>
          </div>
          <h2 className="font-poppins font-bold text-3xl sm:text-4xl md:text-5xl text-primary mb-4">
            ❄️ Activități ❄️
          </h2>
          <p className="font-nunito text-foreground/70 max-w-2xl mx-auto">
            Fie că vrei să le faci pe toate sau doar să-ți alegi preferatele,
            ai o mulțime de experiențe din care să alegi.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
          {activities.map((activity, index) => (
            <ActivityItem
              key={index}
              {...activity}
              className={`animation-delay-${index * 100}`}
            />
          ))}
        </div>

        {/* Bottom description */}
        <div className="max-w-2xl mx-auto text-center mt-12 sm:mt-16">
          <div className="glass-card rounded-2xl p-6 sm:p-8">
            <p className="font-nunito text-foreground/80">
              Unele momente-cheie fac parte din ritmul natural al taberei și ne
              ajută să rămânem conectați unii cu alții și cu scopul ei, așa că te
              încurajăm să le trăiești alături de noi. <span className="text-primary font-medium">Totul, fără presiune, dar
              cu inimă deschisă.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}