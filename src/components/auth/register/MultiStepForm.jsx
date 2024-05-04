//TODO: rename this file to MultiFormStep.jsx
import React, { useState } from "react";
import Step from "./Step";

const MultiStepForm = ({
  handleSubmit,
  handleImageChange,
  agreementChecked,
  setAgreementChecked,
  formData,
  setFormData,
  handleTryAutofillUserData,
  downloadCampRules,
  isLoading,
  errorMessages,
  setErrorMessages,
}) => {
  const [step, setStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState({});

  const handleAgreementChange = (e) => {
    const { checked } = e.target;
    setAgreementChecked(checked);
  };

  const handleChange = (objectName, e) => {
    const { name, value } = e;
    setFormData((prevData) => ({
      ...prevData,
      [objectName]: {
        ...prevData[objectName],
        [name]: value,
      },
    }));
  };

  const handleNext = () => {
    if (step === 1) {
      handleTryAutofillUserData();
    }
    if (areFieldsValid(step)) {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const handlePrev = () => {
    setErrorMessages([]);
    setValidationErrors({});
    setStep((prevStep) => prevStep - 1);
  };

  const areFieldsValid = (step) => {
    let newValidationErrors = {};

    if (step === 1) {
      const authData = formData.authData;

      if (!authData.email || authData.email.length === 0) {
        newValidationErrors.email = "Adresa de email este necesară.";
      } else if (!/\S+@\S+\.\S+/.test(authData.email)) {
        newValidationErrors.email = "Adresa de email este invalidă.";
      }

      if (!authData.password || authData.password.length === 0) {
        newValidationErrors.password = "Parola este necesară.";
      } else if (authData.password.length < 6) {
        newValidationErrors.password =
          "Parola trebuie să aibă cel puțin 6 caractere.";
      }

      if (authData.password !== authData.confirmPassword) {
        newValidationErrors.confirmPassword = "Parolele nu se potrivesc.";
      }
    }

    if (step === 2) {
      const userData = formData.userData;

      if (!userData.name || userData.name.length === 0) {
        newValidationErrors.name = "Numele este necesar.";
      }

      if (!userData.age || userData.age.length === 0) {
        newValidationErrors.age = "Vârsta este necesară.";
      } else if (userData.age.length > 2) {
        newValidationErrors.age = "Vârsta este invalidǎ.";
      }

      if (!userData.phone || userData.phone.length === 0) {
        newValidationErrors.phone = "Numărul de telefon este necesar.";
      }

      if (!userData.church || userData.church.length === 0) {
        newValidationErrors.church = "Biserica este necesară.";
      }

      if (!userData.payTaxTo || userData.payTaxTo.length === 0) {
        newValidationErrors.payTaxTo = "Alege o persoana căruia sa plătești.";
      }

      if (!userData.transport || userData.transport.length === 0) {
        newValidationErrors.transport = "Mijlocul de transport este necesar.";
      }

      if (userData.startDate === null || userData.endDate === null) {
        newValidationErrors.dateRange = "Perioada este necesară.";
      }
    }

    setValidationErrors(newValidationErrors);

    return Object.keys(newValidationErrors).length === 0;
  };

  return (
    <div className="max-w-lg mx-auto">
      {step === 1 && (
        <Step
          stepNumber={1}
          formData={formData}
          handleChange={handleChange}
          handleNext={handleNext}
          handlePrev={handlePrev}
          validationErrors={validationErrors}
        />
      )}
      {step === 2 && (
        <Step
          stepNumber={2}
          formData={formData}
          handleChange={handleChange}
          handleNext={handleNext}
          handlePrev={handlePrev}
          handleImageChange={handleImageChange}
          validationErrors={validationErrors}
        />
      )}
      {step === 3 && (
        <Step
          stepNumber={3}
          formData={formData}
          handlePrev={handlePrev}
          handleSubmit={handleSubmit}
          agreementChecked={agreementChecked}
          handleAgreementChange={handleAgreementChange}
          downloadCampRules={downloadCampRules}
          isLoading={isLoading}
          validationErrors={validationErrors}
          errorMessages={errorMessages}
        />
      )}
    </div>
  );
};

export default MultiStepForm;
