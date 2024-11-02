//TODO: for all files and folders -> do a proper cleanup in the naming
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Do not modify these values. Btw, these are safe to be exposed.
const firebaseConfig = {
  apiKey: "AIzaSyBJ-cSG85gb26t-0Vhw-x0srcPsSEh6ySE",
  authDomain: "hopecamp-f270b.firebaseapp.com",
  projectId: "hopecamp-f270b",
  storageBucket: "hopecamp-f270b.appspot.com",
  messagingSenderId: "548431197388",
  appId: "1:548431197388:web:b5f9674941cffdbee73e69",
  measurementId: "G-ZL8G2F58VN", //optional
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
