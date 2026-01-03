import { useState, useEffect } from "react";
import { FormData, ValidationErrors } from "@/types/form";
import {validateUserFields, validateOtp, validateAuthFields} from "@/utils/validation";
import { dateRange, payTaxToOptions } from "@/lib/constants";
import { toast } from "sonner";
import { supabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import {getNewUserMetadata} from "@/lib/supabase/database/user";
import {getActiveEdition} from "@/lib/supabase/database/edition";
import { predictAndUpdateGender } from "@/lib/supabase/genderPrediction";
import {
  getUserMostRecentRegistration,
  checkUserRegistrationExists,
  createRegistrationForReturningUser
} from "@/lib/supabase/database/registration";
import { Edition } from "@/types/edition";
import { useAuth } from "@/contexts/auth-context";

const initialFormData: FormData = {
  authData: {
    phone: "",
    phonePrefix: "+4",
  },
  userData: {
    name: "",
    age: "",
    gender: "unknown" as 'male' | 'female' | 'unknown',
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
  const [step, setStep] = useState(0); // NOW STARTS AT 0
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [phoneData, setPhoneData] = useState({
    phone: "",
    phonePrefix: "+4"
  });
  const [otpData, setOtpData] = useState({
    otp: "",
    isReturningUser: false,
    otpSent: false
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    initialValidationErrors
  );
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [currentEdition, setCurrentEdition] = useState<Edition | null>(null);
  const [blockReason, setBlockReason] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [otpFailed, setOtpFailed] = useState(false);
  const [pendingContactMode, setPendingContactMode] = useState(false);
  const [pendingContactCreated, setPendingContactCreated] = useState(false);
  const router = useRouter();
  const { supabaseUser, loading: authLoading } = useAuth();

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

  // Handler for phone changes in Step0
  const handlePhoneChange = (value: string) => {
    setPhoneData((prev) => ({ ...prev, phone: value }));
    if (validationErrors.phone) {
      setValidationErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  // Handler for phone prefix changes in Step0
  const handlePhonePrefixChange = (prefix: string) => {
    setPhoneData((prev) => ({ ...prev, phonePrefix: prefix }));
    if (validationErrors.phone) {
      setValidationErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  // Handler for OTP changes
  const handleOtpChange = (value: string) => {
    setOtpData((prev) => ({ ...prev, otp: value }));
    if (validationErrors.otp) {
      setValidationErrors((prev) => ({ ...prev, otp: "" }));
    }
  };

  // Age calculation helper
  const calculateUpdatedAge = (lastAge: number, lastRegistrationDate: Date): number => {
    const yearsDiff = new Date().getFullYear() - lastRegistrationDate.getFullYear();
    return lastAge + yearsDiff;
  };

  // Handle phone submission (Step 0 → check if user exists)
  const handlePhoneSubmit = async () => {
    // Validate phone
    const phoneError = validateAuthFields({
      phone: phoneData.phone,
      phonePrefix: phoneData.phonePrefix
    }).phone;

    if (phoneError) {
      setValidationErrors((prev) => ({ ...prev, phone: phoneError }));
      toast.error("Te rugăm să completezi numărul de telefon corect");
      return;
    }

    setIsLoading(true);

    try {
      const normalizedPhone = phoneData.phonePrefix + phoneData.phone;

      // Call API to check if phone exists
      const response = await fetch('/api/check-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: normalizedPhone })
      });

      if (!response.ok) {
        if (response.status === 429) {
          toast.error("Prea multe încercări. Te rugăm să aștepți puțin.");
          setIsLoading(false);
          return;
        }
        throw new Error('Failed to check phone');
      }

      const { exists } = await response.json();

      if (exists) {
        // RETURNING USER - Send OTP
        const { error } = await supabaseBrowserClient.auth.signInWithOtp({
          phone: normalizedPhone,
          options: {
            channel: 'sms'
          }
        });

        if (error) {
          console.error("OTP Send Error:", error);
          // Set otpFailed to show "continue without verification" option
          setOtpFailed(true);
          toast.error("Nu am putut trimite codul de verificare", {
            description: "Poți continua cu înregistrarea, iar cineva te va contacta pentru verificare.",
            duration: 8000,
          });
          setIsLoading(false);
          return;
        }

        setOtpData((prev) => ({ ...prev, otpSent: true, isReturningUser: true }));
        toast.success("Codul a fost trimis!", {
          description: `Verifică SMS-ul primit la ${phoneData.phone}`
        });
      } else {
        // NEW USER - Skip OTP, go to Step 1
        setIsReturningUser(false);
        setIsAuthenticated(true);
        setStep(1);
        toast.success("Bine ai venit! Să începem înregistrarea.");
      }
    } catch (error) {
      console.error("Error checking phone:", error);
      toast.error("A apărut o eroare neașteptată.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP verification (for returning users)
  const handleOtpVerify = async () => {
    const otpError = validateOtp(otpData.otp).otp;

    if (otpError) {
      setValidationErrors((prev) => ({ ...prev, otp: otpError }));
      toast.error("Te rugăm să introduci un cod valid de 6 cifre");
      return;
    }

    setIsLoading(true);

    try {
      const normalizedPhone = phoneData.phonePrefix + phoneData.phone;

      const { data, error } = await supabaseBrowserClient.auth.verifyOtp({
        phone: normalizedPhone,
        token: otpData.otp,
        type: 'sms'
      });

      if (error) {
        console.error("OTP Verify Error:", error);
        toast.error("Cod incorect", {
          description: "Verifică codul și încearcă din nou."
        });
        setIsLoading(false);
        return;
      }

      // User is now authenticated via OTP - they're a returning user
      setIsAuthenticated(true);
      setIsReturningUser(true); // ← SET THIS FOR ANYONE WHO USES OTP

      console.log("OTP VERIFIED - Set isReturningUser to TRUE");
      console.log("Authenticated user ID:", data.user!.id);

      if (!currentEdition) {
        toast.error("Nu am putut găsi ediția activă.");
        setIsLoading(false);
        return;
      }

      // Check if already registered for current edition
      const alreadyRegistered = await checkUserRegistrationExists(
        data.user!.id,
        currentEdition.id
      );

      if (alreadyRegistered) {
        setBlockReason("Ești deja înscris pentru această ediție!");
        setIsLoading(false);
        return;
      }

      // Fetch previous registration data
      const lastRegistration = await getUserMostRecentRegistration(data.user!.id);

      if (lastRegistration) {
        // Pre-fill form with previous registration data
        const calculatedAge = calculateUpdatedAge(
          lastRegistration.age,
          lastRegistration.createdAt
        );

        setFormData({
          authData: {
            phone: phoneData.phone,
            phonePrefix: phoneData.phonePrefix
          },
          userData: {
            name: lastRegistration.name,
            age: calculatedAge.toString(),
            gender: lastRegistration.gender,
            imageUrl: lastRegistration.imageUrl || "",
            church: lastRegistration.church || "",
            churchOther: lastRegistration.churchOther || "",
            churchContact: lastRegistration.churchContact || "",
            preferences: lastRegistration.preferences || "",
            // Leave blank (commonly change)
            transport: "",
            payTaxTo: "",
            // Default dates
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
          }
        });

        toast.success("Autentificat cu succes!", {
          description: "Datele tale au fost precompletate."
        });
      } else {
        // No previous registration - show empty form but they're still a returning user
        toast.success("Autentificat cu succes!", {
          description: "Completează formularul de înregistrare."
        });
      }

      // Move to Step 1
      setStep(1);

    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("A apărut o eroare neașteptată.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for continuing without OTP verification (when OTP sending fails)
  const handleContinueWithoutOtp = () => {
    // User chose to continue without OTP verification
    // They will complete the form and it will be saved to pending_contacts
    setPendingContactMode(true);
    setIsReturningUser(true); // They are a returning user, just can't verify
    setIsAuthenticated(false); // Not truly authenticated
    setStep(1);
    toast.info("Completează formularul. Te vom contacta pentru verificare.", {
      duration: 6000,
    });
  };

  const validateStep = (step: number): boolean => {
    let errors: ValidationErrors = {};

    // Step 1 (Personal Details) validation
    if (step === 1) {
      const nameError = validateUserFields({
        name: formData.userData.name,
      }).name;
      const ageError = validateUserFields({ age: formData.userData.age }).age;

      if (nameError) errors.name = nameError;
      if (ageError) errors.age = ageError;
    }
    // Step 2 (Registration Details) validation
    else if (step === 2) {
      const { name, age, imageUrl, ...registrationData } = formData.userData;
      errors = validateUserFields(registrationData);
    }

    setValidationErrors(errors);

    // Determine relevant keys for the current step's validation check
    let relevantErrorKeys: (keyof ValidationErrors)[] = [];
    if (step === 1) relevantErrorKeys = ["name", "age"];
    else if (step === 2)
      relevantErrorKeys = Object.keys(initialValidationErrors).filter(
        (k) => !["name", "age", "phone", "otp", "image"].includes(k)
      ) as (keyof ValidationErrors)[];

    return relevantErrorKeys.every(
      (key) => !errors[key as keyof ValidationErrors]
    );
  };

  // handleNext for Steps 1 & 2 (Step 0 uses handlePhoneSubmit, Step 3 uses handleSubmit)
  const handleNext = async () => {
    if (validateStep(step)) {
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
  };

  // handleSubmit is called from Step 3: Final submission
  const handleSubmit = async () => {
    // Validate agreement
    if (!agreementChecked) {
      toast.error("Trebuie să fii de acord cu regulamentul", {
        description: "Bifează căsuța de acord înainte de a continua.",
        duration: 4000,
      });
      return;
    }

    setIsLoading(true);
    setValidationErrors(initialValidationErrors);

    if (!currentEdition) {
      toast.error("Nu am putut găsi ediția activă a taberei.");
      setIsLoading(false);
      return;
    }

    // Update formData to include phone info
    const updatedFormData = {
      ...formData,
      authData: {
        phone: phoneData.phone,
        phonePrefix: phoneData.phonePrefix
      }
    };

    const normalizedPhone = phoneData.phonePrefix + phoneData.phone;

    // PENDING CONTACT MODE: Save to pending_contacts instead of creating registration
    if (pendingContactMode) {
      try {
        const response = await fetch('/api/pending-contacts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: normalizedPhone,
            name: updatedFormData.userData.name,
            form_data: {
              age: updatedFormData.userData.age,
              gender: updatedFormData.userData.gender,
              church: updatedFormData.userData.church,
              churchOther: updatedFormData.userData.churchOther,
              churchContact: updatedFormData.userData.churchContact,
              transport: updatedFormData.userData.transport,
              payTaxTo: updatedFormData.userData.payTaxTo,
              preferences: updatedFormData.userData.preferences,
              startDate: updatedFormData.userData.startDate?.toISOString(),
              endDate: updatedFormData.userData.endDate?.toISOString(),
              imageUrl: updatedFormData.userData.imageUrl,
            },
            edition_id: currentEdition.id,
            existing_user_id: null,
          }),
        });

        setIsLoading(false);

        if (!response.ok) {
          const errorData = await response.json();
          toast.error("Eroare la salvarea datelor", {
            description: errorData.error || "Te rugăm să încerci din nou.",
          });
          return;
        }

        setPendingContactCreated(true);
        toast.success("Datele tale au fost salvate!", {
          description: "Cineva din echipă te va contacta pentru a finaliza înregistrarea.",
          duration: 10000,
        });

        // Show success state - stay on step 3 but show confirmation
        // or redirect to a confirmation page
        return;
      } catch (err) {
        setIsLoading(false);
        console.error("Error creating pending contact:", err);
        toast.error("A apărut o eroare neașteptată.");
        return;
      }
    }

    const metaData = getNewUserMetadata(updatedFormData, currentEdition.id);
    const randomPassword = Math.random().toString(36).slice(-12);

    try {

      // Get current user (might be more up-to-date than context)
      const { data: { user: currentUser } } = await supabaseBrowserClient.auth.getUser();

      console.log("handleSubmit - isReturningUser:", isReturningUser);
      console.log("handleSubmit - currentUser:", currentUser?.id);
      console.log("handleSubmit - supabaseUser:", supabaseUser?.id);

      if (isReturningUser && currentUser) {
        // RETURNING USER - Already authenticated, need to manually create registration

        // 1. Update user profile with any changes
        const { error: profileError } = await supabaseBrowserClient
          .from("user_profiles")
          .update({
            name: updatedFormData.userData.name,
            age: parseInt(updatedFormData.userData.age),
            gender: updatedFormData.userData.gender,
            image_url: updatedFormData.userData.imageUrl,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", currentUser.id);

        if (profileError) {
          console.error("Error updating profile:", profileError);
          setIsLoading(false);
          toast.error("Eroare la actualizarea profilului");
          return;
        }

        // 2. Create new registration for this edition
        const registrationResult = await createRegistrationForReturningUser(
          currentUser.id,
          currentEdition.id,
          {
            church: updatedFormData.userData.church === "alta"
              ? updatedFormData.userData.churchOther || ""
              : updatedFormData.userData.church || "",
            churchContact: updatedFormData.userData.churchContact || "",
            payTaxTo: updatedFormData.userData.payTaxTo,
            transport: updatedFormData.userData.transport,
            preferences: updatedFormData.userData.preferences || "",
            startDate: updatedFormData.userData.startDate || dateRange.startDate,
            endDate: updatedFormData.userData.endDate || dateRange.endDate,
            withFamilyMember: false,
          }
        );

        setIsLoading(false);

        if (!registrationResult.success) {
          toast.error("Eroare la înregistrare", {
            description: registrationResult.error || "Te rugăm să încerci din nou.",
          });
          return;
        }

        toast.success("Înregistrare reușită!", {
          description: "Te-ai înregistrat cu succes pentru această ediție.",
        });

        // Redirect to account page
        setTimeout(() => {
          router.replace("/cont");
        }, 1500);
      } else {
        // NEW USER - Create account
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

        // Sign in the user
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
          setTimeout(() => {
            router.replace("/login");
          }, 1500);
          return;
        }

        toast.success("Înregistrare reușită!", {
          description: "Contul tău a fost creat cu succes și ești autentificat.",
        });

        // Predict gender if unknown
        if (formData.userData.gender === 'unknown' && formData.userData.name && data.user?.id) {
          predictAndUpdateGender(data.user.id, formData.userData.name)
            .then((prediction) => {
              if (prediction) {
                console.log(`Gender prediction for ${formData.userData.name}:`, prediction);
              }
            })
            .catch((error) => {
              console.error('Error predicting gender:', error);
            });
        }

        // Redirect to account page
        setTimeout(() => {
          router.replace("/cont");
        }, 1500);
      }
    } catch (err) {
      setIsLoading(false);
      console.error("Unexpected error during registration:", err);
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

  // Initialization useEffect
  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) {
      console.log("INIT - Waiting for auth to load...");
      return;
    }

    async function init() {
      try {
        // Fetch current edition
        const edition = await getActiveEdition();
        setCurrentEdition(edition);

        console.log("INIT - authLoading complete");
        console.log("INIT - supabaseUser:", supabaseUser?.id);
        console.log("INIT - edition:", edition?.id);

        // Check if user is already logged in (from AuthContext)
        if (supabaseUser) {
          // Check if already registered for this edition
          const alreadyRegistered = await checkUserRegistrationExists(
            supabaseUser.id,
            edition.id
          );

          console.log("INIT - alreadyRegistered:", alreadyRegistered);

          if (alreadyRegistered) {
            console.log("INIT - Redirecting to /cont (already registered)");
            // Redirect to account page
            router.replace('/cont');
            return;
          }

          // If logged in but not registered, pre-fill their data and allow registration
          setIsAuthenticated(true);

          // Fetch previous registration data to pre-fill form
          const lastRegistration = await getUserMostRecentRegistration(supabaseUser.id);

          if (lastRegistration) {
            // Pre-fill form with previous data
            const calculatedAge = calculateUpdatedAge(
              lastRegistration.age,
              lastRegistration.createdAt
            );

            setFormData({
              authData: {
                phone: lastRegistration.phone,
                phonePrefix: "+4" // Default, could be improved by storing this
              },
              userData: {
                name: lastRegistration.name,
                age: calculatedAge.toString(),
                gender: lastRegistration.gender,
                imageUrl: lastRegistration.imageUrl || "",
                church: lastRegistration.church || "",
                churchOther: lastRegistration.churchOther || "",
                churchContact: lastRegistration.churchContact || "",
                preferences: lastRegistration.preferences || "",
                // Leave blank (commonly change)
                transport: "",
                payTaxTo: "",
                // Default dates
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
              }
            });

            setIsReturningUser(true);
          }

          setStep(1); // Skip Step 0 if already authenticated
        }
      } catch (error) {
        console.error("Initialization error:", error);
        setBlockReason("Nu există o ediție activă momentan.");
      } finally {
        setIsInitializing(false);
      }
    }

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, supabaseUser]);

  return {
    step,
    formData,
    phoneData,
    otpData,
    validationErrors,
    agreementChecked,
    isLoading,
    isInitializing,
    isReturningUser,
    currentEdition,
    blockReason,
    otpFailed,
    pendingContactMode,
    pendingContactCreated,
    handleChange,
    handleDateChange,
    handlePhoneChange,
    handlePhonePrefixChange,
    handleOtpChange,
    handlePhoneSubmit,
    handleOtpVerify,
    handleContinueWithoutOtp,
    handleNext,
    handlePrev,
    handleSubmit,
    setAgreementChecked,
    handleImageChange,
  };
}
