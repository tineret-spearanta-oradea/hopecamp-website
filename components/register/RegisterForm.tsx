"use client";

import { Card, CardContent } from "../ui/card";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { useRegistrationForm } from "@/hooks/useRegistrationForm";
import { ErrorBoundary } from "../ErrorBoundary";

export default function RegisterForm() {
  const {
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
            />
          )}

          {step === 2 && (
            <Step2
              formData={formData}
              handleChange={handleChange}
              handleNext={handleNext}
              handlePrev={handlePrev}
              handleDateChange={handleDateChange}
              handleImageChange={handleImageChange}
              validationErrors={validationErrors}
              isLoading={isLoading}
            />
          )}

          {step === 3 && (
            <Step3
              formData={formData}
              handlePrev={handlePrev}
              handleSubmit={handleSubmit}
              agreementChecked={agreementChecked}
              setAgreementChecked={setAgreementChecked}
              downloadCampRules={downloadCampRules}
              isLoading={isLoading}
            />
          )}
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
}
