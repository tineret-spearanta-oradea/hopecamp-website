import React, { useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Navigate, Link, useNavigate } from "react-router-dom";
import MultiStepForm from "./MultiStepForm";
import { getArchivedUserData } from "../../../firebase/database";
import { registerAndCreateUser } from "../../../firebase";
import UserData from "../../../models/UserData";
import AuthData from "../../../models/AuthData";
import { useEffect } from "react";

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

  const handleTryGetUserDataFromArchive = async () => {
    const archivedUserData = await getArchivedUserData(formData.authData.email);
    if (archivedUserData !== null) {
      const userData = new UserData(
        archivedUserData.email,
        archivedUserData.name,
        archivedUserData.phone,
        archivedUserData.payTaxTo,
        archivedUserData.age,
        archivedUserData.church,
        archivedUserData.transport
      );
      setAutoFillData((prevData) => ({
        ...prevData,
        userData: userData,
      }));
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
            handleTryGetUserDataFromArchive={handleTryGetUserDataFromArchive}
            autoFillData={autoFillData}
          />
        </div>
      </main>
    </>
  );
};

export default Register;
