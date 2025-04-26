export const title = "Winter Camp #2";

export const churchOptions = [
  { value: "Speranta, Oradea", label: "Speranța, Oradea" },
  { value: "Muntele Sionului, Alesd", label: "Muntele Sionului, Aleșd" },
  { value: "alta", label: "alta:" },
];

export const payTaxToOptions = [
  {
    value: "Denisa Șandor",
    label: "Denisa Șandor (pe BT Pay sau cash)",
    phone: "+40 774 608 791",
  },
  {
    value: "Eugen Petrila",
    label: "Eugen Petrila (pe Revolut sau cash)",
    phone: "+40 753 914 149",
  },
];

export const transportOptions = [
  { value: "personal", label: "Vin cu mașina personală" },
  { value: "prieten", label: "Vin cu un prieten cu mașina" },
  { value: "autocar", label: "Autocar de la biserică" },
];

export const slopeActivityOptions = [
  { value: "nu", label: "Nu voi merge pe pârtie" },
  { value: "vizita", label: "Da, dar doar în vizită" },
  { value: "schi", label: "Da, cu ski/snowboard" },
  { value: "sanie", label: "Da, cu sania" },
];

export const sumToPay = {
  normal: 500,
  withFamilyMember: null,
  deposit: 250,
  perDay: 200,
};

export const dateRange = {
  startDate: new Date("2025-08-04"),
  endDate: new Date("2025-08-09"),
  depositPaymentDueDate: new Date("2025-07-20"),
};

export const MinimumAge = {
  normal: 16,
  memberOfChurch: 15,
};

export const contactInfo = {
  phone: "+40 773 311 577",
  email: "tsomediateam@gmail.com",
  whatsapp: "https://wa.me/40773311577",
  instagram: "https://www.instagram.com/tineret_speranta_oradea",
  facebook: "https://www.facebook.com/tineretsperantaoradea",
  youtube: "https://www.youtube.com/@TineretSperantaOradea",
};

// Registration status
export const REGISTRATION_STATUS = {
  IS_DISABLED: true, // Set this to true to disable registrations
  BYPASS_MODE: "temp", // The query parameter value that allows bypassing the disabled state
};

export const faqData = [
  {
    question: "Cum pot să mă înscriu?",
    answer:
      "Accesează pagina de înscriere și completează formularul cu datele tale. E simplu. Trebuie doar să-ți dorești!",
    tags: ["înscriere"],
  },
  {
    question: "După ce mă înscriu ce trebuie să fac?",
    answer: `După ce te înscrii aștepți confirmarea de la noi printr-un mesaj pe care trebuie să-l primești în maxim 3 zile. 
    După asta, trebuie sa achiți avansul de ${
      sumToPay.deposit
    } RON până la data de ${new Date(
      dateRange.depositPaymentDueDate
    ).getDate()} ${new Date(dateRange.depositPaymentDueDate).toLocaleString(
      "ro",
      { month: "long" }
    )}`,
    tags: ["înscriere", "financiar"],
  },
  {
    question: "Care este taxa taberei și ce include aceasta?",
    answer: `Taxa taberei este de ${sumToPay.normal} RON. ${
      sumToPay.withFamilyMember !== null
        ? `Pentru persoanele care au membru de familie în tabără (soț sau frate/soră) suma este de ${sumToPay.withFamilyMember} RON.`
        : ""
    } Taxa include cazarea, mesele, materialele și toate activitățile din programul taberei pe cele ${
      dateRange.endDate.getDate() - dateRange.startDate.getDate() + 1
    } zile si ${
      dateRange.endDate.getDate() - dateRange.startDate.getDate()
    } nopti.`,
    tags: ["financiar"],
  },
  {
    question: "Care sunt modalitățile de plată?",
    answer: `Poți achita la ${payTaxToOptions[0].label} sau la ${payTaxToOptions[1].label}. Pentru alte variante sau ajutor te rugăm să ne scrii pe WhatsApp la ${contactInfo.phone}`,
    tags: ["financiar"],
  },
  {
    question: "Sunt chestiuni diferite dacă sunt minor?",
    answer:
      "Dacă ești minor și vrei să vii în tabără, în primul rând, trebuie ca părinții tăi să fie de acord. Apoi, trebuie ca părinții tăi să citească regulamentul și să îl semneze. Atașat îți vom cere o copie după buletinul tău și un număr de telefon al unuia dintre părinți.",
    tags: ["reguli", "înscriere"],
  },
  {
    question: "Care este vârsta minimă pentru participarea în tabără?",
    answer: `Vârsta minimă pentru participarea în tabără este ${MinimumAge.normal} ani împliniți în prima zi de tabără sau ${MinimumAge.memberOfChurch} ani dacă participantul face parte din Biserica Speranța Oradea.`,
    tags: ["reguli", "înscriere"],
  },
  {
    question: "Cum pot să ajung în tabără?",
    answer:
      "Poți să vii cu mașina personală, cu un prieten cu mașina sau cu autocarul pe care îl vom avea la dispoziție. Indiferent de varianta pentru care optezi, trebuie să specifici la înscriere!",
    tags: ["transport"],
  },
  {
    question:
      "Dacă în tabără vreau să merg până la un magazin din apropiere pentru o gustare, pot ieși din tabără să fac asta?",
    answer:
      "Pe cât e posibil încercăm să descurajăm deplasarea afară din tabără. Prin urmare, în cadrul taberei oferim tot felul de produse de vânzare, la prețuri foarte bune: snacksuri, semințe, croissante, sucuri, apă, înghețată, cafea, limonadă, clătite. În cadrul taberei vom avea inclusiv medicamente sau produse de prim ajutor. În cazul unei nevoi speciale, participantul poate să părăsească tabăra pentru un timp scurt după ce anunță liderul principal al taberei.",
    tags: ["reguli"],
  },
  {
    question: "Există o ținută pentru băieți/fete la slujbele din tabără?",
    answer:
      "Nu impunem o ținută, însă insistăm pe ținuta decentă pe toată durata taberei, nu doar la slujbe. Nu este permisă ținuta de plajă atât în campusul taberei, cât nici în deplasările din afara taberei, indiferent dacă ești într-un grup mai mare sau mai restrâns. Nu este permisă purtarea maiourilor mulate, foarte largi sau transparente, de asemenea, nici purtarea de rochii/fuste/pantaloni prea scurți(e).",
    tags: ["reguli"],
  },
  {
    question: "Doresc să donez. Cum pot face asta?",
    answer: `Poți plăti taxa pentru un participant care nu își permite asta sau poți dona pentru suportul altor cheltuieli ale taberei precum sunet sau invitați. Scrie-ne pe WhatsApp la ${contactInfo.phone} sau dăruiește direct cash, Revolut sau BT pay conform posibilităților de plată a taberei.`,
    tags: ["financiar"],
  },
  {
    question: "Dacă nu sunt membru în Biserica Speranța pot să particip?",
    answer:
      "Cu siguranță că poți. Cerința noastră e să fi participat la cel puțin 2 întâlniri de tineret ca să ne cunoști și să ai un prieten participant care să te recomande.",
    tags: ["înscriere"],
  },
];
