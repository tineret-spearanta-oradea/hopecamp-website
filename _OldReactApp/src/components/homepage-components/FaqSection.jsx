import { useState } from "react";
import Question from "./Question";
import faqData from "../../constants/questions";

export default function FaqSection() {

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredFaqData = faqData.filter(
    (faq) =>
      faq.question
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      faq.answer.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadPDF = () => {
    const link = document.createElement("a");
    const pdfPath = "/assets/Regulament_HopeCamp.pdf";
    link.href = pdfPath;
    link.download = "Regulament_HopeCamp.pdf";
    link.click();
    window.open(pdfPath);
  };

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
            <span className="pl-2">
              <i className="bi bi-download"></i>
            </span>
          </button>
          <input
            type="text"
            placeholder="caută..."
            value={searchTerm}
            onChange={handleSearch}
            className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-hope-orange"
          />

          <div className="flex flex-col justify-center lg:flex-wrap  black gap-5">
            {filteredFaqData.map((faq, index) => (
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
