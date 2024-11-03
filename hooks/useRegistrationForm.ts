import { useState } from "react";
import { FormData, ValidationErrors } from "@/types/form";
import { validateAuthFields, validateUserFields } from "@/utils/validation";
import { dateRange, sumToPay } from "@/lib/constants";
import { createUserAccount } from "@/lib/firebase/auth";
import { createUserDocument } from "@/lib/firebase/firestore";

const initialFormData: FormData = {
  authData: {
    email: "",
    password: "",
    confirmPassword: "",
  },
  userData: {
    name: "",
    age: "",
    phone: "",
    church: "Speranta, Oradea",
    payTaxTo: "Rebeca Gros",
    transport: "personal",
    preferences: "",
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    imageUrl: "",
  },
};

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

export function useRegistrationForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    initialValidationErrors
  );
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    objectName: keyof FormData,
    e: { name: string; value: string }
  ) => {
    const { name, value } = e;
    setFormData((prevData) => ({
      ...prevData,
      [objectName]: {
        ...prevData[objectName],
        [name]: value,
      },
    }));
  };

  const handleDateChange = (dates: { from: Date; to: Date }) => {
    setFormData((prevData) => ({
      ...prevData,
      userData: {
        ...prevData.userData,
        startDate: dates.from,
        endDate: dates.to,
      },
    }));
  };

  const validateStep = (stepNumber: number): boolean => {
    let errors: ValidationErrors = { ...initialValidationErrors };

    switch (stepNumber) {
      case 1:
        const authErrors = validateAuthFields(formData.authData);
        errors = { ...errors, ...authErrors };
        break;
      case 2:
        const userErrors = validateUserFields(formData.userData);
        errors = { ...errors, ...userErrors };
        break;
      default:
        return true;
    }

    setValidationErrors(errors);
    return Object.keys(errors).every((key) => !errors[key]);
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
      setValidationErrors(initialValidationErrors);
    }
  };

  const handlePrev = () => {
    setStep((prev) => prev - 1);
    setValidationErrors(initialValidationErrors);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Create auth user
      const user = await createUserAccount(
        formData.authData.email,
        formData.authData.password
      );

      // Create user document with the image URL
      await createUserDocument(
        user.uid,
        formData,
        formData.userData.imageUrl || ""
      );

      // Log success
      console.group("Registration Success");
      console.log("User created:", user.uid);
      console.log("Document created in Firestore");
      console.groupEnd();

      window.location.href = "/cont";
    } catch (error: any) {
      console.error("Registration error:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (imageUrl: string) => {
    setFormData((prevData) => ({
      ...prevData,
      userData: {
        ...prevData.userData,
        imageUrl: imageUrl,
      },
    }));
  };

  return {
    step,
    formData,
    validationErrors,
    agreementChecked,
    isLoading,
    handleChange,
    handleDateChange,
    handleNext,
    handlePrev,
    handleSubmit,
    setAgreementChecked,
    handleImageChange,
  };
}
