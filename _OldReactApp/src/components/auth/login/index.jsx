import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { doSignInWithEmailAndPassword } from "../../../firebase/auth";
import { useAuth } from "../../../contexts/authContext";
import ErrorAlert from "../../ErrorAlert";
import { contactInfo, pages } from "../../../constants";
import FormCard from "../FormCard";
import TextInputField from "../TextInputField";
import FormButton from "../FormButton";

const Login = () => {
  const { authData, userData, userLoggedIn, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  const queryParameters = new URLSearchParams(window.location.search);
  const origin = queryParameters.get("origin");

  if (userLoggedIn) {
    console.log(origin);
    return origin ? (
      <Navigate to={`/${origin}`} replace={true} />
    ) : (
      <Navigate to={pages.account} replace={true} />
    );
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithEmailAndPassword(email, password);
      } catch (error) {
        if (error.code === "auth/invalid-credential") {
          setErrorMessages([
            <div>
              Email sau parolă greșită. Daca nu te-ai înscris, o poți face{" "}
              <Link
                to={pages.register}
                className="hover:underline text-blue-700"
              >
                aici.
              </Link>
            </div>,
          ]);
        } else {
          setErrorMessages([
            `Eroare: ${authError.code}. \n Dacă problema persistă, te rugăm să ne contactezi la ${contactInfo.phone}.`,
          ]);
        }
      }
      setIsSigningIn(false);
    }
  };

  return (
    <FormCard>
      <div className="text-center max-w-lg mx-auto p-4">
        <div className="mt-2">
          <h2 className="text-xl font-black text-center ">Conectare cont</h2>
        </div>
      </div>
      <form onSubmit={onSubmit} className="space-y-5">
        <TextInputField
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextInputField
          label="Parolă"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="text-right text-sm">
          <Link
            to={
              origin
                ? pages.resetPassword + `?origin=${origin}`
                : pages.resetPassword
            }
            className="hover:underline font-bold text-hope-darkcyan"
          >
            Am uitat parola
          </Link>
        </div>

        {errorMessages && errorMessages.length > 0 && (
          <ErrorAlert messages={errorMessages} />
        )}

        <FormButton action="submit" disabled={isSigningIn} extraStyles="w-full">
          {isSigningIn ? "Logging In..." : "Log in"}
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
  );
};

export default Login;
