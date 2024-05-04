import Question from "./Question,";

export default function FAQ() {
  return (
    <>
      <section className="container mx-auto px-8 py-14">
        <div className="flex flex-col gap-5">
          <h2 className="text-center text-3xl font-bold sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl">
            Întrebări
            <br />
            frecvente
          </h2>

          <div className="flex flex-col gap-2">
            <Question question="intrebarea numarul unu" />
            <Question question="intrebarea numarul doi" />
            <Question question="intrebarea numarul trei" />
            <Question question="intrebarea numarul patru" />
          </div>
        </div>
      </section>
    </>
  );
}
