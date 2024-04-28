import React, { useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Navigate, Link, useNavigate } from "react-router-dom";
import MultiStepForm from "./MultiStepForm";
import { getArchivedUserData } from "../../../firebase/database";
import { registerAndCreateUser } from "../../../firebase";
import UserData from "../../../models/UserData";
import NavigationBar from "../../navigationBar";
import AuthData from "../../../models/AuthData";
import { useEffect } from "react";
import { payTaxToOptions } from "../../../models/Options";

const Register = () => {
  const auth = getAuth();
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

  const handleSubmit = async () => {
    if (agreementChecked) {
      registerAndCreateUser(formData, imageFile);
    }
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

  const [loggedInUser, setLoggedInUser] = useState(null);
  onAuthStateChanged(auth, (user) => {
    if (user) {
      //TODO: review if this is a correct way to handle user state.
      setLoggedInUser(user); // (docs): https://firebase.google.com/docs/reference/js/auth.user
    } else {
      // User is signed out
    }
  });

  return (
    <>
      {loggedInUser !== null && <Navigate to={"/cont"} replace={true} />}
      <main className="w-full h-screen flex self-center place-content-center place-items-center">
        <div className="w-96 text-gray-600 space-y-5 p-4 shadow-xl border rounded-xl">
          <MultiStepForm
            handleSubmit={handleSubmit}
            handleImageChange={handleImageChange}
            agreementChecked={agreementChecked}
            setAgreementChecked={setAgreementChecked}
            formData={formData}
            setFormData={setFormData}
            handleTryAutofillUserData={handleTryAutofillUserData}
          />
        </div>
      </main>
    </>
  );
};

export default Register;
