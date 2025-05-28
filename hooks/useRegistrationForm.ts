import { useState } from "react";
import { FormData, ValidationErrors } from "@/types/form";
import {validateUserFields, validateOtp, validateAuthFields} from "@/utils/validation"; // Added validateOtp
import { dateRange, payTaxToOptions } from "@/lib/constants";
import { toast } from "sonner";
import { supabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter} from "next/navigation";
import {getNewUserMetadata} from "@/lib/supabase/database/user";
import {getActiveEdition} from "@/lib/supabase/database/edition";

const initialFormData: FormData = {
  authData: {
    phone: "",
    phonePrefix: "+4", // Initialize with Romania prefix
  },
  userData: {
    name: "",
    age: "",
    church: "",
    churchOther: "",
    churchContact: "",
    payTaxTo: "",
    transport: "",
    preferences: "",
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    imageUrl: "",
  },
};

const initialValidationErrors: ValidationErrors = {
  name: "",
  age: "",
  phone: "",
  dateRange: "",
  church: "",
  payTaxTo: "",
  transport: "",
  otp: "", // Added OTP initial error
};

export function useRegistrationForm() {
  const [step, setStep] = useState(1); // Start at step 1
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [otp, setOtp] = useState(""); // Added OTP state
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    initialValidationErrors
  );
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (
    objectName: keyof FormData | "otp", // Allow 'otp'
    e: { name: string; value: string }
  ) => {
    const { name, value } = e;
    // This generic handler might not be ideal for OTP, use handleOtpChange instead
    if (objectName === "otp") {
      console.warn("handleChange called for OTP, use handleOtpChange instead.");
      return; // Prevent updating formData directly for OTP
    }
    // Handle standard form data
    setFormData((prevData) => ({
      ...prevData,
      [objectName]: {
        ...prevData[objectName],
        [name]: value,
      },
    }));
  };

  // Specific handler for the InputOTP component
  const handleOtpChange = (value: string) => {
    setOtp(value);
    // Clear OTP validation error on change
    if (validationErrors.otp) {
      setValidationErrors((prev) => ({ ...prev, otp: "" }));
    }
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
      const nameError = validateUserFields({
        name: formData.userData.name,
      }).name;
      const ageError = validateUserFields({ age: formData.userData.age }).age;

      if (nameError) errors.name = nameError;
      if (ageError) errors.age = ageError;
    }
    // Step 2 (Registration Details) validation
    else if (step === 2) {
      // Validate the rest of userData fields excluding name, age, imageUrl
      const { name, age, imageUrl, ...registrationData } = formData.userData;
      errors = validateUserFields(registrationData); // Validate remaining fields
    }
    // Step 3 (Phone & Confirmation) validation - only phone needed here before signup/OTP send
    else if (step === 3) {
      const phoneError = validateAuthFields({
        phone: formData.authData.phone,
        phonePrefix: formData.authData.phonePrefix,
      }).phone;
      if (phoneError) errors.phone = phoneError;
      // Agreement is checked separately in handleNext
    }
    // Step 4 (OTP Verification) validation
    else if (step === 4) {
      const otpError = validateOtp(otp).otp; // Use the dedicated OTP validation
      if (otpError) errors.otp = otpError;
    }

    setValidationErrors(errors);
    // Determine relevant keys for the current step's validation check
    let relevantErrorKeys: (keyof ValidationErrors)[] = [];
    if (step === 1) relevantErrorKeys = ["name", "age"];
    // Image is optional/handled separately
    else if (step === 2)
      relevantErrorKeys = Object.keys(initialValidationErrors).filter(
        (k) => !["name", "age", "phone", "otp", "image"].includes(k)
      ) as (keyof ValidationErrors)[];
    else if (step === 3) relevantErrorKeys = ["phone"];
    else if (step === 4) relevantErrorKeys = ["otp"];

    return relevantErrorKeys.every(
      (key) => !errors[key as keyof ValidationErrors]
    );
  };

  // Updated handleNext for Step 3: Direct Registration without OTP
  const handleNext = async () => {
    // Step 3: Final step - validate phone/agreement, then call signUp
    if (step === 3) {
      const phoneError = validateAuthFields({
        phone: formData.authData.phone,
        phonePrefix: formData.authData.phonePrefix,
      }).phone;
      if (phoneError || !agreementChecked) {
        setValidationErrors((prev) => ({ ...prev, phone: phoneError || "" }));
        if (!agreementChecked) {
          toast.error("Trebuie să fii de acord cu regulamentul", {
            description: "Bifează căsuța de acord înainte de a continua.",
            duration: 4000,
          });
        } else if (phoneError) {
          toast.error("Te rugăm să completezi numărul de telefon corect", {
            description: "Verifică câmpul marcat și încearcă din nou.",
            duration: 4000,
          });
        }
        return;
      }

      setIsLoading(true);
      setValidationErrors(initialValidationErrors);

      const currentEdition = await getActiveEdition();
      if (!currentEdition) {
        toast.error("Nu am putut găsi ediția activă a taberei.");
        setIsLoading(false);
        return;
      }
      const metaData = getNewUserMetadata(formData, currentEdition.id);
      const randomPassword = Math.random().toString(36).slice(-12);

      try {
        const normalizedPhone =
          formData.authData.phonePrefix + formData.authData.phone;

        // Direct sign up without OTP verification
        const { data, error } = await supabaseBrowserClient.auth.signUp({
          phone: normalizedPhone,
          password: randomPassword,
          options: {
            data: metaData,
          },
        });

        setIsLoading(false);

        if (error) {
          console.error("Sign Up Error:", error);
          let description =
            error.message || "Verifică numărul de telefon și încearcă din nou.";
          if (error.message.includes("User already registered")) {
            description = "Acest număr de telefon este deja înregistrat.";
          } else if (error.message.includes("rate limit")) {
            description = "Prea multe încercări. Te rugăm să aștepți puțin.";
          }
          toast.error("Eroare la înregistrare", { description });
          return;
        }

        // Since phone confirmations are disabled, we still need to sign in the user
        // Use signInWithPassword with the same credentials
        const { error: signInError } =
          await supabaseBrowserClient.auth.signInWithPassword({
            phone: normalizedPhone,
            password: randomPassword,
          });

        if (signInError) {
          console.error("Sign In Error:", signInError);
          toast.error("Cont creat, dar autentificarea a eșuat", {
            description: "Te rugăm să te autentifici manual.",
          });
          // Redirect to login page instead
          setTimeout(() => {
            router.replace("/login");
          }, 1500);
          return;
        }

        toast.success("Înregistrare reușită!", {
          description:
            "Contul tău a fost creat cu succes și ești autentificat.",
        });

        // Redirect to account page after successful registration
        setTimeout(() => {
          router.replace("/cont");
        }, 1500);
      } catch (err) {
        setIsLoading(false);
        console.error("Unexpected error during signUp:", err);
        toast.error("A apărut o eroare neașteptată.");
      }
    }
    // Standard validation and step progression for Steps 1 & 2
    else if (validateStep(step)) {
      setStep((prev) => prev + 1);
      setValidationErrors(initialValidationErrors);
    } else {
      let errorMessage =
        "Te rugăm să completezi toate câmpurile obligatorii corect";
      if (step === 1) errorMessage = "Verifică numele și vârsta.";
      else if (step === 2) errorMessage = "Verifică detaliile înregistrării.";

      toast.error(errorMessage, {
        description: "Verifică câmpurile marcate și încearcă din nou.",
        duration: 5000,
      });
    }
  };

  const handlePrev = () => {
    setStep((prev) => prev - 1);
    setValidationErrors(initialValidationErrors);
    // Clear OTP when going back from step 4
    if (step === 4) {
      setOtp("");
    }
  };

  // handleSubmit is called from Step 3: Direct Registration
  const handleSubmit = async () => {
    // Validate phone/agreement
    const phoneError = validateAuthFields({
      phone: formData.authData.phone,
      phonePrefix: formData.authData.phonePrefix,
    }).phone;

    if (phoneError || !agreementChecked) {
      setValidationErrors((prev) => ({ ...prev, phone: phoneError || "" }));
      if (!agreementChecked) {
        toast.error("Trebuie să fii de acord cu regulamentul", {
          description: "Bifează căsuța de acord înainte de a continua.",
          duration: 4000,
        });
      } else if (phoneError) {
        toast.error("Te rugăm să completezi numărul de telefon corect", {
          description: "Verifică câmpul marcat și încearcă din nou.",
          duration: 4000,
        });
      }
      return;
    }

    setIsLoading(true);
    setValidationErrors(initialValidationErrors);

    const currentEdition = await getActiveEdition();
    if (!currentEdition) {
      toast.error("Nu am putut găsi ediția activă a taberei.");
      setIsLoading(false);
      return;
    }
    const metaData = getNewUserMetadata(formData, currentEdition.id);
    const randomPassword = Math.random().toString(36).slice(-12);

    try {
      const normalizedPhone =
        formData.authData.phonePrefix + formData.authData.phone;

      // Direct sign up without OTP verification
      const { data, error } = await supabaseBrowserClient.auth.signUp({
        phone: normalizedPhone,
        password: randomPassword,
        options: {
          data: metaData,
        },
      });

      if (error) {
        setIsLoading(false);
        console.error("Sign Up Error:", error);
        let description =
          error.message || "Verifică numărul de telefon și încearcă din nou.";
        if (error.message.includes("User already registered")) {
          description = "Acest număr de telefon este deja înregistrat.";
        } else if (error.message.includes("rate limit")) {
          description = "Prea multe încercări. Te rugăm să aștepți puțin.";
        }
        toast.error("Eroare la înregistrare", { description });
        return;
      }

      // Since phone confirmations are disabled, we still need to sign in the user
      // Use signInWithPassword with the same credentials
      const { error: signInError } =
        await supabaseBrowserClient.auth.signInWithPassword({
          phone: normalizedPhone,
          password: randomPassword,
        });

      setIsLoading(false);

      if (signInError) {
        console.error("Sign In Error:", signInError);
        toast.error("Cont creat, dar autentificarea a eșuat", {
          description: "Te rugăm să te autentifici manual.",
        });
        // Redirect to login page instead
        setTimeout(() => {
          router.replace("/login");
        }, 1500);
        return;
      }

      toast.success("Înregistrare reușită!", {
        description: "Contul tău a fost creat cu succes și ești autentificat.",
      });

      // Redirect to account page after successful registration
      setTimeout(() => {
        router.replace("/cont");
      }, 1500);
    } catch (err) {
      setIsLoading(false);
      console.error("Unexpected error during signUp:", err);
      toast.error("A apărut o eroare neașteptată.");
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

  // Function to resend OTP
  const resendOtp = async () => {
    setIsLoading(true); // Indicate loading state
    try {
      // Normalize phone number to E.164 format
      const normalizedPhone =
        formData.authData.phonePrefix + formData.authData.phone;

      // Call Supabase resend function
      const { data, error } = await supabaseBrowserClient.auth.resend({
        type: "sms", // Specify the type of OTP being resent
        phone: normalizedPhone,
      });

      setIsLoading(false);

      if (error) {
        console.error("Resend OTP Error:", error);
        let description = error.message || "A apărut o eroare.";
        if (error.message.includes("rate limit")) {
          description =
            "Prea multe încercări. Te rugăm să aștepți puțin înainte de a reîncerca.";
        } else if (error.message.includes("valid phone number")) {
          description =
            "Numărul de telefon nu este valid. Te rugăm să te întorci și să îl corectezi.";
        }
        toast.error("Eroare la retrimiterea codului", { description });
        throw error; // Re-throw error to be caught by the caller if needed
      }

      console.log("Resend OTP Response:", data);
      toast.success("Codul de verificare a fost retrimis!", {
        description: `Verifică SMS-ul primit la ${formData.authData.phone}.`,
      });
    } catch (err) {
      setIsLoading(false);
      console.error("Unexpected error during resend OTP:", err);
      // Avoid duplicate toast if already handled above
      if (!(err instanceof Error && err.message.includes("rate limit"))) {
        toast.error("A apărut o eroare neașteptată la retrimiterea codului.");
      }
      throw err; // Re-throw error
    }
  };

  // Add a handler for phone prefix changes
  const handlePhonePrefixChange = (prefix: string) => {
    setFormData((prevData) => ({
      ...prevData,
      authData: {
        ...prevData.authData,
        phonePrefix: prefix,
      },
    }));
    // Clear phone validation error if it exists
    if (validationErrors.phone) {
      setValidationErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  return {
    step,
    formData,
    otp, // Pass OTP state
    validationErrors,
    agreementChecked,
    isLoading,
    handleChange,
    handleDateChange,
    handleNext,
    handlePrev,
    handleSubmit, // Pass final submit handler (verifyOtp)
    setAgreementChecked,
    handleImageChange,
    handleOtpChange,
    handlePhonePrefixChange, // Add new handler to return object
    resendOtp, // Return the resendOtp function
  };
}
