import React, { useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/authContext";
import MultiFormStep from "./MultiFormStep";
import { doCreateUserWithEmailAndPassword } from "../../../firebase/auth";

const Register = () => {
  const { userLoggedIn } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });

  const handleSubmit = async () => {
    e.preventDefault();

    await doCreateUserWithEmailAndPassword(
      formData["email"],
      formData["password"]
    );
  };

  return (
    <>
      {userLoggedIn && <Navigate to={"/home"} replace={true} />}
      <main className="w-full h-screen flex self-center place-content-center place-items-center">
        <div className="w-96 text-gray-600 space-y-5 p-4 shadow-xl border rounded-xl">
          <MultiFormStep
            handleSubmit={handleSubmit}
            formData={formData}
            setFormData={setFormData}
          />
        </div>
      </main>
    </>
  );
};

export default Register;
