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

export const MaxOccupancy = 150;

export const payTaxToOptions = [
  { label: "Carina Ban", value: "Carina", isDefault: true },
  { label: "Rebeca Gros", value: "Rebeca" },
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
  startDate: new Date(2024, 6, 20),
  endDate: new Date(2024, 6, 25),
  depositPaymentDueDate: new Date(2024, 5, 1),
};

export const sumToPay = {
  normal: 700,
  withFamilyMember: 600,
  deposit: 150,
  perDay: 150,
};

export const contactInfo = {
  phone: "0000 000 000",
};
