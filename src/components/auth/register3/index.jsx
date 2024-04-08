import React, { useState } from "react";
import InputField from "../InputField";
import CheckboxField from "../CheckboxField";

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    phoneNumber: "",
  });
  const [agreementChecked, setAgreementChecked] = useState(false); // Define the agreementChecked state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handlePrev = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleAgreementChange = (e) => {
    const { checked } = e.target;
    setAgreementChecked(checked);
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
  };

  return (
    <main className="w-full h-screen flex self-center place-content-center place-items-center">
      <div className="w-96 text-gray-600 space-y-5 p-4 shadow-xl border rounded-xl">
        <div className="max-w-lg mx-auto p-4">
          {step === 1 && (
            <Step1
              formData={formData}
              handleChange={handleChange}
              handleNext={handleNext}
            />
          )}
          {step === 2 && (
            <Step2
              formData={formData}
              handleChange={handleChange}
              handleNext={handleNext}
              handlePrev={handlePrev}
            />
          )}
          {step === 3 && (
            <Step3
              formData={formData}
              handlePrev={handlePrev}
              handleSubmit={handleSubmit}
              agreementChecked={agreementChecked} // Pass agreementChecked state to Step3
              handleAgreementChange={handleAgreementChange} // Pass handleAgreementChange to Step3
            />
          )}
        </div>
      </div>
    </main>
  );
};

const Step1 = ({ formData, handleChange, handleNext }) => {
  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Step 1: Authentication</h2>
      <InputField
        label="Email"
        type="email"
        name="email"
        autoComplete="email"
        value={formData.email}
        onChange={handleChange}
      />
      <InputField
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
      />
      <InputField
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
      />
      {/* TODO: Add password validation here.
      Confirm password value and password value should be equal
      This validation should be done on the "Next" Button. */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleNext}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const Step2 = ({ formData, handleChange, handleNext, handlePrev }) => {
  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Step 2: Contact Details</h2>
      <InputField
        label="Phone Number"
        type="tel"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
      />
      <div className="mt-4 flex justify-between">
        <button
          onClick={handlePrev}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const Step3 = ({
  formData,
  handlePrev,
  handleSubmit,
  agreementChecked,
  handleAgreementChange,
}) => {
  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Step 3: Confirmation</h2>
      <p>Email: {formData.email}</p>
      <p>Phone Number: {formData.phoneNumber}</p>

      <CheckboxField
        label="I agree to the terms and conditions"
        checked={agreementChecked}
        onChange={handleAgreementChange}
      />

      <div className="mt-4 flex justify-between">
        <button
          onClick={handlePrev}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
        >
          Previous
        </button>
        <button
          onClick={handleSubmit}
          disabled={!agreementChecked} // Disable the button if agreementChecked is false
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default MultiStepForm;
