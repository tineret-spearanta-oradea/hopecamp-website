import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../../../contexts/authContext";
import { doPasswordReset } from "../../../firebase/auth";
import { pages } from "../../../constants";
import FormCard from "../FormCard";
import FormButton from "../FormButton";

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
      <FormCard>
        <div className="text-center">
          <div className="mt-2">
            <h3 className="text-gray-800 text-xl font-semibold sm:text-2xl">
              Resetare parola
            </h3>
          </div>
          {isEmailSent && emailInput === emailSentTo ? (
            <p className="mt-4 text-sm text-hope-lightcyan">
              Un email a fost trimis la adresa {emailInput}. Verifică-ți
              inbox-ul sau folderul de spam pentru a reseta parola.
            </p>
          ) : (
            <p className="mt-4 text-sm text-gray-600">
              Introdu adresa de email pentru a primi un link de resetare a
              parolei.
            </p>
          )}
          {isEmailSent && (
            <Link to={pages.login} className="">
              <FormButton
                action="back"
                disabled={isResetting}
                extraStyles="mt-4"
              >
                ← Înapoi la login
              </FormButton>
            </Link>
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
              className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-hope-lightcyan shadow-sm rounded-lg transition duration-300"
            />
          </div>

          {errorMessages && errorMessages.length > 0 && (
            <ErrorAlert messages={errorMessages} />
          )}

          <FormButton
            action="submit"
            disabled={isResetting}
            extraStyles="w-full"
          >
            {isResetting ? "Trimitem mail..." : "Resetare parolǎ"}
          </FormButton>
        </form>
        <p className="text-center text-sm ">
          Nu te-ai înscris încă în tabără?{" "}
          <Link
            to={pages.register}
            className="hover:underline font-bold text-hope-darkcyan"
          >
            Înscrie-te aici
          </Link>
        </p>
      </FormCard>
    </div>
  );
};

export default ResetPassword;
