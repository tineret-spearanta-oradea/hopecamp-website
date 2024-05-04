import React, { useEffect } from "react";
import TextInputField from "../TextInputField";
import CheckboxInputField from "../CheckboxInputField";
import ImageInputField from "../ImageInputField";
import RadioInputField from "../RadioInputField";
import DateInputField from "../DateInputField";
import ErrorAlert from "../../ErrorAlert";
import { Link } from "react-router-dom";
import FormButton from "../FormButton";
import {
  churchOptions,
  payTaxToOptions,
  transportOptions,
  pages,
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
      <h2 className="text-xl font-black text-center mb-4">
        Pasul {stepNumber}/3:{" "}
        {stepNumber === 1
          ? "Autentificare"
          : stepNumber === 2
          ? "Detalii personale"
          : "Confirmare"}
      </h2>
      <h3 className="mb-4 text-center text-sm">
        {stepNumber === 1
          ? `Hope Camp #5 este o tabară creștină de tineret, organizată de Tineret Speranța Oradea.
          Mai multe detalii despre noi și tabără găsiți in pagina principalǎ.` //TODO: add link to the index page
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
            label="Încarcǎ pozǎ cu tine" // TODO: maybe make this optional (?) to be discussed
            handleImageChange={handleImageChange}
          />
          <TextInputField
            label="Preferințe colegi de camerǎ:"
            type="text"
            name="preferences"
            value={formData.userData.preferences}
            onChange={(e) => handleChange("userData", e.target)}
            isOptional={true}
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
      {stepNumber === 3 && !agreementChecked && (
        <p className="mt-4 text-red-500 text-xs text-center italic">
          Trebuie sa fii de-acord cu regulamentul taberei
        </p>
      )}
      <div className="mt-4 flex justify-between">
        {stepNumber !== 1 ? (
          <FormButton onClick={handlePrev} disabled={false} action="back">
            ← Înapoi
          </FormButton>
        ) : (
          <div></div>
        )}
        {stepNumber !== 3 && (
          <FormButton onClick={handleNext} disabled={false} action="next">
            Continuǎ →
          </FormButton>
        )}
        {stepNumber === 3 && (
          <FormButton
            onClick={handleSubmit}
            disabled={!agreementChecked}
            action="submit"
          >
            Înscrie-te ↗
          </FormButton>
        )}
      </div>
      {stepNumber === 1 && (
        <div>
          <p className=" my-6 text-center text-sm ">
            Te-ai înscris deja?{" "}
            <Link
              to={pages.account}
              className="hover:underline font-bold text-hope-lightcyan"
            >
              Du-te la contul tǎu.
            </Link>
          </p>
          <h5 className="text-sm text-hope-lightcyan">
            * Emailul si parola vor fi folosite pentru a te conecta la platforma
            noastrǎ. Acestea sunt necesare pentru înscriere.
          </h5>
        </div>
      )}
    </div>
  );
};

export default Step;
