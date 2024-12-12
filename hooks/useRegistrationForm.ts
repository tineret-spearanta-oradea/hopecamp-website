import { useState } from "react";
import { FormData, ValidationErrors } from "@/types/form";
import { validateAuthFields, validateUserFields } from "@/utils/validation";
import { dateRange, sumToPay, payTaxToOptions } from "@/lib/constants";
import { createUserAccount } from "@/lib/firebase/auth";
import { createUserDocument } from "@/lib/firebase/firestore";
import { toast } from "sonner";

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
    churchOther: "",
    churchContact: "",
    payTaxTo: payTaxToOptions[0].value,
    transport: "personal",
    preferences: "",
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    imageUrl: "",
    slopeActivity: "no",
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
      setValidationErrors(initialValidationErrors);
    } else {
      toast.error("Te rugăm să completezi toate câmpurile corect", {
        description: "Verifică câmpurile marcate cu roșu și încearcă din nou.",
        duration: 4000,
      });
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

      // Show success toast
      toast.success("Cont creat cu succes! Te vom redirecționa în curând...");

      // Log success
      console.group("Registration Success");
      console.log("User created:", user.uid);
      console.log("Document created in Firestore");
      console.groupEnd();

      // Delay redirect slightly to show success message
      setTimeout(() => {
        window.location.href = "/cont";
      }, 1500);
    } catch (error: any) {
      console.error("Registration error:", error);
      console.log("Error code:", error.code);
      console.log("Error message:", error.message);
      // Handle specific Firebase Auth errors
      switch (error.code) {
        case "auth/email-already-in-use":
          toast.error("Adresa de email există deja", {
            description:
              "Dacă ai deja cont, apasă pe butonul de conectare. Dacă nu, folosește altă adresă de email.",
            duration: 5000,
            action: {
              label: "Conectare",
              onClick: () => (window.location.href = "/login"),
            },
          });
          break;
        case "auth/invalid-email":
          toast.error("Adresa de email nu este validă.", {
            description: "Te rugăm să verifici adresa introdusă.",
          });
          break;
        case "auth/operation-not-allowed":
          toast.error("Înregistrarea nu este permisă momentan.", {
            description: "Te rugăm să încerci mai târziu.",
          });
          break;
        case "auth/weak-password":
          toast.error("Parola este prea slabă.", {
            description: "Te rugăm să alegi o parolă mai puternică.",
          });
          break;
        default:
          toast.error("A apărut o eroare la înregistrare.", {
            description: "Te rugăm să încerci din nou.",
          });
      }
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
