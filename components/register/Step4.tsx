import { StepProps, FormData } from "@/types/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input"; // Keep standard Input
import { Label } from "../ui/label";
import { StepWrapper } from "./StepWrapper";
// Remove InputOTP imports
// import {
//   InputOTP,
//   InputOTPGroup,
//   InputOTPSlot,
// } from "@/components/ui/input-otp";

// Extend StepProps or create a specific interface if needed
interface Step4Props extends StepProps {
  otp: string; // Add otp state
  handleOtpChange: (value: string) => void; // Add handler for OTP input
}

export default function Step4({
  formData,
  handlePrev,
  handleSubmit,
  isLoading,
  validationErrors,
  otp,
  handleOtpChange,
}: Step4Props) {
  return (
    <StepWrapper title="Pasul 4/4: Verificare Cod SMS" isLoading={isLoading}>
      <div className="space-y-8">
        <p className="text-center text-muted-foreground">
          Am trimis un cod de verificare format din 6 cifre la numărul de
          telefon: <strong>{formData.userData.phone}</strong>.
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
            Nu ai primit codul? Verifică numărul introdus la pasul anterior sau <button type="button" className="text-hope-lightcyan hover:underline disabled:opacity-50 disabled:cursor-not-allowed" onClick={handlePrev} disabled={isLoading}>încearcă din nou</button>.
        </p>
      </div>
    </StepWrapper>
  );
}
