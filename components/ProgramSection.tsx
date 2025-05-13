import { dateRange } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <section className="bg-secondary py-16 sm:py-24">
      <div className="container mx-auto px-4 text-center">
        <h3 className="font-jersey text-base uppercase text-foreground font-semibold tracking-wider mb-4">
          PROGRAM
        </h3>
        <h2 className="font-poppins font-bold uppercase text-3xl sm:text-4xl md:text-5xl text-primary mb-10 sm:mb-16">
          Ce vom face în tabără?
        </h2>

        <div className="max-w-xl mx-auto">
          <p className="font-nunito mb-8">
            În fiecare zi ne vom întâlni pentru a ne bucura împreună de
            activități diverse, jocuri, închinare și multe altele. Dar, ne vom
            asigura că vom avea și timp pentru noi înșine, pentru a ne relaxa și
            a ne conecta cu cei din jurul nostru. Fie că alegi să te bucuri de
            natură, să te implici în activități sau să te odihnești, fiecare zi
            va fi plină de momente frumoase și oportunități de a te conecta cu
            ceilalți.
          </p>
          <p className="font-poppins text-base font-bold text-primary mb-8">
            Programul va fi anunțat în curând, dar ne dorim să ne bucurăm de
            fiecare moment petrecut împreună.
          </p>
        </div>
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 justify-center">
          {eventDays.map((date, index) => (
            <Card
              key={index}
              className="bg-white border border-border shadow-sm text-center overflow-hidden flex flex-col"
            >
              <CardHeader className="bg-gray-50 p-4">
                <CardTitle className="text-primary text-lg sm:text-xl font-semibold flex items-center justify-center gap-2">
                  <i className="bi bi-calendar-check text-xl text-primary/80"></i>
                  {formatCardDate(date)}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 flex-grow flex flex-col justify-center">
                <p className="text-muted-foreground">
                  Programul va fi anunțat în curând...
                </p>
              </CardContent>
            </Card>
          ))}
        </div> */}
      </div>
    </section>
  );
}
