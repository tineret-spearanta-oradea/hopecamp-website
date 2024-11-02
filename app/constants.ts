export const dateRange = {
  startDate: new Date(2024, 6, 17), // July 17, 2024
  endDate: new Date(2024, 6, 22), // July 22, 2024
  depositPaymentDueDate: new Date(2024, 5, 1), // June 1, 2024
};

export const sumToPay = {
  normal: 750,
  withFamilyMember: 700,
  deposit: 200,
};

export const MinimumAge = 14;

export const contactInfo = {
  phone: "+40 773 311 577",
  email: "tsomediateam@gmail.com",
  whatsapp: "https://wa.me/40773311577",
  instagram: "https://www.instagram.com/hopecamp",
  facebook: "https://www.facebook.com/hopecamp",
  youtube: "https://www.youtube.com/hopecamp",
};

export const payTaxToOptions = [
  { label: "Adelin Duca" },
  { label: "Tineret Speranța Oradea" },
];

export const faqData = [
  {
    question: "Cum pot să mă înscriu?",
    answer:
      "Accesează pagina de înscriere și completează formularul cu datele tale. E simplu. Trebuie doar să-ți dorești!",
  },
  {
    question: "După ce mă înscriu ce trebuie să fac?",
    answer: `După ce te înscrii aștepți confirmarea de la noi printr-un mesaj pe care trebuie să-l primești în maxim 3 zile. 
    După asta, trebuie sa achiți avansul de ${
      sumToPay.deposit
    } RON până la data de ${dateRange.depositPaymentDueDate.getDate()} ${dateRange.depositPaymentDueDate.toLocaleString(
      "ro",
      { month: "long" }
    )}`,
  },
  {
    question: "Care este taxa taberei și ce include aceasta?",
    answer: `Taxa taberei este de ${sumToPay.normal} RON. Pentru persoanele care au membru de familie în tabără (soț sau frate/soră) suma este de ${sumToPay.withFamilyMember} RON. Taxa include cazarea, mesele, materialele și toate activitățile din program.`,
  },
  {
    question: "Care sunt modalitățile de plată?",
    answer: `Poți plăti cash / Revolut / BT Pay la ${payTaxToOptions[0].label} sau la ${payTaxToOptions[1].label}. Pentru alte variante sau ajutor te rugăm să ne scrii pe WhatsApp la ${contactInfo.phone}`,
  },
  {
    question: "Sunt chestiuni diferite dacă sunt minor?",
    answer:
      "Dacă ești minor și vrei să vii în tabără, în primul rând, trebuie ca părinții tăi să fie de acord. Apoi, trebuie ca părinții tăi să citească regulamentul și să îl semneze. Atașat îți vom cere o copie după buletinul tău și un număr de telefon al unuia dintre părinți.",
  },
  {
    question: "Care este vârsta minimă pentru participarea în tabără?",
    answer: `Vârsta minimă pentru participarea în tabără este ${MinimumAge} ani împliniți în prima zi de tabără sau 15 ani dacă participantul face parte din Biserica Penticostală Speranța Oradea.`,
  },
  {
    question: "Cum pot să ajung în tabără?",
    answer:
      "Poți să vii cu mașina personală, cu un prieten cu mașina sau cu autocarul pe care îl vom avea la dispoziție. Indiferent de varianta pentru care optezi, trebuie să specifici la înscriere!",
  },
  {
    question:
      "Dacă în tabără vreau să merg până la un magazin din apropiere pentru o gustare, pot ieși din tabără să fac asta?",
    answer:
      "Pe cât e posibil încercăm să descurajăm deplasarea afară din tabără. Prin urmare, în cadrul taberei oferim tot felul de produse de vânzare, la prețuri foarte bune: snacksuri, semințe, croissante, sucuri, apă, înghețată, cafea, limonadă, clătite.",
  },
  {
    question: "Există o ținută pentru băieți/fete la slujbele din tabără?",
    answer:
      "Nu impunem o ținută, însă insistăm pe ținuta decentă pe toată durata taberei, nu doar la slujbe. Nu este permisă ținuta de plajă atât în campusul taberei, cât nici în deplasările din afara taberei, indiferent dacă ești într-un grup mai mare sau mai restrâns. Nu este permisă purtarea maiourilor mulate, foarte largi sau transparente, de asemenea, nici purtarea de rochii/fuste/pantaloni prea scurți(e).",
  },
  {
    question: "Doresc să donez. Cum pot face asta?",
    answer: `Poți plăti taxa pentru un participant care nu își permite asta sau poți dona pentru suportul altor cheltuieli ale taberei precum sunet sau invitați. Scrie-ne pe WhatsApp la ${contactInfo.phone} sau dăruiește direct cash, Revolut sau BT pay conform posibilităților de plată a taberei.`,
  },
];
