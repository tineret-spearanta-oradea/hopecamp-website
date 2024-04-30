import React, { useState, useEffect } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/authContext";
import { getUserData } from "../../../firebase/database";
import UserData from "../../../models/UserData";
import ConfirmedUser from "./ConfirmedUser";
import PendingUser from "./PendingUser";

//TODO: Style this component and the children components

//TODO: Treat the case when we get alreadyLoggedIn as a url parameter.
// In this case we should show a warning message that the user is already logged in, and for registering another user, they should log themselves out first.

const Account = () => {
  const { authData, userData, userLoggedIn, loading, error } = useAuth();
  const navigate = useNavigate();

  const goToLogout = () => {
    navigate("/logout");
  };

  if (!userLoggedIn) {
    return <Navigate to={"/login"} replace={true} />;
  }

  return (
    <>
      {!loading && (
        <div>
          <main className="w-full h-screen flex self-center place-content-center place-items-center">
            <div className="w-96 text-gray-600 space-y-5 p-4 pb-8 shadow-xl border rounded-xl">
              <div className="text-right">
                <button
                  onClick={goToLogout}
                  className="m-2 py-1 px-4 bg-red-400 text-white rounded-md"
                >
                  Logout
                </button>
              </div>
              <div className="mt-2 text-center">
                <h3 className="text-gray-800 text-xl font-semibold sm:text-2xl">
                  Contul meu
                </h3>
              </div>
              <div className="mt-4">
                <p>
                  <span className="font-semibold">Hello, </span>
                  {userData.name}!
                </p>
                {!userData.isConfirmed && (
                  <PendingUser userData={userData}></PendingUser>
                )}
                {userData.isConfirmed && (
                  <ConfirmedUser userData={userData}></ConfirmedUser>
                )}
              </div>
            </div>
          </main>
        </div>
      )}
    </>
  );
};

export default Account;
