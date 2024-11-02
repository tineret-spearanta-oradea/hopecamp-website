import { FormData, ValidationErrors } from "@/types/form";
import { dateRange } from "@/lib/constants";

export const validateAuthFields = (
  authData: FormData["authData"]
): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!authData.email) {
    errors.email = "Adresa de email este necesară.";
  } else if (!/\S+@\S+\.\S+/.test(authData.email)) {
    errors.email = "Adresa de email este invalidă.";
  }

  if (!authData.password) {
    errors.password = "Parola este necesară.";
  } else if (authData.password.length < 6) {
    errors.password = "Parola trebuie să aibă cel puțin 6 caractere.";
  }

  if (authData.password !== authData.confirmPassword) {
    errors.confirmPassword = "Parolele nu se potrivesc.";
  }

  return errors;
};

export const validateUserFields = (
  userData: FormData["userData"]
): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!userData.name?.trim()) {
    errors.name = "Numele este necesar.";
  }

  if (!userData.age) {
    errors.age = "Vârsta este necesară.";
  } else {
    const age = parseInt(userData.age);
    if (age < 14 || age > 99) {
      errors.age = "Vârsta trebuie să fie între 14 și 99 ani.";
    }
  }

  if (!userData.phone?.trim()) {
    errors.phone = "Numărul de telefon este necesar.";
  } else if (!/^[0-9+\s-]{10,}$/.test(userData.phone)) {
    errors.phone = "Numărul de telefon este invalid.";
  }

  if (!userData.startDate || !userData.endDate) {
    errors.dateRange = "Perioada este necesară.";
  } else {
    const start = new Date(userData.startDate);
    const end = new Date(userData.endDate);
    if (start > end) {
      errors.dateRange = "Data de început nu poate fi după data de sfârșit.";
    }

    const campStart = new Date(dateRange.startDate);
    campStart.setHours(0, 0, 0, 0);

    if (start < campStart || end > dateRange.endDate) {
      errors.dateRange =
        "Perioada selectată trebuie să fie în perioada taberei.";
    }
  }

  if (!userData.church) {
    errors.church = "Biserica este necesară.";
  }

  if (!userData.payTaxTo) {
    errors.payTaxTo = "Selectează cui vei plăti taxa.";
  }

  if (!userData.transport) {
    errors.transport = "Selectează mijlocul de transport.";
  }

  if (!userData.imageFile) {
    errors.imageFile = "Poza este necesară.";
  } else if (!userData.imageFile.type.startsWith("image/")) {
    errors.imageFile = "Te rugăm să încarci o poză.";
  } else if (userData.imageFile.size > 5 * 1024 * 1024) {
    // 5MB limit
    errors.imageFile = "Poza trebuie să fie mai mică de 5MB.";
  }

  return errors;
};
