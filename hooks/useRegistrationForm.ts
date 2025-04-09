import {useState} from "react";
import {FormData, ValidationErrors} from "@/types/form";
import {validateAuthFields, validateUserFields} from "@/utils/validation";
import {dateRange, payTaxToOptions} from "@/lib/constants";
import {toast} from "sonner";
import {supabaseBrowserClient} from "@/lib/supabase/client";
import { useRouter} from "next/navigation";
import {getNewUserMetadata} from "@/lib/supabase/database/user";

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
            const metaData = getNewUserMetadata(formData);
            // Create auth user with metadata. See `create_users_data_table` to understand
            const {error, data: {user}} = await supabaseBrowserClient.auth.signUp({
                email:formData.authData.email,
                password: formData.authData.password,
                phone: formData.userData.phone,
                options: {
                    data: metaData
                }
            });

            setIsLoading(false);
            if (error) {
                if (error.code === "user_already_exists") {
                    toast.error("Adresa de email există deja", {
                        description:
                            "Dacă ai deja cont, apasă pe butonul de conectare. Dacă nu, folosește altă adresă de email.",
                        duration: 5000,
                        action: {
                            label: "Conectare",
                            onClick: () => router.push("/login"),
                        },
                    });
                    return;
                }
                if (error.code === "validation_failed") {
                    toast.error("Adresa de email nu este validă.", {
                        description: "Te rugăm să verifici adresa introdusă.",
                    });
                    return;
                }
                if (error.code === "weak_password") {
                    toast.error("Parola este prea slabă.", {
                        description: "Te rugăm să alegi o parolă mai puternică. " + error.message,
                    });
                    return;
                }

                toast.error("Ceva nu a mers bine", {
                    description: error.message,
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
