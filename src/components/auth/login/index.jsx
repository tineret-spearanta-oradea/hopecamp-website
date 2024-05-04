import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { doSignInWithEmailAndPassword } from "../../../firebase/auth";
import { useAuth } from "../../../contexts/authContext";
import ErrorAlert from "../../ErrorAlert";
import { contactInfo, pages } from "../../../constants";

const Login = () => {
  const { authData, userData, userLoggedIn, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  if (userLoggedIn) {
    return <Navigate to={pages.account} replace={true} />;
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
            <Link
              to={pages.register}
              className="hover:underline font-bold text-blue-700"
            >
              Email sau parolă greșită. Daca nu te-ai înscris, o poți face aici.
            </Link>,
          ]);
        } else {
          setErrorMessages([
            `Eroare: ${authError.code}. \n Dacǎ problema persistǎ, te rugǎm sǎ ne contactezi la ${contactInfo.phone}.`,
          ]);
        }
      }
      setIsSigningIn(false);
    }
  };

  return (
    <div>
      <main className="w-full h-screen flex self-center place-content-center place-items-center">
        <div className="w-96 text-gray-600 space-y-5 p-4 pb-8 shadow-xl border rounded-xl">
          <div className="text-center">
            <div className="mt-2">
              <h3 className="text-gray-800 text-xl font-semibold sm:text-2xl">
                Conectare cont
              </h3>
            </div>
          </div>
          {/* // TODO: Use TextInputField component. */}
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-gray-600 font-bold">Email</label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 font-bold">Parolă</label>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
              />
            </div>
            <div className="text-right text-sm">
              <Link
                to={pages.resetPassword}
                className="hover:underline font-bold text-blue-700"
              >
                Am uitat parola
              </Link>
            </div>

            {errorMessages && errorMessages.length > 0 && (
              <ErrorAlert messages={errorMessages} />
            )}

            <button
              type="submit"
              disabled={isSigningIn}
              className={`w-full px-4 py-2 text-white font-medium rounded-lg ${
                isSigningIn
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300"
              }`}
            >
              {isSigningIn ? "Logging In..." : "Log in"}
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

export default Login;
