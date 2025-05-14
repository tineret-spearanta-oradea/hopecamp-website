"use client";

import { Card, CardContent } from "../ui/card";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4"; // Added Step 4 import
import { useRegistrationForm } from "@/hooks/useRegistrationForm";
import { ErrorBoundary } from "../ErrorBoundary";

export default function RegisterForm() {
  const {
    step,
    formData,
    otp, // Added otp state from hook
    validationErrors,
    agreementChecked,
    isLoading,
    handleChange,
    handleDateChange,
    handleNext,
    handlePrev,
    handleSubmit, // This is now the verifyOtp handler
    setAgreementChecked,
    handleImageChange,
    handleOtpChange,
    resendOtp, // Added resendOtp handler from hook
  } = useRegistrationForm();

  const downloadCampRules = () => {
    const link = document.createElement("a");
    link.href = "/assets/documents/Regulament_HopeCamp.pdf";
    link.download = "Regulament_HopeCamp.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <ErrorBoundary>
      <Card className="bg-white shadow-lg">
        <CardContent className="p-6">
          {step === 1 && (
            <Step1
              formData={formData}
              handleChange={handleChange}
              handleNext={handleNext}
              validationErrors={validationErrors}
              isLoading={isLoading}
              handleImageChange={handleImageChange} // Pass image handler
            />
          )}

          {step === 2 && (
            <Step2
              formData={formData}
              handleChange={handleChange}
              handleNext={handleNext}
              handlePrev={handlePrev}
              handleDateChange={handleDateChange}
              validationErrors={validationErrors}
              isLoading={isLoading}
            />
          )}

          {step === 3 && (
            <Step3
              formData={formData}
              handleChange={handleChange}
              handleNext={handleNext} // Pass handleNext here
              handlePrev={handlePrev}
              handleSubmit={handleSubmit}
              agreementChecked={agreementChecked}
              setAgreementChecked={setAgreementChecked}
              downloadCampRules={downloadCampRules}
              isLoading={isLoading}
              validationErrors={validationErrors}
            />
          )}

          {step === 4 && (
            <Step4
              formData={formData}
              handleChange={handleChange} // Pass handleChange as required by StepProps
              handlePrev={handlePrev}
              handleSubmit={handleSubmit} // Pass the verifyOtp handler
              isLoading={isLoading}
              validationErrors={validationErrors}
              otp={otp}
              handleOtpChange={handleOtpChange}
              resendOtp={resendOtp} // Pass the resendOtp handler
              agreementChecked={agreementChecked} // Keep required props
              setAgreementChecked={setAgreementChecked} // Keep required props
              downloadCampRules={downloadCampRules} // Keep required props
            />
          )}
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
}
