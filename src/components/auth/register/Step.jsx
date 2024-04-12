import React from "react";
import TextInputField from "../TextInputField";
import CheckboxInputField from "../CheckboxInputField";
import ImageInputField from "../ImageInputField";

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
            onChange={(e) => handleChange("authData", e)}
            errorMessage={errors.email}
          />
          <TextInputField
            label="Parola"
            type="password"
            name="password"
            value={formData.authData.password}
            onChange={(e) => handleChange("authData", e)}
            errorMessage={errors.password}
          />
          <TextInputField
            label="Confirma parola"
            type="password"
            name="confirmPassword"
            value={formData.authData.confirmPassword}
            onChange={(e) => handleChange("authData", e)}
            errorMessage={errors.confirmPassword}
          />
        </>
      )}
      {stepNumber === 2 && (
        <>
          <TextInputField
            label="Numele intreg:"
            type="text"
            name="fullName"
            value={formData.userData.fullName}
            onChange={(e) => handleChange("userData", e)}
            errorMessage={errors.fullName}
          />
          <TextInputField
            label="Varsta:"
            type="number"
            name="age"
            value={formData.userData.age}
            onChange={(e) => handleChange("userData", e)}
            errorMessage={errors.age}
          />
          <TextInputField
            label="Numar de telefon:"
            type="tel"
            name="phone"
            value={formData.userData.phoneNumber}
            onChange={(e) => handleChange("userData", e)}
            errorMessage={errors.phoneNumber}
          />
          <TextInputField
            label="Biserica din care provii:"
            type="text"
            name="church"
            value={formData.userData.church}
            onChange={(e) => handleChange("userData", e)}
            errorMessage={errors.church}
          />
          {/* TODO: This should be a radio input: */}
          <TextInputField
            label="Cui platesti taxa de inscriere:"
            type="text"
            name="payTaxTo"
            value={formData.userData.payTaxTo}
            onChange={(e) => handleChange("userData", e)}
          />
          {/* TODO: This should be a radio input: */}
          <TextInputField
            label="Mijloc de transport:"
            type="text"
            name="transport"
            value={formData.userData.transport}
            onChange={(e) => handleChange("userData", e)}
          />
          {/* TODO: This should be a limited input, and the user should select start date and end date.
          We could do this with a calendar, or with creating our own 'cards' with the dates. 
          Create a ticket for this for further discussion. */}
          <TextInputField
            label="Data in care vii in tabara:"
            type="date"
            name="startDate"
            value={formData.userData.startDate}
            onChange={(e) => handleChange("userData", e)}
          />
          <TextInputField
            label="Data in care pleci din tabara:"
            type="date"
            name="endDate"
            value={formData.userData.endDate}
            onChange={(e) => handleChange("userData", e)}
          />
          <ImageInputField
            label="Poza cu tine" // TODO: maybe make this optional (?) to be discussed
            type="file"
            name="imageUrl"
            handleImageChange={handleImageChange}
          />
          <TextInputField
            label="Preferinte cazare:"
            type="text"
            name="preferences"
            value={formData.userData.preferences}
            onChange={(e) => handleChange("userData", e)}
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
