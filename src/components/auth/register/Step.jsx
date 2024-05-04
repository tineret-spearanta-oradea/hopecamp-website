import React, { useEffect } from "react";
import TextInputField from "../TextInputField";
import CheckboxInputField from "../CheckboxInputField";
import ImageInputField from "../ImageInputField";
import RadioInputField from "../RadioInputField";
import DateInputField from "../DateInputField";
import ErrorAlert from "../../ErrorAlert";
import {
  churchOptions,
  payTaxToOptions,
  transportOptions,
} from "../../../constants";

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
  validationErrors,
  errorMessages,
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
      <h3 className="mb-4 text-center">
        {stepNumber === 1
          ? `Hope Camp #5 este o tabară creștină de tineret, organizată de Tineret Speranța Oradea.
          Mai multe detalii despre noi și tabără găsiți in pagina principala.` //TODO: add link to the index page
          : ""}
      </h3>
      <h5 className="text-sm my-4 text-center">
        {stepNumber === 2 ? "Ajuta-ne să te (re)cunoaștem!" : ""}
      </h5>
      {errorMessages && errorMessages.length > 0 && (
        <ErrorAlert messages={errorMessages} />
      )}
      {stepNumber === 1 && (
        <>
          <TextInputField
            label="Email *"
            type="email"
            name="email"
            autoComplete="email"
            value={formData.authData.email}
            onChange={(e) => handleChange("authData", e.target)}
            validationErrorMessage={validationErrors.email}
          />
          <TextInputField
            label="Parola *"
            type="password"
            name="password"
            value={formData.authData.password}
            onChange={(e) => handleChange("authData", e.target)}
            validationErrorMessage={validationErrors.password}
          />
          <TextInputField
            label="Confirma parola *"
            type="password"
            name="confirmPassword"
            value={formData.authData.confirmPassword}
            onChange={(e) => handleChange("authData", e.target)}
            validationErrorMessage={validationErrors.confirmPassword}
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
            validationErrorMessage={validationErrors.name}
          />
          <TextInputField
            label="Varsta:"
            type="number"
            name="age"
            value={formData.userData.age}
            onChange={(e) => handleChange("userData", e.target)}
            validationErrorMessage={validationErrors.age}
          />
          <TextInputField
            label="Numar de telefon:"
            type="tel"
            name="phone"
            value={formData.userData.phone}
            onChange={(e) => handleChange("userData", e.target)}
            validationErrorMessage={validationErrors.phone}
          />
          <RadioInputField
            label="Biserica din care provii:"
            name="church"
            options={churchOptions}
            value={formData.userData.church}
            onChange={(e) => handleChange("userData", e.target)}
            validationErrorMessage={validationErrors.church}
          />
          <RadioInputField
            label="Cui platesti taxa de inscriere:"
            name="payTaxTo"
            options={payTaxToOptions}
            value={formData.userData.payTaxTo}
            onChange={(e) => handleChange("userData", e.target)}
            validationErrorMessage={validationErrors.payTaxTo}
          />
          <RadioInputField
            label="Mijloc de transport:"
            name="transport"
            options={transportOptions}
            value={formData.userData.transport}
            onChange={(e) => handleChange("userData", e.target)}
            validationErrorMessage={validationErrors.transport}
          />
          <DateInputField
            label="Perioada care stai în tabără:"
            name="dateRange"
            startDateValue={formData.userData.startDate}
            endDateValue={formData.userData.endDate}
            onChange={(e) => handleChange("userData", e)}
            validationErrorMessage={validationErrors.dateRange}
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
      <h5 className="text-sm mt-4 text-yellow-600">
        {stepNumber === 1
          ? "* Emailul si parola vor fi folosite pentru a te conecta la platforma noastrǎ. Acestea sunt necesare pentru înscriere."
          : ""}
      </h5>
    </div>
  );
};

export default Step;
