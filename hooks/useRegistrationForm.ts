import { useState } from "react";
import { FormData, ValidationErrors } from "@/types/form";
import { validateUserFields } from "@/utils/validation"; // Removed validateAuthFields
import { dateRange, payTaxToOptions } from "@/lib/constants";
import { toast } from "sonner";
import {supabaseBrowserClient} from "@/lib/supabase/client";
import { useRouter} from "next/navigation";
import {getNewUserMetadata} from "@/lib/supabase/database/user";
import {getActiveEdition} from "@/lib/supabase/database/edition";

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
};

export function useRegistrationForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    initialValidationErrors
  );
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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

    // Step 1 (Personal Details) validation
    if (step === 1) {
      // Validate name and age from userData
      const nameError = validateUserFields({ name: formData.userData.name } as FormData["userData"]).name;
      const ageError = validateUserFields({ age: formData.userData.age } as FormData["userData"]).age;

      if (nameError) errors.name = nameError;
      if (ageError) errors.age = ageError;

    }
    // Step 2 (Registration Details) validation
    else if (step === 2) {
      // Validate the rest of userData fields excluding name, age, phone, imageUrl
      const { name, age, phone, imageUrl, ...registrationData } = formData.userData;
      errors = validateUserFields(registrationData as FormData["userData"]); // Validate remaining fields
    }
    // Step 3 (Phone & Confirmation) validation
    else if (step === 3) {
        // Validate phone from userData
        const phoneError = validateUserFields({ phone: formData.userData.phone } as FormData["userData"]).phone;
        if (phoneError) errors.phone = phoneError;
    }


    setValidationErrors(errors);
    // Check if the relevant error keys for the current step are empty
    const relevantErrorKeys = step === 1 ? ['name', 'age', 'image'] :
                              step === 2 ? Object.keys(initialValidationErrors).filter(k => !['name', 'age', 'phone', 'image'].includes(k)) :
                              step === 3 ? ['phone'] : [];

    return relevantErrorKeys.every(
      (key) => !errors[key as keyof ValidationErrors]
    );
  };

  const handleNext = () => {
    // Validate the current step before proceeding
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
      setValidationErrors(initialValidationErrors); // Clear errors for the next step
    } else {
      // Construct a more specific error message based on the step
      let errorMessage = "Te rugăm să completezi toate câmpurile obligatorii corect";
      if (step === 1) errorMessage = "Verifică numele, vârsta și poza.";
      else if (step === 2) errorMessage = "Verifică detaliile înregistrării.";
      else if (step === 3) errorMessage = "Verifică numărul de telefon.";

      toast.error(errorMessage, {
        description: "Verifică câmpurile marcate și încearcă din nou.",
        duration: 5000,
      });
    }
  };

  const handlePrev = () => {
    setStep((prev) => prev - 1);
    setValidationErrors(initialValidationErrors);
  };

    const handleSubmit = async () => {
        // First, validate Step 3 fields (phone and agreement)
        if (!validateStep(3) || !agreementChecked) {
             if (!agreementChecked) {
                toast.error("Trebuie să fii de acord cu regulamentul", {
                    description: "Bifează căsuța de acord înainte de a continua.",
                    duration: 4000,
                });
             } else {
                 toast.error("Te rugăm să completezi numărul de telefon corect", {
                    description: "Verifică câmpul marcat și încearcă din nou.",
                    duration: 4000,
                 });
             }
            return; // Stop submission if validation fails or agreement not checked
        }

        setIsLoading(true);
        const currentEdition = await getActiveEdition(); // TODO remove this after we have edition selector on the UI
        if (!currentEdition) {
            toast.error("Nu am putut găsi ediția activă a taberei.");
            setIsLoading(false);
            return;
        }
        const metaData = getNewUserMetadata(formData, currentEdition.id);
        // Create auth user with metadata. See `create_user_profiles_table` to understand
        const {error, data: {user}} = await supabaseBrowserClient.auth.signUp({
            email: formData.authData.email,
            password: formData.authData.password,
            phone: formData.userData.phone,
            options: {
                data: metaData
            }
        });

        setIsLoading(false);
        if (error) {
            console.error("Sign up error:", error);
            // Handle specific errors (e.g., phone number already exists if using phone auth later)
            // For now, a generic error message
             toast.error("Eroare la crearea contului", {
                 description: error.message || "Te rugăm să încerci din nou sau contactează suportul.",
             });
            return;
        }

        // Show success toast
        toast.success("Cont creat cu succes! Te vom redirecționa în curând...");

        // Log success
        console.log("Auth user created:", user?.id);

        // Delay redirect slightly to show success message
        setTimeout(() => {
            router.replace("/cont");
        }, 1500);
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
