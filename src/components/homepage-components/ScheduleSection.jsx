import "/src/styles/dividers.css";
import ScheduleDay from "./ScheduleDays";

function ScheduleSection() {
  return (
    <>
      <div className="spacer schedule-divider-up" />
      <section className="bg-hope-beige py-14 px-8">
        <div className="container mx-auto flex flex-col lg:items-center lg:justify-around lg:flex-row gap-5">
          <div className="flex flex-col items-center gap-5 lg:items-start">
            <h2 className="text-black text-3xl font-bold sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl">
              Program
            </h2>
            <p className="text-center font-medium max-w-sm sm:text-sm md:max-w-md md:text-md lg:max-w-lg lg:text-lg lg:text-start xl:max-w-xl xl:text-xl">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt
              ex numquam aliquam modi corporis. Quod ex enim perferendis eos
              repudiandae recusandae totam corrupti aperiam illo, optio amet
              eligendi voluptate placeat!
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
