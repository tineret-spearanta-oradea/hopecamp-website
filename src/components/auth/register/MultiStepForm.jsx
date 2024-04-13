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
}) => {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});

  const handleAgreementChange = (e) => {
    const { checked } = e.target;
    setAgreementChecked(checked);
  };

  const handleChange = (objectName, e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [objectName]: {
        ...prevData[objectName],
        [name]: value,
      },
    }));
  };

  const handleNext = () => {
    if (areFieldsValid(step)) {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const handlePrev = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const areFieldsValid = (step) => {
    let newErrors = {};

    if (step === 1) {
      const authData = formData.authData;

      if (!authData.email || authData.email.length === 0) {
        newErrors.email = "Adresa de email este necesară.";
      } else if (!/\S+@\S+\.\S+/.test(authData.email)) {
        newErrors.email = "Adresa de email este invalidă.";
      }

      if (!authData.password || authData.password.length === 0) {
        newErrors.password = "Parola este necesară.";
      } else if (authData.password.length < 6) {
        newErrors.password = "Parola trebuie să aibă cel puțin 8 caractere.";
      }

      if (authData.password !== authData.confirmPassword) {
        newErrors.confirmPassword = "Parolele nu se potrivesc.";
      }
    }
    if (step === 2) {
      const userData = formData.userData;

      if (!userData.fullName || userData.fullName.length === 0) {
        newErrors.fullName = "Numele este necesar.";
      }

      if (!userData.age || userData.age.length === 0) {
        newErrors.age = "Vârsta este necesară.";
      }

      if (!userData.phone || userData.phone.length === 0) {
        newErrors.phone = "Numărul de telefon este necesar.";
      }

      if (!userData.church || userData.church.length === 0) {
        newErrors.church = "Biserica este necesară.";
      }

      // TODO: implement errors for all new required fields (including radio buttons and date pickers and file input)
      // this should be done after implemeting the new fields first.
    }
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      {step === 1 && (
        <Step
          stepNumber={1}
          formData={formData}
          handleChange={handleChange}
          handleNext={handleNext}
          handlePrev={handlePrev}
          errors={errors}
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
          errors={errors}
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
        />
      )}
    </div>
  );
};

export default MultiStepForm;
