import React from "react";
import TextInputField from "../TextInputField";
import CheckboxInputField from "../CheckboxInputField";
import ImageInputField from "../ImageInputField"

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
          <TextInputField
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            errorMessage={errors.email}
          />
          <TextInputField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            errorMessage={errors.password}
          />
          <TextInputField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            errorMessage={errors.confirmPassword}
          />
        </>
      )}
      {stepNumber === 2 && (
        <>
          <TextInputField
            label="Full Name"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />
          <TextInputField
            label="Age"
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
          />
          <TextInputField
            label="Phone Number"
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          <TextInputField
            label="Church"
            type="text"
            name="church"
            value={formData.church}
            onChange={handleChange}
          />
          <TextInputField
            label="Pay Tax To"
            type="text"
            name="payTaxTo"
            value={formData.payTaxTo}
            onChange={handleChange}
          />
          <TextInputField
            label="Amount Paid"
            type="number"
            name="amountPaid"
            value={formData.amountPaid}
            onChange={handleChange}
          />
          <TextInputField
            label="Transport"
            type="text"
            name="transport"
            value={formData.transport}
            onChange={handleChange}
          />
          <TextInputField
            label="Start Date"
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
          />
          <TextInputField
            label="End Date"
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
          />
          <ImageInputField
            label="Profile Picture"
            type="file"
            name="imageUrl"
            onChange={handleImageChange}
          />
          <CheckboxInputField
            label="Is Admin"
            checked={formData.isAdmin}
            onChange={handleChange}
          />
          <CheckboxInputField
            label="Is Confirmed"
            checked={formData.isConfirmed}
            onChange={handleChange}
          />
          <TextInputField
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

          <CheckboxInputField
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
