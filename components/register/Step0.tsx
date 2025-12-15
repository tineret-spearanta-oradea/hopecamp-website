import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { PhoneInput } from "../ui/phone-input";
import { StepWrapper } from "./StepWrapper";
import { ValidationErrors } from "@/types/form";

interface Step0Props {
  phoneData: { phone: string; phonePrefix: string };
  otpData: { otp: string; isReturningUser: boolean; otpSent: boolean };
  handlePhoneChange: (value: string) => void;
  handlePhonePrefixChange: (prefix: string) => void;
  handleOtpChange: (value: string) => void;
  handlePhoneSubmit: () => Promise<void>;
  handleOtpVerify: () => Promise<void>;
  validationErrors: ValidationErrors;
  isLoading: boolean;
}

export default function Step0({
  phoneData,
  otpData,
  handlePhoneChange,
  handlePhonePrefixChange,
  handleOtpChange,
  handlePhoneSubmit,
  handleOtpVerify,
  validationErrors,
  isLoading,
}: Step0Props) {
  return (
    <StepWrapper
      title="Verificare identitate"
      isLoading={isLoading}
    >
      <div className="space-y-4">
        {!otpData.otpSent ? (
          // Phone Input Stage
          <>
            <PhoneInput
              label="Număr de telefon"
              value={phoneData.phone}
              prefix={phoneData.phonePrefix}
              onChange={handlePhoneChange}
              onPrefixChange={handlePhonePrefixChange}
              placeholder="0770123456"
              disabled={isLoading}
              helpText="Introdu numărul de telefon cu care te-ai înregistrat."
              error={validationErrors.phone}
            />
            <Button
              onClick={handlePhoneSubmit}
              className="w-full rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Se trimite codul..." : "Trimite cod OTP"}
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
                inputMode="numeric"
                maxLength={6}
                value={otpData.otp}
                onChange={(e) => handleOtpChange(e.target.value)}
                className="w-32 text-center text-lg tracking-[0.3em]"
                placeholder="------"
                disabled={isLoading}
                autoComplete="one-time-code"
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <Button
                onClick={handleOtpVerify}
                className="flex-grow rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "Se verifică..." : "Verifică codul"}
              </Button>
              <Button
                variant="outline"
                onClick={handlePhoneSubmit}
                disabled={isLoading}
                className="flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Retrimite
              </Button>
            </div>
            <Button
              variant="link"
              size="sm"
              className="text-hope-darkcyan hover:underline p-0 h-auto"
              onClick={() => window.location.reload()}
              disabled={isLoading}
            >
              Schimbă numărul de telefon
            </Button>
          </>
        )}
      </div>
    </StepWrapper>
  );
}
