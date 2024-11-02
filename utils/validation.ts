import { FormData, ValidationErrors } from "@/types/form";

const initialValidationErrors: ValidationErrors = {
  email: "",
  password: "",
  confirmPassword: "",
  name: "",
  age: "",
  phone: "",
  dateRange: "",
  church: "",
  payTaxTo: "",
  transport: "",
};

export const validateAuthFields = (
  authData: FormData["authData"]
): ValidationErrors => {
  const errors: ValidationErrors = { ...initialValidationErrors };

  if (!authData.email) {
    errors.email = "Adresa de email este necesară.";
  } else if (!/\S+@\S+\.\S+/.test(authData.email)) {
    errors.email = "Adresa de email nu este validă.";
  }

  if (!authData.password) {
    errors.password = "Parola este necesară.";
  } else if (authData.password.length < 6) {
    errors.password = "Parola trebuie să aibă cel puțin 6 caractere.";
  }

  if (!authData.confirmPassword) {
    errors.confirmPassword = "Te rugăm să confirmi parola.";
  } else if (authData.password !== authData.confirmPassword) {
    errors.confirmPassword = "Parolele nu se potrivesc.";
  }

  return errors;
};

export const validateUserFields = (
  userData: FormData["userData"]
): ValidationErrors => {
  const errors: ValidationErrors = { ...initialValidationErrors };

  if (!userData.name) {
    errors.name = "Numele este necesar.";
  }

  if (!userData.age) {
    errors.age = "Vârsta este necesară.";
  } else if (parseInt(userData.age) < 7 || parseInt(userData.age) > 99) {
    errors.age = "Vârsta trebuie să fie între 7 și 99 ani.";
  }

  if (!userData.phone) {
    errors.phone = "Numărul de telefon este necesar.";
  } else if (!/^[0-9]{10}$/.test(userData.phone)) {
    errors.phone = "Numărul de telefon trebuie să aibă 10 cifre.";
  }

  if (!userData.startDate || !userData.endDate) {
    errors.dateRange = "Te rugăm să selectezi perioada.";
  }

  if (!userData.church) {
    errors.church = "Te rugăm să selectezi biserica.";
  }

  if (!userData.payTaxTo) {
    errors.payTaxTo = "Te rugăm să selectezi cui plătești taxa.";
  }

  if (!userData.transport) {
    errors.transport = "Te rugăm să selectezi mijlocul de transport.";
  }

  return errors;
};
