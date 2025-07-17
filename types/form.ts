export interface AuthData {
  phone: string;
  phonePrefix: string;
}

export interface UserData {
  name: string;
  age: string;
  gender: 'male' | 'female' | 'unknown';
  startDate: Date | undefined;
  endDate: Date | undefined;
  church: string;
  churchOther?: string;
  churchContact?: string;
  payTaxTo: string;
  transport: string;
  imageUrl: string;
  preferences?: string;
}

export interface FormData {
  authData: AuthData;
  userData: UserData;
}

export interface ValidationErrors {
  name?: string;
  age?: string;
  gender?: string;
  phone?: string;
  dateRange?: string;
  church?: string;
  payTaxTo?: string;
  transport?: string;
  image?: string;
  otp?: string; // Added OTP validation error
}

export interface StepProps {
  formData: FormData;
  handleChange: (
    objectName: keyof FormData | "otp", // Allow 'otp' as objectName
    e: { name: string; value: string }
  ) => void;
  handleNext?: () => Promise<void>; // Make async for signup call
  handlePrev?: () => void;
  handleDateChange?: (dates: { from: Date; to: Date }) => void;
  validationErrors: ValidationErrors;
  agreementChecked?: boolean;
  setAgreementChecked?: (checked: boolean) => void;
  handleSubmit?: () => void;
  isLoading?: boolean;
  downloadCampRules?: () => void; // Added missing prop
  handlePhonePrefixChange?: (prefix: string) => void; // Add prefix handler
}

export interface Step3Props {
  formData: FormData;
  handlePrev: () => void;
  handleSubmit: () => void;
  agreementChecked: boolean;
  setAgreementChecked: (checked: boolean) => void;
  downloadCampRules: () => void;
  isLoading?: boolean;
}
