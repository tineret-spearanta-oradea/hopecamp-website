import React, { useEffect } from "react";
import TextInputField from "../TextInputField";
import CheckboxInputField from "../CheckboxInputField";
import ImageInputField from "../ImageInputField";
import RadioInputField from "../RadioInputField";
import DateInputField from "../DateInputField";
import { churchOptions } from "../../../models/Options";
import { payTaxToOptions } from "../../../models/Options";
import { transportOptions } from "../../../models/Options";

// TODO: Add diacritics to the text
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
        Pasul {stepNumber}:{" "}
        {stepNumber === 1
          ? "Autentificare"
          : stepNumber === 2
          ? "Detalii personale"
          : "Confirmare"}
      </h2>
      <h3 className="mb-4">
        {stepNumber === 1
          ? `Hope Camp #6 este o tabară creștină de tineret, organizată de TineretSperanța Oradea.
          Mai multe detalii despre noi și tabără găsiți in pagina principala.`
          : ""}
      </h3>
      <h5 className="text-sm mb-4">
        {stepNumber === 1
          ? "Emailul si parola vor fi folosite pentru a te conecta la platforma noastrǎ"
          : stepNumber === 2
          ? "Ajuta-ne să te (re)cunoaștem!"
          : ""}
      </h5>
      {stepNumber === 1 && (
        <>
          <TextInputField
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            value={formData.authData.email}
            onChange={(e) => handleChange("authData", e.target)}
            errorMessage={errors.email}
          />
          <TextInputField
            label="Parola"
            type="password"
            name="password"
            value={formData.authData.password}
            onChange={(e) => handleChange("authData", e.target)}
            errorMessage={errors.password}
          />
          <TextInputField
            label="Confirma parola"
            type="password"
            name="confirmPassword"
            value={formData.authData.confirmPassword}
            onChange={(e) => handleChange("authData", e.target)}
            errorMessage={errors.confirmPassword}
          />
        </>
      )}
      {stepNumber === 2 && (
        <>
          <TextInputField
            label="Numele intreg:"
            type="text"
            name="name"
            value={formData.userData.name}
            onChange={(e) => handleChange("userData", e.target)}
            errorMessage={errors.name}
          />
          <TextInputField
            label="Varsta:"
            type="number"
            name="age"
            value={formData.userData.age}
            onChange={(e) => handleChange("userData", e.target)}
            errorMessage={errors.age}
          />
          <TextInputField
            label="Numar de telefon:"
            type="tel"
            name="phone"
            value={formData.userData.phone}
            onChange={(e) => handleChange("userData", e.target)}
            errorMessage={errors.phone}
          />
          <RadioInputField
            label="Biserica din care provii:"
            name="church"
            options={churchOptions}
            value={formData.userData.church}
            onChange={(e) => handleChange("userData", e.target)}
            errorMessage={errors.church}
          />
          <RadioInputField
            label="Cui platesti taxa de inscriere:"
            name="payTaxTo"
            options={payTaxToOptions}
            value={formData.userData.payTaxTo}
            onChange={(e) => handleChange("userData", e.target)}
            errorMessage={errors.payTaxTo}
          />
          <RadioInputField
            label="Mijloc de transport:"
            name="transport"
            options={transportOptions}
            value={formData.userData.transport}
            onChange={(e) => handleChange("userData", e.target)}
            errorMessage={errors.transport}
          />
          <DateInputField
            label="Perioada care stai în tabără:"
            name="dateRange"
            startDateValue={formData.userData.startDate}
            endDateValue={formData.userData.endDate}
            onChange={(e) => handleChange("userData", e)}
            errorMessage={errors.dateRange}
          />
          <ImageInputField
            label="Poza cu tine" // TODO: maybe make this optional (?) to be discussed
            handleImageChange={handleImageChange}
          />
          <TextInputField
            label="Preferinte cazare:"
            type="text"
            name="preferences"
            value={formData.userData.preferences}
            onChange={(e) => handleChange("userData", e.target)}
          />
        </>
      )}
      {stepNumber === 3 && (
        <>
          <CheckboxInputField
            label="Agreez cu regulile taberei, si cu prelucrarea datelor personale."
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
            // TODO: Fix bug when agreement is not checked, the button should still be visible
            // with different color, but it's not visible at all at this moment
            onClick={handleSubmit}
            disabled={!agreementChecked}
            className={`bg-${
              agreementChecked === true ? "green-500" : "neutral-500"
            } text-white px-4 py-2 rounded`}
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default Step;
