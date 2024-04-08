import React from "react";
import InputField from "../InputField";
import CheckboxField from "../CheckboxField";

// TODO: Implement error message field

const Step = ({
  stepNumber,
  formData,
  handleChange,
  handleNext,
  handlePrev,
  handleSubmit,
  agreementChecked,
  handleAgreementChange,
}) => {
  return (
    <div>
      <h2 className="text-lg font-bold mb-4">
        Step {stepNumber}:{" "}
        {stepNumber === 1
          ? "Authentication"
          : stepNumber === 2
          ? "Contact Details"
          : "Confirmation"}
      </h2>
      {stepNumber === 1 && (
        <>
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
        </>
      )}
      {stepNumber === 2 && (
        <>
          <InputField
            label="Phone Number"
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </>
      )}
      {stepNumber === 3 && (
        <>
          <p>Email: {formData.email}</p>
          <p>Phone Number: {formData.phoneNumber}</p>

          <CheckboxField
            label="I agree to the terms and conditions"
            checked={agreementChecked}
            onChange={handleAgreementChange}
          />
        </>
      )}
      <div className="mt-4 flex justify-between">
        {stepNumber !== 1 && (
          <button
            onClick={handlePrev}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Previous
          </button>
        )}
        {stepNumber !== 3 && (
          <button
            onClick={handleNext}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Next
          </button>
        )}
        {stepNumber === 3 && (
          <button
            onClick={handleSubmit}
            disabled={!agreementChecked}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default Step;
