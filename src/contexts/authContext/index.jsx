import React, { useContext, useState, useEffect } from "react";
import { auth } from "../../firebase/firebase-config";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = React.createContext();

export const useAuth = () => {
    return useContext(AuthContext);
  };

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [UserLoggedIn, setUserLoggedIn] = useState(false); // Set to false initially
    const [loading, setLoading] = useState(true); // Set to true initially

    useEffect( () => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                setCurrentUser(user);
                setUserLoggedIn(true);
            } else {
                setCurrentUser(null);
                setUserLoggedIn(false);
            }
            setLoading(false); // Set to false once we know the user's auth status
        });

        // Cleanup the subscription
        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        UserLoggedIn,
        loading
    };

    // Check if loading is true, if so, return a loading indicator
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
