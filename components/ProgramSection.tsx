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

export default function ProgramSection() {
  const eventDays = getDatesInRange(dateRange.startDate, dateRange.endDate);

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="container mx-auto px-4 text-center">
        {/* Section Header */}
        <div className="mb-12 sm:mb-16">
          <h2 className="font-archivo uppercase font-bold text-3xl sm:text-4xl md:text-5xl text-black mb-4">
            Ce vom face in tabara?
          </h2>
          <div className="w-24 h-1 bg-yellow-400 mx-auto" />
        </div>

        {/* Content Card */}
        <div className="max-w-2xl mx-auto">
          <div className="border-2 border-neutral-200 rounded-xl p-8 sm:p-10">
            <p className="text-neutral-600 mb-6 leading-relaxed">
              In fiecare zi ne vom intalni pentru a ne bucura impreuna de
              activitati diverse, jocuri, inchinare si multe altele. Dar, ne vom
              asigura ca vom avea si timp pentru noi insine, pentru a ne relaxa si
              a ne conecta cu cei din jurul nostru.
            </p>

            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px flex-1 bg-neutral-200" />
              <div className="w-2 h-2 bg-yellow-400 rounded-full" />
              <div className="h-px flex-1 bg-neutral-200" />
            </div>

            <p className="font-semibold text-black">
              Programul va fi anuntat in curand, dar ne dorim sa ne bucuram de
              fiecare moment petrecut impreuna.
            </p>

            {/* Day pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {eventDays.map((date, index) => (
                <div
                  key={index}
                  className="border border-neutral-300 rounded-full px-4 py-2 text-sm text-neutral-700 hover:border-black transition-colors"
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
