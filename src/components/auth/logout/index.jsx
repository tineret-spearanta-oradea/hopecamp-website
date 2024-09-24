import React, { useEffect } from "react";
import { doSignOut } from "../../../firebase/auth";
import { useAuth } from "../../../contexts/authContext";
import { useNavigate } from "react-router-dom";
import LoadingIcon from "../../LoadingIcon";
import { pages } from "../../../constants";

const Logout = () => {
  const { authData, userData, userLoggedIn, loading, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      if (userLoggedIn) {
        await doSignOut();
      }
      navigate(pages.login);
    };

    handleLogout();
  }, []);

  return <LoadingIcon />;
};

export default Logout;
