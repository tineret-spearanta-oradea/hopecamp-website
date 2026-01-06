import { dateRange } from "@/lib/constants";

// Helper function to generate an array of dates between start and end (inclusive)
const getDatesInRange = (startDate: Date, endDate: Date): Date[] => {
  const dates: Date[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

// Helper function to format the date
const formatCardDate = (date: Date): string => {
  return date.toLocaleDateString("ro-RO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
};

export default function ProgramSection() {
  const eventDays = getDatesInRange(dateRange.startDate, dateRange.endDate);

  return (
    <section className="relative bg-frost-light py-20 sm:py-28 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-200/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[200px] bg-blue-200/10 rounded-full blur-3xl" />

        {/* Ice crystals */}
        <div className="absolute top-[20%] left-[10%] w-2.5 h-2.5 bg-cyan-300/25 rotate-45 animate-float-slow" />
        <div className="absolute bottom-[25%] right-[15%] w-2 h-2 bg-blue-300/20 rotate-45 animate-drift animation-delay-500" />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Section Header */}
        <div className="mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
            <svg className="w-4 h-4 text-primary/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-primary/70 text-sm font-medium tracking-wider uppercase">
              Program
            </span>
          </div>
          <h2 className="font-poppins font-bold text-3xl sm:text-4xl md:text-5xl text-primary mb-4">
            ❄️ Ce vom face în tabără? ❄️
          </h2>
        </div>

        {/* Content Card */}
        <div className="max-w-2xl mx-auto">
          <div className="glass-card rounded-3xl p-8 sm:p-10">
            <p className="font-nunito text-foreground/80 mb-6 leading-relaxed">
              În fiecare zi ne vom întâlni pentru a ne bucura împreună de
              activități diverse, jocuri, închinare și multe altele. Dar, ne vom
              asigura că vom avea și timp pentru noi înșine, pentru a ne relaxa și
              a ne conecta cu cei din jurul nostru.
            </p>

            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent" />
              <div className="w-2 h-2 bg-cyan-300/50 rotate-45" />
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent" />
            </div>

            <p className="font-poppins text-base font-semibold text-primary">
              Programul va fi anunțat în curând, dar ne dorim să ne bucurăm de
              fiecare moment petrecut împreună.
            </p>

            {/* Day pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {eventDays.map((date, index) => (
                <div
                  key={index}
                  className="glass rounded-full px-4 py-2 text-sm text-foreground/70"
                >
                  <span className="font-medium">Ziua {index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
