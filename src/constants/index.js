// This file contains constants that are used throughout the app.
// These constants can change from edition to edition.
// The idea is to have a single place where these constants are defined and can be easily changed.
// TODO: In the future, we can add a settings page where the SuperAdmin can change these constants.
export const CampTitle = {
  CoreName: "Hope Camp",
  Edition: "#5",
};

//TODO: use capital letters for the first letter of each word, since these are constants

export const pages = {
  home: "/",
  login: "/login",
  logout: "/logout",
  resetPassword: "/resetare-parola",
  register: "/inscrie-te",
  account: "/cont",
  adminsDashboard: "/admin",
  gallery: "/galerie",
};

export const churchOptions = [
  { label: "Speranța, Oradea", value: "Speranta" },
  { label: "Muntele Sionului, Aleșd", value: "Muntele Sionului" },
  { label: "alta: ", value: "biserica...", isOther: true },
];

export const MaxOccupancy = 130;

export const MinimumAge = 16;

export const payTaxToOptions = [
  { label: "Rebeca Gros", value: "Rebeca", isDefault: true },
  { label: "Eugen Petrila (pe Revolut)", value: "Eugen" },
];

export const transportOptions = [
  {
    label: "Vin cu mașina personală",
    value: "Masina personala",
  },
  { label: "Vin cu un prieten cu mașina", value: "Masina prietenului" },
  { label: "Autocar de la biserică", value: "Autocar" },
];

export const dateRange = {
  startDate: new Date(2024, 6, 17),
  endDate: new Date(2024, 6, 22),
  depositPaymentDueDate: new Date(2024, 5, 15),
};

export const sumToPay = {
  normal: 700,
  withFamilyMember: 650,
  deposit: 300,
  perDay: 200,
};

export const contactInfo = {
  email: "tsomediateam@gmail.com",
  phone: "+40 773 311 577",
  instagram: "https://www.instagram.com/tineret_speranta_oradea/",
  facebook: "https://www.facebook.com/tineretsperantaoradea",
  whatsapp: "https://wa.me/40773311577",
  whatsappCommunity: "https://chat.whatsapp.com/KQLxA8YnH5l5Yfk5p2Ko0W",
  youtube: "https://www.youtube.com/@TineretSperantaOradea",
};

export const MaxMessageLength = 300;