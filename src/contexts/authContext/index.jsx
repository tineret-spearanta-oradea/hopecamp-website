import React, { useContext, useState, useEffect } from "react";
import { auth } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth(){
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [UserLoggedIn, setUserLoggedIn] = useState(null);
    const [loading, setloading] = useState(null);

    useEffect( () => {
        const unsubscribe = onAuthStateChanged(auth, initializeUser);
        return unsubscribe;
    }, [])

    async function initializeUser(user) {
        if(user){
            setCurrentUser({ ...user });
            setUserLoggedIn(true);
        } else {
            setloading(false);
        }
    }

    const value = {
        currentUser, 
        UserLoggedIn,
        loading
    }

    return (
        <AuthProvider.Provider value={value}>
            {!loading && children}
        </AuthProvider.Provider>
    )

}