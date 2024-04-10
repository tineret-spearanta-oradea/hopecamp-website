import React from "react";
import InputField from "../TextInputField";
import CheckboxField from "../CheckboxInputField";
import ImageField from "../ImageInputField";

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
  handleImageChange,
  errors,
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
            onChange={(e) => handleChange("authData", e)}
            errorMessage={errors.email}
          />
          <InputField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={(e) => handleChange("authData", e)}
            errorMessage={errors.password}
          />
          <InputField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={(e) => handleChange("authData", e)}
            errorMessage={errors.confirmPassword}
          />
        </>
      )}
      {stepNumber === 2 && (
        <>
          <InputField
            label="Full Name"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />
          <InputField
            label="Age"
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
          />
          <InputField
            label="Phone Number"
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => handleChange("userData", e)}
          />
          <InputField
            label="Church"
            type="text"
            name="church"
            value={formData.church}
            onChange={handleChange}
          />
          <InputField
            label="Pay Tax To"
            type="text"
            name="payTaxTo"
            value={formData.payTaxTo}
            onChange={handleChange}
          />
          <InputField
            label="Amount Paid"
            type="number"
            name="amountPaid"
            value={formData.amountPaid}
            onChange={handleChange}
          />
          <InputField
            label="Transport"
            type="text"
            name="transport"
            value={formData.transport}
            onChange={handleChange}
          />
          <InputField
            label="Start Date"
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
          />
          <InputField
            label="End Date"
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
          />
          <ImageField
            label="Profile Picture"
            type="file"
            name="imageUrl"
            onChange={handleImageChange}
          />
          <CheckboxField
            label="Is Admin"
            checked={formData.isAdmin}
            onChange={handleChange}
          />
          <CheckboxField
            label="Is Confirmed"
            checked={formData.isConfirmed}
            onChange={handleChange}
          />
          <InputField
            label="Preferences"
            type="text"
            name="preferences"
            value={formData.preferences}
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
