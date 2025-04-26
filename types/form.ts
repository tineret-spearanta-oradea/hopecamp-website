export interface AuthData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UserData {
  name: string;
  age: string;
  phone: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  church: string;
  churchOther?: string;
  churchContact?: string;
  payTaxTo: string;
  transport: string;
  imageUrl: string;
  preferences?: string;
  slopeActivity: string;
}

export interface FormData {
  authData: AuthData;
  userData: UserData;
}

export interface ValidationErrors {
  // email?: string; // Removed - No longer collected in initial steps
  // password?: string; // Removed
  // confirmPassword?: string; // Removed
  name?: string;
  age?: string;
  phone?: string;
  dateRange?: string;
  church?: string;
  payTaxTo?: string;
  transport?: string;
  image?: string;
  slopeActivity?: string;
}

export interface StepProps {
  formData: FormData;
  handleChange: (
    objectName: keyof FormData,
    e: { name: string; value: string }
  ) => void;
  handleNext?: () => void;
  handlePrev?: () => void;
  handleDateChange?: (dates: { from: Date; to: Date }) => void;
  validationErrors: ValidationErrors;
  agreementChecked?: boolean;
  setAgreementChecked?: (checked: boolean) => void;
  handleSubmit?: () => void;
  isLoading?: boolean;
  downloadCampRules?: () => void; // Added missing prop
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
