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

  const handleSubmit = async () => {
    setIsLoading(true);
    if (agreementChecked) {
      const result = await registerAndCreateUser(formData, imageFile);
      if (!result.success) {
        setErrorMessages((prevMessages) => [...prevMessages, result.message]);
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

  return (
    <FormCard>
      {userLoggedIn && <Navigate to={"/cont?alreadyLoggedIn"} replace={true} />}

      <MultiStepForm
        handleSubmit={handleSubmit}
        handleImageChange={handleImageChange}
        agreementChecked={agreementChecked}
        setAgreementChecked={setAgreementChecked}
        formData={formData}
        setFormData={setFormData}
        handleTryAutofillUserData={handleTryAutofillUserData}
        errorMessages={errorMessages}
        setErrorMessages={setErrorMessages}
      />
      {isLoading && <LoadingIcon />}
    </FormCard>
  );
};

export default Register;
