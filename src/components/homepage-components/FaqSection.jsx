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
      answer:
        "Taxa taberei este de 700RON. Dacă ești în situația în care din cauza prețului mare nu îți permiți să vii în tabără cu noi, te rugăm să ne contactezi pe numărul de WhatsApp al tineretului sau să-i scrii liderului Adelin Duca. Taxa include 3 nopți de cazare, mâncarea, participarea la toate sesiunile taberei și toate activitățile de echipă și distractive ale Hope Camp.",
    },
    {
      question: "Care sunt modalitățile de plată?",
      answer:
        "Poți plăti cash la Rebeca Gros sau la Carina Ban. De asemenea, poți plăti prin transfer pe Revolut sau BT Pay la Eugen Petrila sau una din fetele amintite.  Pentru alte variante sau ajutor te rugăm să ne scrii pe whatsapp pe numărul de la tineret:",
    },
    {
      question: "Sunt chestiuni diferite dacă sunt minor?",
      answer:
        "Dacă ești minor și vrei să vii în tabără, în primul rând, trebuie ca părinții tăi să fie de acord. Apoi, trebuie ca părinții tăi să citească regulamentul și să îl semneze (ai citit bine, părintele să îl semneze!). Atașat îți vom cere o copie după buletinul tău si un număr de telefon al unuia dintre parinti",
    },
    {
      question: "Care este vârsta minimă pentru participarea în tabără?",
      answer:
        "Vârsta minimă pentru participarea în tabără este 16 ani împliniți in prima zi de tabara sau 15 ani dacă participantul face parte din Biserica Penticostală Speranța Oradea",
    },
    {
      question: "Cum pot să ajung în tabără?",
      answer:
        "Poti să vii cu mașina personală, cu un prieten cu mașina sau cu autocarul pe care îl vom avea la dispoziție. Indiferent de varianta pentru care optezi, trebuie să specifici la înscriere!",
    },
    {
      question:
        "Dacă în tabără vreau să merg până la un magazin din apropiere pentru o gustare, pot ieși din tabără să fac asta?",
      answer:
        "Pe cât e posibil încercăm să descurajăm deplasarea afară din tabără. Prin urmare, în cadrul taberei oferim tot felul de produse de vânzare, la prețuri de foarte bune: snacksuri, semințe, croissante, sucuri, apă, înghețată, cafea, limonadă, clătite.",
    },
    {
      question: "Există o ținută pentru băieți/fete la slujbele din tabără?",
      answer:
        "Nu impunem o ținută, însă insistăm pe ținuta decentă pe toată durata taberei, nu doar la slujbe. Nu este permisă ținuta de plajă atât în campusul taberei, cât nici în deplasările din afara taberei, indiferent dacă ești într-un grup mai mare sau mai restrâns. Nu este permisă purtarea maiourilor mulate, foarte largi sau transparente, de asemenea, nici purtarea de rochii/fuste/pantaloni prea scurți(e).",
    },
    {
      question: "Doresc să donez. Cum pot face asta?",
      answer:
        "Poți plăti taxa pentru un participant care nu își permite asta sau poți dona pentru suportul altor cheltuieli ale taberei precum sunet sau invitați. Scrie-ne pe Whatsapp la 0773 311 577 sau dăruiește direct cash, Revolut sau BT pay conform posibilităților de plată a taberei.",
    },
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
            <span className="pl-2">
              <i className="bi bi-download"></i>
            </span>
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
