import { useState } from "react";
import { FormData, ValidationErrors } from "@/types/form";
import { validateUserFields, validateOtp } from "@/utils/validation"; // Added validateOtp
import { dateRange, payTaxToOptions } from "@/lib/constants";
import { toast } from "sonner";
import { supabaseBrowserClient } from "@/lib/supabase/client";
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
    // Step 3 (Phone & Confirmation) validation - only phone needed here before signup/OTP send
    else if (step === 3) {
        const phoneError = validateUserFields({ phone: formData.userData.phone } as FormData["userData"]).phone;
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
    if (step === 1) relevantErrorKeys = ['name', 'age']; // Image is optional/handled separately
    else if (step === 2) relevantErrorKeys = Object.keys(initialValidationErrors).filter(k => !['name', 'age', 'phone', 'otp', 'image'].includes(k)) as (keyof ValidationErrors)[];
    else if (step === 3) relevantErrorKeys = ['phone'];
    else if (step === 4) relevantErrorKeys = ['otp'];


    return relevantErrorKeys.every(
      (key) => !errors[key as keyof ValidationErrors]
    );
  };

  // Updated handleNext for Step 3: Trigger SignUp & OTP Send
  const handleNext = async () => {
    // Step 3 -> Step 4: Validate phone/agreement, then call signUp
    if (step === 3) {
      const phoneError = validateUserFields({ phone: formData.userData.phone } as FormData["userData"]).phone;
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
        return; // Stop if validation fails or agreement not checked
      }

      setIsLoading(true);
      setValidationErrors(initialValidationErrors); // Clear previous errors

      const currentEdition = await getActiveEdition();
      if (!currentEdition) {
        toast.error("Nu am putut găsi ediția activă a taberei.");
        setIsLoading(false);
        return;
      }
      const metaData = getNewUserMetadata(formData, currentEdition.id);
      const randomPassword = Math.random().toString(36).slice(-12); // Generate random password

      try {
        // Call signUp - this creates the user and should trigger OTP send if confirmations are enabled
        const { data, error } = await supabaseBrowserClient.auth.signUp({
          phone: formData.userData.phone,
          password: randomPassword,
          options: {
            data: metaData, // Pass user metadata here!
            // channel: 'whatsapp' // Optional: if using WhatsApp channel
          },
        });

        setIsLoading(false);

        if (error) {
          console.error("Sign Up Error (OTP Trigger):", error);
          let description = error.message || "Verifică numărul de telefon și încearcă din nou.";
          if (error.message.includes("User already registered")) {
             description = "Acest număr de telefon este deja înregistrat. Vom trimite codul de verificare pentru conectare.";
             // Even if user exists, proceed to OTP verification step (Step 4)
             // Supabase might handle this by sending OTP for login instead of signup confirmation
          } else if (error.message.includes("rate limit")) {
              description = "Prea multe încercări. Te rugăm să aștepți puțin.";
          }
          toast.error("Eroare la inițierea înregistrării", { description });
          // Only stop if it's not a "user already exists" error, otherwise proceed to OTP step
          if (!error.message.includes("User already registered")) {
              return;
          }
        }

        // DEBUG: Log Supabase response
        console.log("signUp response (OTP Trigger):", data);

        toast.success("Codul de verificare a fost trimis!", {
          description: `Verifică SMS-ul primit la ${formData.userData.phone}.`,
        });
        setStep(4); // Proceed to Step 4 (OTP entry)

      } catch (err) {
        setIsLoading(false);
        console.error("Unexpected error during signUp:", err);
        toast.error("A apărut o eroare neașteptată.");
      }
    }
    // Standard validation and step progression for Steps 1 & 2
    else if (validateStep(step)) {
        setStep((prev) => prev + 1);
        setValidationErrors(initialValidationErrors); // Clear errors for the next step
    } else {
        // Construct a more specific error message based on the step
        let errorMessage = "Te rugăm să completezi toate câmpurile obligatorii corect";
        if (step === 1) errorMessage = "Verifică numele și vârsta."; // Image checked separately
        else if (step === 2) errorMessage = "Verifică detaliile înregistrării.";
        // Step 3 handled above
        else if (step === 4) errorMessage = "Verifică codul OTP.";


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

    // handleSubmit is called from Step 4: Verify OTP
    const handleSubmit = async () => {
      // Validate OTP first
      const otpError = validateOtp(otp).otp;
      if (otpError) {
        setValidationErrors({ otp: otpError });
        toast.error("Codul OTP nu este valid.", {
          description: "Te rugăm să introduci codul format din 6 cifre primit prin SMS.",
        });
        return;
      }

      setIsLoading(true);
      setValidationErrors(initialValidationErrors); // Clear errors

      try {
        // Verify the OTP using the phone number and token
        const { data: { session, user }, error: verifyError } = await supabaseBrowserClient.auth.verifyOtp({
          phone: formData.userData.phone,
          token: otp,
          type: 'sms', // Ensure type matches how OTP was sent (usually 'sms' for phone signup)
        });

        setIsLoading(false);

        if (verifyError) {
          console.error("OTP Verification Error:", verifyError);
          let description = verifyError.message || "Te rugăm să încerci din nou.";
          if (verifyError.message.includes("expired")) {
              description = "Codul OTP nu e valid sau a expirat. Te rugăm să încerci din nou.";
          } else if (verifyError.message.includes("already verified") || verifyError.message.includes("already used")) {
              description = "Acest cod a fost deja folosit.";
              // Consider redirecting if already verified? Or just inform user.
          } else {
              description = "Codul OTP este invalid. Verifică codul și încearcă din nou.";
          }
          toast.error("Eroare la verificarea codului", { description });
          return;
        }

        // If verification is successful, the user is now authenticated.
        console.log("OTP Verified Successfully. Session:", session, "User:", user);

        // The handle_new_user trigger should have run when signUp was called in handleNext.
        // If the user already existed, the trigger wouldn't run, but verifyOtp logs them in.
        // We assume the profile/registration data is either newly created or already exists.

        toast.success("Verificare reușită! Cont creat/accesat cu succes!");

        // Redirect to the account page after a short delay
        setTimeout(() => {
          router.replace("/cont"); // Use replace to prevent going back to OTP screen
        }, 1500);

      } catch (err) {
        setIsLoading(false);
        console.error("Unexpected error during OTP verification:", err);
        toast.error("A apărut o eroare neașteptată la verificare.");
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
    handleOtpChange, // Pass OTP input handler
  };
}
