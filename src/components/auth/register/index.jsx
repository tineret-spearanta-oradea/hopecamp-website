import React, { useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/authContext";
import MultiFormStep from "./MultiFormStep";
import { doCreateUserWithEmailAndPassword } from "../../../firebase/auth";
import { registerAndCreateUser } from "../../../firebase";
import UserData from "../../../models/UserData";

const Register = () => {
  const auth = getAuth();
  const [userData, setUserData] = useState(new UserData());

  const handleSubmit = async () => {
    registerAndCreateUser(userData);
  };

  const [loggedInUser, setLoggedInUser] = useState(null);
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in
      // user properties and method (docs): https://firebase.google.com/docs/reference/js/auth.user
      setLoggedInUser(user);
    } else {
      // User is signed out
    }
  });

  return (
    <>
      {/* TODO: Redirect to /cont page when it will be implemented */}
      {loggedInUser !== null && <Navigate to={"/"} replace={true} />}
      <main className="w-full h-screen flex self-center place-content-center place-items-center">
        <div className="w-96 text-gray-600 space-y-5 p-4 shadow-xl border rounded-xl">
          <MultiFormStep
            handleSubmit={handleSubmit}
            formData={userData}
            setFormData={setUserData}
          />
        </div>
      </main>
    </>
  );
};

export default Register;
