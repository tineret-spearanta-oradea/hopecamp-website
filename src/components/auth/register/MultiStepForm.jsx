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
  handleTryGetUserDataFromArchive,
  autoFillData,
}) => {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [hasAlreadyAutoFilled, setHasAlreadyAutoFilled] = useState(false);

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

    if (
      hasAlreadyAutoFilled !== true &&
      name === "name" &&
      autoFillData !== null
    ) {
      tryFillInUserData(value);
    }
  };

  const tryFillInUserData = (userName) => {
    const autoFillUserName = autoFillData.userData.name;
    const nameField0 = autoFillUserName.split(" ")[0];
    const nameField1 = autoFillUserName.split(" ")[1];
    if (
      userName.includes(nameField0) ||
      (nameField1 !== null && userName.includes(nameField1))
    ) {
      const autoFillUserData = autoFillData.userData;
      setFormData((prevData) => ({
        ...prevData,
        userData: {
          ...prevData.userData,
          phone: autoFillUserData.phone,
          payTaxTo: autoFillUserData.payTaxTo,
          age: autoFillUserData.age,
          church: autoFillUserData.church,
          transport: autoFillUserData.transport,
        },
      }));

      setHasAlreadyAutoFilled(true);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      handleTryGetUserDataFromArchive();
    }
    if (areFieldsValid(step)) {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const handlePrev = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleArrivalDateChange = (event) => {
    // setArrivalDate(event.target.value);
  };

  const handleDepartureDateChange = (event) => {
    // setDepartureDate(event.target.value);
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

      if (!userData.name || userData.name.length === 0) {
        newErrors.name = "Numele este necesar.";
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

  const churchOptions = [
    { label: 'Speranța, Oradea', value: 'Speranta' },
    { label: 'Muntele Sionului, Aleșd', value: 'Muntele Sionului' },
  ];

  const payTaxToOptions = [
    { label: 'Carina Ban', value: 'Carina Ban' },
    { label: 'Rebeca Gros', value: 'Rebeca Gros' },
  ];

  const transportOptions = [
    { label: 'Vin cu mașina personală', value: 'Masina personala' },
    { label: 'Vin cu un prieten cu mașina', value: 'Masina prietenului' },
    { label: 'Autocar de la biserică', value: 'Autocar' },
  ];

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
          handleArrivalDateChange={handleArrivalDateChange}
          handleDepartureDateChange={handleDepartureDateChange}
          handleImageChange={handleImageChange}
          errors={errors}
          churchOptions={churchOptions}
          payTaxToOptions={payTaxToOptions}
          transportOptions={transportOptions}
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
