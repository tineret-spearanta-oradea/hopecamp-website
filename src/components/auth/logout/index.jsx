import React from "react";
import { doSignOut } from "../../../firebase/auth";
import { useAuth } from "../../../contexts/authContext";
import { Navigate } from "react-router-dom";

const Logout = () => {
  const { authData, userData, userLoggedIn, loading, error } = useAuth();

  if (userLoggedIn) {
    doSignOut();
  }

  return (
    <>
      {loading && <div>Loading.....</div>}
      {!loading && <div></div>}
      <Navigate to={"/login"} replace={true} />
    </>
  );
};

export default Logout;
