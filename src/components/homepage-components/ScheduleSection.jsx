import "/src/styles/dividers.css";
import ScheduleDay from "./ScheduleDays";

function ScheduleSection() {
  return (
    <>
      <div className="spacer schedule-divider-up" />
      <section className="bg-hope-beige py-14 px-8">
        <div className="container mx-auto flex flex-col lg:items-center lg:justify-around lg:flex-row gap-5">
          <div className="flex flex-col items-center gap-5 lg:items-start">
            <h2 className="text-hope-blackcyan text-3xl font-bold sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl">
              Program
            </h2>
            <p className="text-hope-blackcyan text-center max-w-sm sm:text-sm md:max-w-md md:text-md lg:max-w-lg lg:text-lg lg:text-start xl:max-w-xl xl:text-xl">
              Bucură-te de fiecare moment al zilei în cadrul taberei! 🌅 Fiecare
              seară aduce cu sine o experiență specială de închinare și
              învățătură biblică. Împreună, ne ridicăm în cântare și rugăciune,
              descoperind frumusețea și înțelepciunea Cuvântului lui Dumnezeu și
              crescând în legătură cu El și unii cu alții. Fiecare seară este
              unică, plină de emoții și încărcată cu inspirație divină. Hai să
              ne întâlnim și să trăim împreună aceste momente spirituale de
              neuitat! 🙏✨
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-2 w-full lg:w-1/2 lg:mt-0">
            <ScheduleDay day="Day #1" date="7 aprilie" />
            <ScheduleDay day="Day #2" date="7 aprilie" />
            <ScheduleDay day="Day #3" date="7 aprilie" />
            <ScheduleDay day="Day #4" date="7 aprilie" />
            <ScheduleDay day="Day #5" date="7 aprilie" />
          </div>
        </div>
      </section>
      <div className="spacer schedule-divider-down"></div>
    </>
  );
}

export default ScheduleSection;
