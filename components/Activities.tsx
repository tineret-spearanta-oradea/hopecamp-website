import Image from "next/image";

interface ActivityItemProps {
  imageSrc: string;
  title: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ imageSrc, title }) => (
  <div className="relative w-36 h-36 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden shadow-lg mx-auto">
    <Image
      src={imageSrc}
      alt={title}
      layout="fill"
      objectFit="cover"
      quality={75}
      className="transform group-hover:scale-110 transition-transform duration-300 ease-in-out"
    />
    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center p-2">
      <span className="text-white text-center font-semibold text-sm md:text-base">
        {title}
      </span>
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

  return (
    <section className="bg-secondary py-16 sm:py-24">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-sm uppercase text-foreground font-semibold tracking-wider mb-4">
          ACTIVITĂȚI
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8 mb-10 sm:mb-16">
          {activities.map((activity, index) => (
            <ActivityItem key={index} {...activity} />
          ))}
        </div>
        <div className="max-w-3xl mx-auto text-center text-foreground">
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
