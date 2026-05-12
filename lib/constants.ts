export const title = "Hope Camp #7";
export const editionName = "Integro";

export const churchOptions = [
  { value: "Speranta, Oradea", label: "Speranța, Oradea" },
  { value: "Muntele Sionului, Alesd", label: "Muntele Sionului, Aleșd" },
  { value: "alta", label: "alta:" },
];

export const payTaxToOptions = [
  {
    value: "Denisa Șandor",
    label: "Denisa Șandor (pe Revolut / BT Pay / cash)",
    phone: "+40 774 608 791",
  },
  {
    value: "Carina Ban",
    label: "Carina Ban (pe Revolut / BT Pay / BCR / cash)",
    phone: "+40 735 566 211",
  },
];

export const transportOptions = [
  { value: "personal", label: "Vin cu mașina personală" },
  { value: "prieten", label: "Vin cu un prieten cu mașina" },
  { value: "autocar", label: "Autocar de la biserică" },
];

export const sumToPay = {
  // pretul intreg al taberei (cu optiunea de a dona mai mult sau a primi reducere in anumite cazuri)
  normal: 1200,
  // varianta redusa pentru studenti/elevi
  student: 990,
  // varianta redusa pentru frati (daca unul din frati lucreaza, va trebui sa plateasca integral)
  withFamilyMember: 890,
  // suma pentru avans
  deposit: 500,
};

export const dateRange = {
  startDate: new Date("2026-07-27"),
  endDate: new Date("2026-08-01"),
  depositPaymentDueDate: new Date("2026-06-20"),
};

export const location = {
  name: "Integro",
  campusName: "Integro",
  addressLine: "județul Mureș",
  googleMapsUrl: "https://maps.app.goo.gl/qWc73iYvcZMmVrpR7",
  iframeSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2724.9348749168994!2d25.073952013226762!3d46.923662271014976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x474a691f33cafb27%3A0x7ce297c0c07c92e9!2sSat%20de%20Vacanta%20Integro!5e0!3m2!1sro!2sro!4v1773126760890!5m2!1sro!2sro",
};

export const MinimumAge = {
  normal: 16,
  memberOfChurch: 15,
};

export const contactInfo = {
  phone: "+40 773 311 577",
  email: "dev@hopecamp.ro",
  whatsapp: "https://wa.me/40773311577",
  instagram: "https://www.instagram.com/tineret_speranta_oradea",
  facebook: "https://www.facebook.com/tineretsperantaoradea",
  youtube: "https://www.youtube.com/@TineretSperantaOradea",
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
    answer: `După ce te înscrii <strong>astepți confirmarea de la noi</strong> printr-un mesaj pe care trebuie să-l primești în maxim 3 zile. 
    După asta, trebuie sa achiți avansul de <strong>${
      sumToPay.deposit
    } RON până la data de ${new Date(
      dateRange.depositPaymentDueDate
    ).getDate()} ${new Date(dateRange.depositPaymentDueDate).toLocaleString(
      "ro",
      { month: "long" }
    )}</strong>`,
    tags: ["înscriere", "financiar"],
  },
  {
    question: "Care este taxa taberei și ce include aceasta?",
    answer: `Prețul întreg al taberei este de <strong>${
      sumToPay.normal
    } RON</strong>, cu opțiunea să donezi mai mult sau să primești reducere în anumite cazuri.<br/>${
      sumToPay.student
        ? `Pentru <strong><i>studenți/elevi</i></strong> taxa este de <strong>${sumToPay.student} RON</strong>.<br/>`
        : ""
    }${
      sumToPay.withFamilyMember
        ? `Pentru <strong><i>frați</i></strong> taxa este de <strong>${sumToPay.withFamilyMember} RON</strong> (dacă unul din frați lucrează, va trebui să plătească integral).<br/>`
        : ""
    }Taxa include cazarea, mesele, materialele și toate activitățile din programul taberei pe cele ${
      dateRange.endDate.getDate() - dateRange.startDate.getDate() + 1
    } zile si ${
      dateRange.endDate.getDate() - dateRange.startDate.getDate()
    } nopti.`,
    tags: ["financiar"],
  },
  {
    question: "Care sunt modalitățile de plată?",
    answer: `Poți achita la <ol><li><strong>${payTaxToOptions[0].label}</strong> pe telefon ${payTaxToOptions[0].phone}</li><li><strong>${payTaxToOptions[1].label}</strong> pe telefon ${payTaxToOptions[1].phone}</li></ol>Pentru alte variante sau ajutor te rugăm să ne scrii pe WhatsApp la <strong> <a href="${contactInfo.whatsapp}" target="_blank" rel="noopener noreferrer">${contactInfo.phone}</a></strong>`,
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
    answer: `Vârsta minimă pentru participarea în tabără este <strong>${MinimumAge.normal} ani împliniți în prima zi de tabără</strong> sau <strong>${MinimumAge.memberOfChurch} ani dacă participantul face parte din Biserica Penticostală Speranța Oradea</strong>.`,
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
