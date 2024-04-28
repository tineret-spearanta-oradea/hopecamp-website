import React, { useContext, useState, useEffect } from "react";
import { auth } from "../../firebase/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { getUserData } from "../../firebase/database";

const AuthContext = React.createContext();

//TODO: *kind of optional, but would be cleaner*:
//Use auth context in the components instead of explicit firebase auth calls
export const useAuth = () => {
  return useContext(AuthContext);
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function AuthProvider({ children }) {
  const [authData, setAuthData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false); // Set to false initially
  const [loading, setLoading] = useState(true); // Set to true initially
  const [error, setError] = useState(null); // Set to true initially

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setAuthData(user);
        setUserLoggedIn(true);
        var keepTrying = 20;
        while (keepTrying >= 0) {
          await delay(100);
          const getUserDataResponse = await getUserData(user.uid);
          // for debugging:
          // console.log(keepTrying);
          // console.log(getUserDataResponse);
          if (getUserDataResponse) {
            setUserData(getUserDataResponse);
            break;
          }
          keepTrying--;
        }
        if (keepTrying == 0) {
          setError("Failed to get user data");
        }
      } else {
        setAuthData(null);
        setUserLoggedIn(false);
      }
      setLoading(false); // Set to false once we know the user's auth status
    });

    // Cleanup the subscription
    return unsubscribe;
  }, []);

  const value = {
    authData,
    userData,
    userLoggedIn,
    loading,
    error,
  };

  // Check if loading is true, if so, return a loading indicator
  if (loading) {
    return <div>Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
