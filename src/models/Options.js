export const churchOptions = [
  { label: "Speranța, Oradea", value: "Speranta" },
  { label: "Muntele Sionului, Aleșd", value: "Muntele Sionului" },
  { label: "alta: ", value: "biserica...", isOther: true },
];

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
};

export const sumToPay = {
  normal: 700,
  withFamilyMember: 600,
};

export const contactInfo = {
  phone: "0000 000 000",
};

export const MAX_LENGTHS = {
  email: 100,
  password: 50,
  name: 200,
  age: 2,
  phone: 15,
  church: 100,
  payTaxTo: 100,
  transport: 100,
  preferences: 300, 
};

export const constraints = {
  email: value => /\S+@\S+\.\S+/.test(value),
  password: value => value.length >= 6,
  phone: value => /^\d{10}$/.test(value),
  age: value => parseInt(value) >= 13 && parseInt(value) <= 35,
};