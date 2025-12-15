"use client";

import { Card, CardContent } from "../ui/card";
import Step0 from "./Step0";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import EditionBanner from "./EditionBanner";
import { useRegistrationForm } from "@/hooks/useRegistrationForm";
import { ErrorBoundary } from "../ErrorBoundary";
import { AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import LoadingSpinner from "../ui/LoadingSpinner";

export default function RegisterForm() {
  const {
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
    handleChange,
    handleDateChange,
    handlePhoneChange,
    handlePhonePrefixChange,
    handleOtpChange,
    handlePhoneSubmit,
    handleOtpVerify,
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

  // Show loading during initialization
  if (isInitializing) {
    return (
      <Card className="bg-background shadow-lg">
        <CardContent className="p-6 flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  // Show block message if any
  if (blockReason) {
    return (
      <ErrorBoundary>
        <Card className="bg-background shadow-lg">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Atenție</h2>
            <p className="mb-4">{blockReason}</p>
            <Link href="/cont">
              <Button>Mergi la contul tău →</Button>
            </Link>
          </CardContent>
        </Card>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <Card className="shadow-lg">
        <CardContent className="p-0">
           {/* Edition Banner - show on all steps */}
            {currentEdition && (
              <EditionBanner
                edition={currentEdition}
                isReturningUser={isReturningUser}
                phoneNumber={phoneData.phone || formData.authData.phone}
              />
            )}
            <div className="p-6">
          {step === 0 && (
            <Step0
              phoneData={phoneData}
              otpData={otpData}
              handlePhoneChange={handlePhoneChange}
              handlePhonePrefixChange={handlePhonePrefixChange}
              handleOtpChange={handleOtpChange}
              handlePhoneSubmit={handlePhoneSubmit}
              handleOtpVerify={handleOtpVerify}
              validationErrors={validationErrors}
              isLoading={isLoading}
            />
          )}

          {step === 1 && (
            <Step1
              formData={formData}
              handleChange={handleChange}
              handleNext={handleNext}
              validationErrors={validationErrors}
              isLoading={isLoading}
              handleImageChange={handleImageChange}
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
              handlePrev={handlePrev}
              handleSubmit={handleSubmit}
              agreementChecked={agreementChecked}
              setAgreementChecked={setAgreementChecked}
              downloadCampRules={downloadCampRules}
              isLoading={isLoading}
              validationErrors={validationErrors}
            />
          )}
          </div>
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
}
