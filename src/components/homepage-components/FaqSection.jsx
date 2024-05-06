import Question from "./Question";

export default function FaqSection() {
  const faqData = [
    { question: "Cum pot să mă înscriu?", answer: "raspuns" },
    { question: "După ce mă înscriu ce trebuie să fac?", answer: "raspuns" },
    {
      question: "Care este taxa taberei și ce include aceasta?",
      answer: "raspuns",
    },
    { question: "Care sunt modalitățile de plată?", answer: "raspuns" },
    { question: "Sunt chestiuni diferite dacă sunt minor?", answer: "raspuns" },
    {
      question: "Care este vârsta minimă pentru participarea în tabără?",
      answer: "raspuns",
    },
    { question: "Cum pot să ajung în tabără?", answer: "raspuns" },
    {
      question:
        "Dacă în tabără vreau suc sau o gustare pot să caut magazin să-mi iau?",
      answer: "raspuns",
    },
    {
      question: "Există o ținută pentru băieți/fete la slujbele din tabără?",
      answer: "raspuns",
    },
    { question: "Doresc să donez. Cum pot face asta?", answer: "raspuns" },
  ];
  return (
    <>
      <section className="container mx-auto px-8 py-14 lg:flex lg:justify-around">
        <div className="flex flex-col gap-5 items-center">
          <h2 className="text-hope-blackcyan text-center text-3xl font-bold sm:text-3xl md:text-4xl lg:text-5xl  xl:text-6xl 2xl:text-7xl">
            Întrebări
            <br />
            frecvente
          </h2>

          <div className=" flex flex-col justify-center lg:flex-wrap lg:flex-row black gap-5">
            {faqData.map((faq, index) => (
              <Question
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
