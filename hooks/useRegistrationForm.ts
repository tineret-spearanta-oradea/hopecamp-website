import { useState } from "react";
import { FormData, ValidationErrors } from "@/types/form";
import { validateAuthFields, validateUserFields } from "@/utils/validation";
import { dateRange, sumToPay } from "@/lib/constants";
import { createUserAccount } from "@/lib/firebase/auth";
import { uploadImage } from "@/lib/firebase/storage";
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
    imageFile: null,
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
    let errors: ValidationErrors = {};

    switch (stepNumber) {
      case 1:
        errors = validateAuthFields(formData.authData);
        break;
      case 2:
        errors = validateUserFields(formData.userData);
        break;
      default:
        return true;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
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
    setIsLoading(true);
    try {
      // Create auth user
      const user = await createUserAccount(
        formData.authData.email,
        formData.authData.password
      );

      // Upload image
      const imageUrl = await uploadImage(
        user.uid,
        formData.userData.imageFile!
      );

      // Create user document
      await createUserDocument(user.uid, formData, imageUrl);

      // Log success
      console.group("Registration Success");
      console.log("User created:", user.uid);
      console.log("Image uploaded:", imageUrl);
      console.log("Document created in Firestore");
      console.groupEnd();

      // TODO: Redirect to success page or login
      window.location.href = "/cont";
    } catch (error: any) {
      console.error("Registration error:", error);
      // TODO: Show error to user
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (file: File | null) => {
    setFormData((prevData) => ({
      ...prevData,
      userData: {
        ...prevData.userData,
        imageFile: file,
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
