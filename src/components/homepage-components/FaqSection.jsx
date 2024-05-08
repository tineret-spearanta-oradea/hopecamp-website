import Question from "./Question";

export default function FaqSection() {
  const handleDownloadPDF = () => {
    const link = document.createElement("a");
    const pdfPath = "/assets/Regulament_HopeCamp.pdf";
    link.href = pdfPath;
    link.download = "Regulament_HopeCamp.pdf";
    link.click();
    window.open(pdfPath);
  };
  const faqData = [
    {
      question: "Cum pot să mă înscriu?",
      answer:
        "Click pe butonul de inscrie-te și urmează pașii necesari. E simplu. Trebuie doar să-ți dorești!",
    },
    {
      question: "După ce mă înscriu ce trebuie să fac?",
      answer:
        "După ce te înscrii aștepți confirmarea de la noi printr-un mesaj pe care trebuie să-l primești în maxim 3 zile.",
    },
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
      <section className="container mx-auto px-8 py-10 lg:flex lg:justify-around">
        <div className="flex flex-col gap-5 items-center">
          <h2 className="text-hope-blackcyan text-center text-3xl font-bold sm:text-3xl md:text-4xl lg:text-5xl  xl:text-6xl 2xl:text-7xl">
            Întrebări
            <br />
            frecvente
          </h2>

          <button
            onClick={handleDownloadPDF}
            className="flex bg-hope-orange text-white text-base font-semibold rounded-full px-8 py-2 lg:text-lg xl:text-xl"
          >
            Descarcǎ regulamentul
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              class="bi bi-download"
              className="ml-2"
              viewBox="0 0 16 16"
            >
              <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
              <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
            </svg>
          </button>

          <div className=" flex flex-col justify-center lg:grid lg:grid-cols-2  black gap-5">
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
