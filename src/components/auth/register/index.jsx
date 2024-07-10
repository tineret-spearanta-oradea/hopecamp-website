import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import MultiStepForm from "./MultiStepForm";
import { getArchivedUserData } from "../../../firebase/database";
import { registerAndCreateUser } from "../../../firebase";
import UserData from "../../../models/UserData";
import AuthData from "../../../models/AuthData";
import { payTaxToOptions, pages } from "../../../constants";
import { useAuth } from "../../../contexts/authContext";
import LoadingIcon from "../../LoadingIcon";
import FormCard from "../FormCard";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const Register = () => {
  const { authData, userData, userLoggedIn, loading, error } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    authData: new AuthData(),
    userData: new UserData(),
  });
  const [autoFillData, setAutoFillData] = useState({
    userData: new UserData(),
  });
  const [imageFile, setImageFile] = useState(null);
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [hasAlreadyAutoFilled, setHasAlreadyAutoFilled] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  //when disabling the registration, this should be set to true (or get the boolean from the db and set it in useEffect). When enabling do the opposite.
  const [isRegistrationDisabled, setIsRegistrationDisabled] = useState(true);

  //getting the 'mode' url param
  const location = useLocation();
  const mode = new URLSearchParams(location.search).get("mode");

  const handleSubmit = async () => {
    setIsLoading(true);
    if (agreementChecked) {
      const result = await registerAndCreateUser(formData, imageFile);
      if (!result.success) {
        if (!errorMessages.includes(result.message)) {
          setErrorMessages((prevMessages) => [...prevMessages, result.message]);
        }
      } else {
        setErrorMessages([]);
        navigate(pages.account);
      }
    }
    setIsLoading(false);
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleTryAutofillUserData = async () => {
    const archivedUserData = await getArchivedUserData(formData.authData.email);
    if (!hasAlreadyAutoFilled && archivedUserData !== null) {
      setFormData((prevData) => ({
        ...prevData,
        userData: {
          ...prevData.userData,
          name: archivedUserData.name,
          phone: archivedUserData.phone,
          payTaxTo: payTaxToOptions.find(
            (opt) => opt.value === archivedUserData.payTaxTo
          )
            ? archivedUserData.payTaxTo
            : undefined,
          church: archivedUserData.church,
        },
      }));

      setHasAlreadyAutoFilled(true);
    }
  };

  const downloadCampRules = () => {
    const link = document.createElement("a");
    link.href = "/assets/Regulament_HopeCamp.pdf";
    link.download = "Regulament_HopeCamp.pdf";
    link.click();
  };

  return (
    <FormCard>
      {userLoggedIn && <Navigate to={"/cont?alreadyLoggedIn"} replace={true} />}

      {isRegistrationDisabled === false ||
      (mode === "temp" && isRegistrationDisabled === true) ? (
        <MultiStepForm
          handleSubmit={handleSubmit}
          handleImageChange={handleImageChange}
          agreementChecked={agreementChecked}
          setAgreementChecked={setAgreementChecked}
          formData={formData}
          setFormData={setFormData}
          handleTryAutofillUserData={handleTryAutofillUserData}
          hasAlreadyAutoFilled={hasAlreadyAutoFilled}
          downloadCampRules={downloadCampRules}
          isLoading={isLoading}
          errorMessages={errorMessages}
          setErrorMessages={setErrorMessages}
        />
      ) : (
        <FullyBooked></FullyBooked>
      )}

      {isLoading && <LoadingIcon />}
    </FormCard>
  );
};

const FullyBooked = () => {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4 mx-4">Ne pare rău</h1>
      <p>
        Locurile din tabără au fost ocupate!
        <br />
        Vestea bună e că ne poți vizita pe timp de zi!
      </p>
    </div>
  );
};

export default Register;
