//This file will call the functions related to the firebase database
import { db } from "./firebase-config";
import { doc, setDoc, Timestamp } from "firebase/firestore";

export const writeUserData = async (userData) => {
  console.log(userData);

  const docData = {
    fullName: userData.uid,
    email: userData.email,
    // imageUrl: userData.imageUrl,
    // phone: userData.phone,
  };

  await setDoc(doc(db, "users", userData.uid), docData);
};
