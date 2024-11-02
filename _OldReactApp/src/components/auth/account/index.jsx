import React, { useState, useEffect } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/authContext";
import { getUserData } from "../../../firebase/database";
import UserData from "../../../models/UserData";
import ConfirmedUser from "./ConfirmedUser";
import PendingUser from "./PendingUser";
import LoadingIcon from "../../LoadingIcon";
import { contactInfo, pages } from "../../../constants";
import FormCard from "../FormCard";
import FormButton from "../FormButton";
import ErrorAlert from "../../ErrorAlert";

//TODO: Style this component and the children components

//TODO: Treat the case when we get alreadyLoggedIn as a url parameter.
// In this case we should show a warning message that the user is already logged in, and for registering another user, they should log themselves out first.

const Account = () => {
  //get the alreadyLoggedIn parameter from the url
  const urlParams = new URLSearchParams(window.location.search);
  const alreadyLoggedIn = urlParams.get("alreadyLoggedIn");

  const { authData, userData, userLoggedIn, loading, error } = useAuth();
  const navigate = useNavigate();

  // I'm commenting this since the error appears before the data, at register time.
  // TODO: Review this and make it work as expected
  // if (
  //   !loading &&
  //   (userData === null || userData === undefined || !userLoggedIn) &&
  //   alreadyLoggedIn !== null
  // ) {
  //   return (
  //     <div className="text-center">
  //       <ErrorAlert
  //         messages={[
  //           <>
  //             Am întampinat o eroare. Dacǎ eroarea insistǎ, te rugam sa iei
  //             legatura cu noi la
  //             <br />
  //             <a className="text-hope-lightcyan" href={contactInfo.whatsapp}>
  //               {contactInfo.phone}
  //             </a>{" "}
  //           </>,
  //         ]}
  //         displayMode={"popup"}
  //       />
  //     </div>
  //   );
  // }

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
          <div className="flex justify-between">
            <Link to={pages.home}>
              <FormButton action="back">Home</FormButton>
            </Link>
            <Link to={pages.logout}>
              <FormButton action="delete">Logout</FormButton>
            </Link>
          </div>
          <div className="t</Link>ext-center">
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
