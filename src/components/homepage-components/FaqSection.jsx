import Question from "./Question";
import JoinWhatsappSection from "./JoinWhatsappSection";

export default function FaqSection() {
  return (
    <>
      <section className="container mx-auto px-8 py-14 lg:flex lg:justify-around lg:items-end">
        <div className="order-last">
          <JoinWhatsappSection />
        </div>
        <div className="flex flex-col  gap-5 lg:w-1/2">
          <h2 className="text-center text-3xl font-bold sm:text-3xl md:text-4xl lg:text-5xl lg:text-start xl:text-6xl 2xl:text-7xl">
            Întrebări
            <br />
            frecvente
          </h2>

          <div className="flex flex-col gap-2">
            <Question question="intrebarea numarul unu" answer="raspuns" />
            <Question question="intrebarea numarul doi" answer="raspuns" />
            <Question question="intrebarea numarul trei" answer="raspuns" />
            <Question question="intrebarea numarul patru" answer="raspuns" />
          </div>
        </div>
      </section>
    </>
  );
}
