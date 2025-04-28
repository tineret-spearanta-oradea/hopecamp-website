import { StepProps, FormData } from "@/types/form";
import { useState, useEffect, useCallback } from "react"; // Added hooks
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { StepWrapper } from "./StepWrapper";
import Link from "next/link"; // Added

const RESEND_TIMEOUT_SECONDS = 60;

// Extend StepProps to include resendOtp function
interface Step4Props extends StepProps {
  otp: string;
  handleOtpChange: (value: string) => void;
  resendOtp: () => Promise<void>; // Add function to resend OTP
}

export default function Step4({
  formData,
  handlePrev,
  handleSubmit,
  isLoading,
  validationErrors,
  otp,
  handleOtpChange,
  resendOtp, // Destructure resendOtp
}: Step4Props) {
  const [resendDisabled, setResendDisabled] = useState(true);
  const [resendTimer, setResendTimer] = useState(RESEND_TIMEOUT_SECONDS);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (resendDisabled && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((timer) => timer - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setResendDisabled(false);
    }
    // Cleanup interval on component unmount or when timer finishes/resets
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendDisabled, resendTimer]);

  const handleResendClick = useCallback(async () => {
    if (!resendDisabled) {
      try {
        await resendOtp(); // Call the resend function from props
        setResendDisabled(true);
        setResendTimer(RESEND_TIMEOUT_SECONDS);
        // Optionally add a success toast here
      } catch (error) {
        // Error handling (e.g., toast notification) is likely done within resendOtp or the hook
        console.error("Failed to resend OTP:", error);
      }
    }
  }, [resendDisabled, resendOtp]);
  return (
    <StepWrapper title="Pasul 4/4: Verificare Cod SMS" isLoading={isLoading}>
      <div className="space-y-8">
        <p className="text-center text-muted-foreground">
          Am trimis un cod de verificare format din 6 cifre la numărul de
          telefon: <strong>{formData.authData.phone}</strong>.
        </p>
        {/* Replace InputOTP with standard Input */}
        <div className="space-y-2 flex flex-col items-center">
          <Label htmlFor="otp-input" className="text-base font-semibold">Introdu codul OTP</Label>
          <Input
            id="otp-input"
            type="text"
            inputMode="numeric" // Hint for numeric keyboard on mobile
            maxLength={6}
            value={otp}
            onChange={(e) => handleOtpChange(e.target.value)} // Use handleOtpChange directly
            className={`w-32 text-center text-lg tracking-[0.3em] ${validationErrors.otp ? "border-destructive" : ""}`}
            placeholder="------"
          />
          {validationErrors.otp && (
            <p className="text-destructive text-xs mt-1">{validationErrors.otp}</p>
          )}
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handlePrev} disabled={isLoading}>
            ← Înapoi
          </Button>
          <Button
            onClick={handleSubmit} // Final submit action
            disabled={isLoading || otp.length !== 6}
            className="bg-secondary text-white hover:bg-secondary/90"
          >
            {isLoading ? "Se procesează..." : "Verifică și Înscrie-te ↗"}
          </Button>
        </div>
         <p className="text-center text-sm text-muted-foreground mt-4">
            Nu ai primit codul?{" "}
            <button
              type="button"
              className="text-hope-lightcyan hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleResendClick}
              disabled={resendDisabled || isLoading}
            >
              Retrimite codul {resendDisabled && resendTimer > 0 ? `(${resendTimer}s)` : ""}
            </button>
            . Sau <button type="button" className="text-hope-lightcyan hover:underline disabled:opacity-50 disabled:cursor-not-allowed" onClick={handlePrev} disabled={isLoading}>verifică numărul</button>.
        </p>
         <p className="text-center text-sm text-muted-foreground mt-2">
          Ai deja cont?{" "}
          <Link href="/login" className="text-hope-lightcyan hover:underline">
            Autentifică-te aici
          </Link>
          .
        </p>
      </div>
    </StepWrapper>
  );
}
