import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import MultiStepForm from "./MultiStepForm";
import { getArchivedUserData } from "../../../firebase/database";
import { registerAndCreateUser } from "../../../firebase";
import UserData from "../../../models/UserData";
import AuthData from "../../../models/AuthData";
import { payTaxToOptions } from "../../../models/Options";
import { useAuth } from "../../../contexts/authContext";
import LoadingIcon from "../../LoadingIcon";

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
  const [errorAuthMessages, setErrorAuthMessages] = useState([]);

  const handleSubmit = async () => {
    setIsLoading(true);
    if (agreementChecked) {
      const result = await registerAndCreateUser(formData, imageFile);
      if (!result.success) {
        setErrorAuthMessages([result.message]);
      } else {
        setErrorAuthMessages([]);
        // handle success
      }
      navigate("/cont");
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
    <>
      {userLoggedIn && <Navigate to={"/cont?alreadyLoggedIn"} replace={true} />}
      <main className="flex flex-col justify-center items-center min-h-screen p-6">
        <div className="w-full max-w-md text-gray-600 space-y-5 p-4 shadow-xl border rounded-xl">
          <MultiStepForm
            handleSubmit={handleSubmit}
            handleImageChange={handleImageChange}
            agreementChecked={agreementChecked}
            setAgreementChecked={setAgreementChecked}
            formData={formData}
            setFormData={setFormData}
            handleTryAutofillUserData={handleTryAutofillUserData}
            errorAuthMessages={errorAuthMessages}
          />
        </div>
      </main>
      {isLoading && <LoadingIcon />}
    </>
  );
};

export default Register;
