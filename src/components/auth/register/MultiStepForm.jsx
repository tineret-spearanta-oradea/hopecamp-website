//TODO: rename this file to MultiFormStep.jsx
import React, { useState } from "react";
import Step from "./Step";
import { constraints, MAX_LENGTHS } from "../../../models/Options";

const MultiStepForm = ({
  handleSubmit,
  handleImageChange,
  agreementChecked,
  setAgreementChecked,
  formData,
  setFormData,
  handleTryAutofillUserData,
}) => {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});

  const handleAgreementChange = (e) => {
    const { checked } = e.target;
    setAgreementChecked(checked);
  };

  const handleChange = (objectName, e) => {
    const { name, value } = e;
    if (name === "age" && !/^\d*$/.test(value)) return;
    let trimmedValue = value;
    if (value.length > (MAX_LENGTHS[name] || 999)) {
      trimmedValue = value.substr(0, MAX_LENGTHS[name]);
    }
    setFormData(prevData => ({
      ...prevData,
      [objectName]: {
        ...prevData[objectName],
        [name]: trimmedValue,
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
    setStep((prevStep) => prevStep - 1);
  };

  const areFieldsValid = (step) => {
    let newErrors = {};

    if (step === 1) {
      const { email, password, confirmPassword } = formData.authData;

      if (!email) newErrors.email = "Adresa de email este necesară.";
      else if (!constraints.email(email)) newErrors.email = "Adresa de email este invalidă.";
      else if (email.length > MAX_LENGTHS.email) newErrors.email = `Adresa de email nu poate depăși ${MAX_LENGTHS.email} de caractere.`;

      if (!password) newErrors.password = "Parola este necesară.";
      else if (!constraints.password(password)) newErrors.password = "Parola trebuie să aibă cel puțin 6 caractere.";
      else if (password.length > MAX_LENGTHS.password) newErrors.password = `Parola nu poate depăși ${MAX_LENGTHS.password} de caractere.`;

      if (password !== confirmPassword) newErrors.confirmPassword = "Parolele nu se potrivesc.";
    }

    if (step === 2) {
      const { name, age, phone, church, payTaxTo, transport, preferences } = formData.userData;

      if (!name) newErrors.name = "Numele este necesar.";
      else if (name.length > MAX_LENGTHS.name) newErrors.name = `Numele nu poate depăși ${MAX_LENGTHS.name} de caractere.`;

      if (!age) newErrors.age = "Vârsta este necesară.";
      else if (!/^\d+$/.test(age)) newErrors.age = "Vârsta trebuie să fie un număr valid.";
      else if (!constraints.age(age)) newErrors.age = "Vârsta trebuie să fie între 13 și 35 ani.";
    
      if (!phone) newErrors.phone = "Numărul de telefon este necesar.";
      else if (!constraints.phone(phone)) newErrors.phone = "Numărul de telefon este invalid.";

      if (!church) newErrors.church = "Biserica este necesară.";
      if (!payTaxTo) newErrors.payTaxTo = "Alege o persoana căruia să plătești.";
      if (!transport) newErrors.transport = "Mijlocul de transport este necesar.";

      if (preferences && preferences.length > MAX_LENGTHS.preferences) newErrors.preferences = `Preferințele nu pot depăși ${MAX_LENGTHS.preferences} de caractere.`;
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
