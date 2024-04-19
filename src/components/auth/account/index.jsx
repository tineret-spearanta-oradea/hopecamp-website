import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../../../contexts/authContext";
import { getUserData } from "../../../firebase/database";
import UserData from "../../../models/UserData";
import ConfirmedUser from "./ConfirmedUser";
import PendingUser from "./PendingUser";

//TODO: Style this component and the children components
const Account = () => {
  const { authData, userData, userLoggedIn, loading } = useAuth();

  if (!userLoggedIn) {
    return <Navigate to={"/login"} replace={true} />;
  }

  return (
    <>
      {loading && <div>Loading.....</div>}
      {!loading && (
        <div>
          <main className="w-full h-screen flex self-center place-content-center place-items-center">
            <div className="w-96 text-gray-600 space-y-5 p-4 pb-8 shadow-xl border rounded-xl">
              <div className="mt-2 text-center">
                <h3 className="text-gray-800 text-xl font-semibold sm:text-2xl">
                  Contul meu
                </h3>
              </div>
              <div className="mt-4">
                <p>
                  <span className="font-semibold">Hello, </span>
                  {/* TODO: replace with name */}
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
