export interface AuthData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UserData {
  name: string;
  age: string;
  phone: string;
  church: string;
  payTaxTo: string;
  transport: string;
  preferences?: string;
  startDate: Date | null;
  endDate: Date | null;
  imageFile: File | null;
}

export interface FormData {
  authData: AuthData;
  userData: UserData;
}

export interface ValidationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
  age?: string;
  phone?: string;
  dateRange?: string;
  church?: string;
  payTaxTo?: string;
  transport?: string;
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
}
