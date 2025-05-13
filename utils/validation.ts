import { FormData, ValidationErrors } from "@/types/form";

const initialValidationErrors: ValidationErrors = {
  // phone: "", // Removed
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

export const validateAuthFields = (
    authData: FormData["authData"]
): ValidationErrors => {
  const errors: ValidationErrors = { ...initialValidationErrors };
  
  if (!authData.phone) {
    errors.phone = "Numărul de telefon este necesar.";
    return errors;
  }

  // Different validation based on country code prefix
  if (authData.phonePrefix === "+4") {
    // Romanian number validation
    if (!/^07\d{8}$/.test(authData.phone)) {
      errors.phone =
        "Numărul de telefon trebuie să înceapă cu 07 și să aibă 10 cifre (ex: 0770123456).";
    }
  } else if (authData.phonePrefix === "+1") {
    // US/Canada number validation (10 digits)
    if (!/^\d{10}$/.test(authData.phone)) {
      errors.phone = "Numărul de telefon pentru US trebuie să aibă 10 cifre.";
    }
  } else {
    // Generic validation for other countries (at least 6 digits)
    if (!/^\d{6,}$/.test(authData.phone)) {
      errors.phone = "Numărul de telefon trebuie să conțină cel puțin 6 cifre.";
    }
  }
  
  return errors;
};

export const validateUserFields = (
  userData: Partial<FormData["userData"]>
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
