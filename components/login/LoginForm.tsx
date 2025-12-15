"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { PhoneInput } from "../ui/phone-input";
import { toast } from "sonner";
import { supabaseBrowserClient } from "@/lib/supabase/client";
import { Input } from "../ui/input";
import { useAuth } from "@/contexts/auth-context";
import { getActiveEdition } from "@/lib/supabase/database/edition";
import { checkUserRegistrationExists } from "@/lib/supabase/database/registration";

const RESEND_TIMEOUT_SECONDS = 60;

export default function LoginForm() {
  const [phone, setPhone] = useState("");
  const [phonePrefix, setPhonePrefix] = useState("+4");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [resendTimer, setResendTimer] = useState(RESEND_TIMEOUT_SECONDS);
  const [phoneError, setPhoneError] = useState("");
  const router = useRouter();
  const { supabaseUser, loading: authLoading } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && supabaseUser) {
      console.log("LoginForm - User already logged in, redirecting to /cont");
      router.replace("/cont");
    }
  }, [authLoading, supabaseUser, router]);

  // Effect for the resend timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (otpSent && resendDisabled) {
      setResendTimer(RESEND_TIMEOUT_SECONDS); // Reset timer display
      interval = setInterval(() => {
        setResendTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval!);
            setResendDisabled(false);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    } else if (!otpSent || !resendDisabled) {
      // Clear interval if OTP not sent or resend is enabled
      if (interval) clearInterval(interval);
    }

    // Cleanup interval on component unmount or when dependencies change
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpSent, resendDisabled]); // Rerun effect when otpSent or resendDisabled changes

  const handleSendOtp = async () => {
    // Validate based on country code prefix
    setPhoneError(""); // Clear previous errors

    let isValid = false;
    if (phonePrefix === "+4") {
      // Romanian number validation
      isValid = /^07\d{8}$/.test(phone);
      if (!isValid) {
        setPhoneError(
          "Numărul de telefon trebuie să înceapă cu 07 și să aibă 10 cifre (ex: 0770123456)."
        );
        return;
      }
    } else if (phonePrefix === "+1") {
      // US/Canada number validation
      isValid = /^\d{10}$/.test(phone);
      if (!isValid) {
        setPhoneError("Numărul de telefon pentru US trebuie să aibă 10 cifre.");
        return;
      }
    } else {
      // Generic validation for other countries
      isValid = /^\d{6,}$/.test(phone);
      if (!isValid) {
        setPhoneError(
          "Numărul de telefon trebuie să conțină cel puțin 6 cifre."
        );
        return;
      }
    }

    setLoading(true);
    setResendDisabled(true); // Disable resend immediately

    // Normalize phone number to E.164 format for Supabase
    const normalizedPhone = phonePrefix + phone; // Use dynamic prefix

    const { error } = await supabaseBrowserClient.auth.signInWithOtp({
      phone: normalizedPhone, // Use normalized phone
      options: {
        shouldCreateUser: false, // Prevent sign-up
      },
    });

    setLoading(false);
    if (error) {
      console.error("OTP Send Error:", error);
      // Handle specific errors
      if (error.code === "otp_disabled") {
        // Adjust based on actual error message
        toast.error(
          "Numărul de telefon nu este înregistrat. Te rugăm să te înscrii mai întâi."
        );
      } else if (error.code === "over_sms_send_rate_limit") {
        toast.error("Prea multe încercări. Te rugăm să încerci mai târziu.");
      } else {
        toast.error("A apărut o eroare la trimiterea codului.", {
          description: error.message,
        });
      }
      setResendDisabled(false); // Re-enable resend on error
      return;
    }

    toast.success("Codul OTP a fost trimis!", {
      description: `Verifică SMS-ul primit la ${phone}.`, // Show original number
    });
    setOtpSent(true);
    // Timer will start via useEffect
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Te rugăm să introduci codul OTP valid (6 cifre).");
      return;
    }
    setLoading(true);

    // Normalize phone number to E.164 format for Supabase
    const normalizedPhone = phonePrefix + phone;

    const {
      data: { session },
      error,
    } = await supabaseBrowserClient.auth.verifyOtp({
      phone: normalizedPhone,
      token: otp,
      type: "sms",
    });

    if (error) {
      setLoading(false);
      console.error("OTP Verify Error:", error);
      if (
        error.message.includes("expired") ||
        error.message.includes("invalid")
      ) {
        toast.error("Codul OTP este invalid sau a expirat. Încearcă din nou.");
      } else {
        toast.error("A apărut o eroare la verificarea codului.", {
          description: error.message,
        });
      }
      return;
    }

    if (session && session.user) {
      console.log("Login successful with OTP");

      try {
        // Check if user has registration for current edition
        const edition = await getActiveEdition();
        const hasRegistration = await checkUserRegistrationExists(
          session.user.id,
          edition.id
        );

        console.log("Login - hasRegistration:", hasRegistration);

        if (hasRegistration) {
          // Has registration → go to /cont
          toast.success("Autentificare reușită!");
          setTimeout(() => {
            router.replace("/cont");
          }, 500);
        } else {
          // No registration → go to /inscrie-te (will skip Step 0)
          toast.success("Autentificare reușită!", {
            description: "Te rugăm să completezi înregistrarea pentru această ediție."
          });
          setTimeout(() => {
            router.replace("/inscrie-te");
          }, 500);
        }
      } catch (err) {
        console.error("Error checking registration:", err);
        // Fallback to /cont if check fails
        toast.success("Autentificare reușită!");
        setTimeout(() => {
          router.replace("/cont");
        }, 500);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      toast.error("Autentificarea a eșuat. Te rugăm să încerci din nou.");
    }
  };

  const handleResendOtp = () => {
    if (!resendDisabled) {
      setOtp(""); // Clear previous OTP input
      setOtpSent(false); // Reset state to allow handleSendOtp logic to run fully
      setResendDisabled(true); // Disable button immediately
      setResendTimer(RESEND_TIMEOUT_SECONDS); // Reset timer display
      handleSendOtp(); // Trigger sending OTP again
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
        Conectare cont
      </h2>
      <div className="space-y-4">
        {!otpSent ? (
          // Phone Input Stage
          <>
            <PhoneInput
              label="Număr de telefon"
              value={phone}
              prefix={phonePrefix}
              onChange={(value) => {
                setPhone(value);
                setPhoneError(""); // Clear error on input change
              }}
              onPrefixChange={(value) => {
                setPhonePrefix(value);
                setPhoneError(""); // Clear error on prefix change
              }}
              placeholder="0770123456"
              disabled={loading}
              helpText="Introdu numărul de telefon cu care te-ai înregistrat."
              error={phoneError}
            />
            <Button
              onClick={handleSendOtp}
              className="w-full rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Se trimite codul..." : "Trimite cod OTP"}
            </Button>
          </>
        ) : (
          // OTP Verification Stage
          <>
            <div className="space-y-2 flex flex-col items-center">
              <label htmlFor="otp-input" className="text-base font-semibold">
                Introdu codul OTP
              </label>
              <Input
                id="otp-input"
                type="text"
                inputMode="numeric" // Hint for numeric keyboard on mobile
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)} // Update OTP state
                className={`w-32 text-center text-lg tracking-[0.3em]`} // Removed validation class for now, can be added if needed
                placeholder="------"
                disabled={loading}
                autoComplete="one-time-code"
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <Button
                onClick={handleVerifyOtp}
                className="flex-grow rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Se verifică..." : "Verifică codul"}
              </Button>
              <Button
                variant="outline"
                onClick={handleResendOtp}
                disabled={resendDisabled || loading}
                className="flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Retrimite{" "}
                {resendDisabled && resendTimer > 0 ? `(${resendTimer}s)` : ""}
              </Button>
            </div>
            <Button
              variant="link"
              size="sm"
              className="text-hope-darkcyan hover:underline p-0 h-auto"
              onClick={() => {
                setOtpSent(false);
                setOtp("");
                // Keep phone number
                setResendDisabled(true); // Reset resend state
                setResendTimer(RESEND_TIMEOUT_SECONDS);
              }}
              disabled={loading}
            >
              Schimbă numărul de telefon
            </Button>
          </>
        )}
      </div>
      <p className="mt-6 text-center text-sm text-gray-500">
        Nu te-ai înscris încă în tabără?{" "}
        <Link
          href="/inscrie-te"
          className="text-primary hover:underline font-medium"
        >
          Înscrie-te aici
        </Link>
      </p>
      <div className="mt-4 flex justify-center">
        <Link
          href="/"
          className="inline-block bg-primary px-4 py-2 bg-hope-darkcyan text-white font-medium text-sm rounded-md shadow-md hover:bg-hope-darkcyan-dark transition-colors duration-200"
        >
          Pagina principală
        </Link>
      </div>

      {/* Optional: Add a link back to phone/password login if needed */}
      {/* <p className="mt-4 text-center text-sm text-gray-500">
        <Link href="/login-phone" className="text-hope-darkcyan hover:underline">
          Conectare cu phone și parolă
        </Link>
      </p> */}
    </div>
  );
}
