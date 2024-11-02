import "/src/styles/dividers.css";
// import ScheduleDay from "./ScheduleDays";

function ScheduleSection() {
  // const scheduleDays = [
  //   { day: "Day #1", date: "20 Iulie" },
  //   { day: "Day #2", date: "21 Iulie" },
  //   { day: "Day #3", date: "22 Iulie" },
  //   { day: "Day #4", date: "23 Iulie" },
  //   { day: "Day #5", date: "24 Iulie" },
  // ];
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
              seară este unică, plină de emoții și aduce cu sine o experiență
              specială de închinare și învățătură biblică și momente
              distractive. În Hope Camp avem momente de rugăciune, închinare,
              ascultarea mesajului biblic, întâlniri pe grupe, activități
              distractive, quizz, momente de relaxare, activități sportive,
              ieșiri, drumeție etc. Hai să ne întâlnim și să trăim împreună
              aceste momente spirituale de neuitat! 🙏✨
            </p>
          </div>

          <div className="mt-8 flex flex-col items-center gap-2 w-full lg:w-1/2 lg:mt-0">
            <div className="flex flex-col items-center">
              <p className="text-3xl lg:text-5xl xl:text-6xl">🫢</p>
              <p className="text-hope-blackcyan text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
                coming soon
              </p>
            </div>
            {/* {scheduleDays.map((schedule, index) => (
              <ScheduleDay
                key={index}
                day={schedule.day}
                date={schedule.date}
              />
            ))} */}
          </div>
        </div>
      </section>
      <div className="spacer schedule-divider-down"></div>
    </>
  );
}

export default ScheduleSection;
