import { FormData, ValidationErrors } from "@/types/form";

const initialValidationErrors: ValidationErrors = {
  // email: "", // Removed
  // password: "", // Removed
  // confirmPassword: "", // Removed
  name: "",
  age: "",
  phone: "",
  dateRange: "",
  church: "",
  payTaxTo: "",
  transport: "",
  otp: "", // Added OTP initial error
};

// Removed validateAuthFields function

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

  // if (!userData.phone) {
  //   errors.phone = "Numărul de telefon este necesar.";
  // } else if (!/^[0-9]{7,15}$/.test(userData.phone)) {
  //   errors.phone = "Numărul de telefon trebuie să aibă între 7 și 15 cifre.";
  // }

  if (
    !userData.startDate ||
    !userData.endDate ||
    userData.startDate === null ||
    userData.endDate === null
  ) {
    errors.dateRange = "Te rugăm să selectezi perioada.";
  }

  if (!userData.church) {
    errors.church = "Te rugăm să selectezi biserica.";
  } else if (userData.church === "alta") {
    if (!userData.churchOther) {
      errors.church = "Te rugăm să introduci numele bisericii.";
    }
    if (!userData.churchContact) {
      errors.church = "Te rugăm să introduci numele unui prieten/unei cunoștințe.";
    }
  }

  if (!userData.payTaxTo) {
    errors.payTaxTo = "Te rugăm să selectezi cui plătești taxa.";
  }

  if (!userData.transport) {
    errors.transport = "Te rugăm să selectezi mijlocul de transport.";
  }

  if (!userData.slopeActivity) {
    errors.slopeActivity = "Te rugăm să selectezi o opțiune.";
  }

  return errors;
};

// Added OTP validation function
export const validateOtp = (otp: string): ValidationErrors => {
    const errors: ValidationErrors = { ...initialValidationErrors };
    if (!otp) {
        errors.otp = "Codul OTP este necesar.";
    } else if (!/^\d{6}$/.test(otp)) { // Assuming 6-digit OTP
        errors.otp = "Codul OTP trebuie să conțină 6 cifre.";
    }
    return errors;
}
