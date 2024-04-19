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

export function AuthProvider({ children }) {
  const [authData, setAuthData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false); // Set to false initially
  const [loading, setLoading] = useState(true); // Set to true initially

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setAuthData(user);
        setUserLoggedIn(true);
        const userData = await getUserData(user.uid);
        setUserData(userData);
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
  };

  // Check if loading is true, if so, return a loading indicator
  if (loading) {
    return <div>Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
