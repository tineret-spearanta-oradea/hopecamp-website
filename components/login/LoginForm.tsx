"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Input } from "../ui/input"; // Assuming you have an Input component
import { toast } from "sonner";
import { supabaseBrowserClient } from "@/lib/supabase/client";

const RESEND_TIMEOUT_SECONDS = 60;

export default function LoginForm() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [resendTimer, setResendTimer] = useState(RESEND_TIMEOUT_SECONDS);

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
    // Validate Romanian phone number format (07XXXXXXXX)
    if (!phone || !/^07\d{8}$/.test(phone)) {
      toast.error("Te rugăm să introduci un număr de telefon valid (ex: 0770123456).");
      return;
    }
    setLoading(true);
    setResendDisabled(true); // Disable resend immediately

    // Normalize phone number to E.164 format for Supabase
    const normalizedPhone = '+4' + phone;

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
      if (error.code === "otp_disabled") { // Adjust based on actual error message
          toast.error("Numărul de telefon nu este înregistrat. Te rugăm să te înscrii mai întâi.");
      } else if (error.code === "over_sms_send_rate_limit") {
          toast.error("Prea multe încercări. Te rugăm să încerci mai târziu.");
      }
       else {
        toast.error("A apărut o eroare la trimiterea codului.", {
          description: error.message,
        });
      }
      setResendDisabled(false); // Re-enable resend on error
      return;
    }

    toast.success("Codul OTP a fost trimis!", {
        description: `Verifică SMS-ul primit la ${phone}.` // Show original number
    });
    setOtpSent(true);
    // Timer will start via useEffect
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) { // Assuming OTP is 6 digits
      toast.error("Te rugăm să introduci codul OTP valid (6 cifre).");
      return;
    }
    setLoading(true);

    // Normalize phone number to E.164 format for Supabase
    const normalizedPhone = '+4' + phone;

    const {
      data: { session },
      error,
    } = await supabaseBrowserClient.auth.verifyOtp({
      phone: normalizedPhone, // Use normalized phone
      token: otp,
      type: "sms", // or 'phone_change' if that's what you used, but 'sms' is typical for login
    });

    setLoading(false);
    if (error) {
      console.error("OTP Verify Error:", error);
       if (error.message.includes("expired") || error.message.includes("invalid")) {
           toast.error("Codul OTP este invalid sau a expirat. Încearcă din nou.");
       } else {
           toast.error("A apărut o eroare la verificarea codului.", {
               description: error.message,
           });
       }
      return;
    }

    if (session) {
        console.log("Login successful with OTP");
        toast.success("Autentificare reușită!");
        // No need to redirect here, AuthToAccountRedirect should handle it based on session change
    } else {
        // Should not happen if error is null, but good to handle
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
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Număr de telefon (ex: 0770123456)
              </label>
              <Input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0770123456"
                className="mt-1 block w-full"
                disabled={loading}
                autoComplete="tel"
              />
            </div>
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
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Cod OTP primit prin SMS
              </label>
              <Input
                type="text" // Use text to allow leading zeros if any, handle validation
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6} // Standard OTP length
                placeholder="123456"
                className="mt-1 block w-full"
                disabled={loading}
                inputMode="numeric"
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
                    Retrimite {resendDisabled && resendTimer > 0 ? `(${resendTimer}s)` : ''}
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
          className="text-hope-darkcyan hover:underline font-medium"
        >
          Înscrie-te aici
        </Link>
      </p>
      {/* Optional: Add a link back to phone/password login if needed */}
      {/* <p className="mt-4 text-center text-sm text-gray-500">
        <Link href="/login-phone" className="text-hope-darkcyan hover:underline">
          Conectare cu phone și parolă
        </Link>
      </p> */}
    </div>
  );
}
