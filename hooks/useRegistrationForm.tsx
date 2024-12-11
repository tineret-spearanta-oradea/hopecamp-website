import { useState } from "react";
import { FormData, ValidationErrors } from "@/types/form";
import { validateAuthFields, validateUserFields } from "@/utils/validation";
import { dateRange, payTaxToOptions, transportOptions, churchOptions } from "@/lib/constants";
import { createUserAccount } from "@/lib/firebase/auth";
import { createUserDocument } from "@/lib/firebase/firestore";
import { toast } from "@/hooks/use-toast";

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
    church: churchOptions[0].value,
    churchOther: "",
    churchContact: "",
    payTaxTo: payTaxToOptions[0].value,
    transport: transportOptions[0].value,
    preferences: "",
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    imageUrl: "",
    slopeActivity: "no",
  },
};

export function useRegistrationForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    objectName: keyof FormData,
    e: { name: string; value: string }
  ) => {
    setFormData((prev) => ({
      ...prev,
      [objectName]: {
        ...prev[objectName],
        [e.name]: e.value,
      },
    }));
  };

  const handleDateChange = (dates: { from: Date; to: Date }) => {
    setFormData((prev) => ({
      ...prev,
      userData: {
        ...prev.userData,
        startDate: dates.from,
        endDate: dates.to,
      },
    }));
  };

  const handleImageChange = (imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      userData: {
        ...prev.userData,
        imageUrl,
      },
    }));
  };

  const validateStep = (step: number): boolean => {
    let errors: ValidationErrors = {};

    if (step === 1) {
      errors = validateAuthFields(formData.authData);
    } else if (step === 2) {
      errors = validateUserFields(formData.userData);
    }

    setValidationErrors(errors);
    return Object.keys(errors).every(
      (key) => !errors[key as keyof ValidationErrors]
    );
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
      setValidationErrors({});
    }
  };

  const handlePrev = () => {
    setStep((prev) => prev - 1);
    setValidationErrors({});
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Create auth account
      const user = await createUserAccount(
        formData.authData.email,
        formData.authData.password
      );

      if (!user) {
        throw new Error("Failed to create user account");
      }

      // Create user document
      await createUserDocument(user.uid, formData, formData.userData.imageUrl);

      toast({
        title: "Success!",
        description: "Your account has been created. You can now log in.",
      });

      // Reset form
      setFormData(initialFormData);
      setStep(1);
      setAgreementChecked(false);
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
