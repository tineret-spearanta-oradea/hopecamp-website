import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../../../contexts/authContext";
import { doPasswordReset } from "../../../firebase/auth";
import { pages } from "../../../constants";

const ResetPassword = () => {
  const { authData, userData, userLoggedIn, loading, error } = useAuth();
  const [emailInput, setEmailInput] = useState("");
  const [emailSentTo, setEmailSentTo] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);
  const [isResetting, setIsResetting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    // Call firebase reset password
    setIsResetting(true);
    try {
      await doPasswordReset(emailInput);
      setErrorMessages("");
    } catch (error) {
      setErrorMessages(["Eroare: " + error.code]);
    }
    setIsResetting(false);
    setIsEmailSent(true);
    setEmailSentTo(emailInput);
  };

  return (
    <div>
      {userLoggedIn && <Navigate to={"/cont?alreadyLoggedIn"} replace={true} />}

      <main className="w-full h-screen flex self-center place-content-center place-items-center">
        <div className="w-96 text-gray-600 space-y-5 p-4 pb-8 shadow-xl border rounded-xl">
          <div className="text-center">
            <div className="mt-2">
              <h3 className="text-gray-800 text-xl font-semibold sm:text-2xl">
                Resetare parola
              </h3>
            </div>
            {isEmailSent && emailInput === emailSentTo ? (
              <p className="mt-4 text-sm text-indigo-600">
                Un email a fost trimis la adresa {emailInput}. Verifică-ți
                inbox-ul pentru a reseta parola.
              </p>
            ) : (
              <p className="mt-4 text-sm text-gray-600">
                Introdu adresa de email pentru a primi un link de resetare a
                parolei.
              </p>
            )}
          </div>
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-gray-600 font-bold">Email</label>
              <input
                type="email"
                autoComplete="email"
                required
                disabled={isResetting}
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value);
                }}
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
              />
            </div>

            {errorMessages && errorMessages.length > 0 && (
              <ErrorAlert messages={errorMessages} />
            )}

            <button
              type="submit"
              disabled={isResetting}
              className={`w-full px-4 py-2 text-white font-medium rounded-lg ${
                isResetting
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300"
              }`}
            >
              {isResetting ? "Trimitem mail..." : "Resetare parolǎ"}
            </button>
          </form>
          <p className="text-center text-sm ">
            Nu te-ai înscris încă în tabără?{" "}
            <Link
              to={pages.register}
              className="hover:underline font-bold text-blue-700"
            >
              Înscrie-te aici
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default ResetPassword;
