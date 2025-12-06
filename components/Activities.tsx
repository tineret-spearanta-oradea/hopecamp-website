import Image from "next/image";
import { useState } from "react";
import { useSwipeable } from "react-swipeable";

interface ActivityItemProps {
  imageSrc: string;
  title: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ imageSrc, title }) => (
  <div className="relative w-36 h-36 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden shadow-xl mx-auto flex-shrink-0 border-4 border-white/50 ring-2 ring-primary/30 group hover:ring-4 hover:ring-white/60 transition-all duration-300 hover:scale-105">
    <Image
      loading="lazy"
      src={imageSrc}
      alt={title}
      layout="fill"
      objectFit="cover"
      quality={75}
      className="transform group-hover:scale-110 transition-transform duration-300 ease-in-out"
    />
    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center p-2 group-hover:bg-opacity-50 transition-all duration-300">
      <span className="text-white text-center font-semibold text-sm md:text-base drop-shadow-lg relative z-10">
        {title}
      </span>
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  </div>
);

export default function Activities() {
  const activities = [
    { imageSrc: "/assets/images/foc-tabara.jpg", title: "Foc de Tabără" },
    {
      imageSrc: "/assets/images/grupuri-mici.jpg",
      title: "Grupuri Mici (Socializare și Studiu)",
    },
    {
      imageSrc: "/assets/images/activitati-sportive.jpg",
      title: "Activități Sportive",
    },
    {
      imageSrc: "/assets/images/worship.jpg",
      title: "Închinare, Rugăciune & Cuvânt",
    },
    {
      imageSrc: "/assets/images/activitati.jpg",
      title: "Activități pe Grupuri Mici",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlers = useSwipeable({
    onSwipedLeft: () =>
      setCurrentIndex((prev) => Math.min(prev + 1, activities.length - 1)),
    onSwipedRight: () => setCurrentIndex((prev) => Math.max(prev - 1, 0)),
    trackMouse: true,
  });

  return (
    <section className="bg-gradient-to-b from-secondary via-white to-secondary py-16 sm:py-24 border-y-2 border-primary/20">
      <div className="container mx-auto px-4 text-center overflow-visible">
        <h3 className="font-jersey text-base uppercase text-primary font-semibold tracking-wider mb-4 relative">
          <span className="relative z-10">❄️ ACTIVITĂȚI ❄️</span>
        </h3>
        <div
          {...handlers}
          className="relative overflow-hidden"
        >
          <div
            className="flex transition-transform duration-300 gap-6"
            style={{
              transform: `translateX(-${currentIndex * (100 + 6)}%)`,
            }}
          >
            {activities.map((activity, index) => (
              <ActivityItem key={index} {...activity} />
            ))}
          </div>
        </div>
        <div className="max-w-3xl mx-auto text-center text-foreground mt-10">
          <p className="mb-4">
            🔥 Fie că vrei să le faci pe toate sau doar să-ți alegi preferatele,
            ai o mulțime de activități din care să alegi.
          </p>
          <p className="text-foreground/80">
            Unele momente-cheie fac parte din ritmul natural al taberei și ne
            ajută să rămânem conectați unii cu alții și cu scopul ei, așa că te
            încurajăm să le trăiești alături de noi. Totul, fără presiune, dar
            cu inimă deschisă.
          </p>
        </div>
      </div>
    </section>
  );
}