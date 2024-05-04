import React, { useState, useEffect } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/authContext";
import { getUserData } from "../../../firebase/database";
import UserData from "../../../models/UserData";
import ConfirmedUser from "./ConfirmedUser";
import PendingUser from "./PendingUser";
import LoadingIcon from "../../LoadingIcon";
import { pages } from "../../../constants";
import FormCard from "../FormCard";
import FormButton from "../FormButton";

//TODO: Style this component and the children components

//TODO: Treat the case when we get alreadyLoggedIn as a url parameter.
// In this case we should show a warning message that the user is already logged in, and for registering another user, they should log themselves out first.

const Account = () => {
  const { authData, userData, userLoggedIn, loading, error } = useAuth();
  const navigate = useNavigate();

  if (!userLoggedIn) {
    return <Navigate to={pages.login} replace={true} />;
  }

  if (userData === null || userData === undefined || loading) {
    // This should only based on "laoding" but it's a temporary solution, since there's a bug in the authContext
    return <LoadingIcon />;
  }

  return (
    <>
      {!loading && (
        <FormCard>
          {/* <div className="w-96 text-gray-600 space-y-5 p-4 pb-8 shadow-xl border rounded-xl"> */}
          <div className="text-right">
            <Link to={pages.logout}>
              <FormButton action="delete">Logout</FormButton>
            </Link>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-black text-center ">Contul meu</h2>
          </div>
          <div>
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
        </FormCard>
      )}
    </>
  );
};

export default Account;
